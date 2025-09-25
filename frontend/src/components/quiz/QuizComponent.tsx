import React, { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { useUserApi } from "../../hooks/useUserApi";
import { Quiz, QuestionType } from "../../types/quiz";
import { QuizProgressStatus } from "../../types/progress";

interface QuizComponentProps {
  quiz: Quiz;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
  const [results, setResults] = useState<Record<number, boolean>>({});
  const [score, setScore] = useState<number | null>(null);
  const total = quiz.content.length;
  
  const userApi = useUserApi();

  const handleAnswerSelect = (questionNumber: number, answer: string | string[]) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const handleSubmit = async () => {
    let correctCount = 0;
    const newResults: Record<number, boolean> = {};

    quiz.content.forEach((question) => {
      const userAnswer = selectedAnswers[question.question_number];
      const correctAnswer = question.question_answer;

      if (question.question_type === QuestionType.MCQ) {
        newResults[question.question_number] = userAnswer === correctAnswer;
      } else if (question.question_type === QuestionType.MULTIPLE_ANSWER) {
        newResults[question.question_number] =
          Array.isArray(userAnswer) &&
          userAnswer.length === (correctAnswer as string[]).length &&
          userAnswer.every((ans) => (correctAnswer as string[]).includes(ans));
      } else if (question.question_type === QuestionType.SHORT_ANSWER) {
        if (typeof userAnswer === "string") {
          if (Array.isArray(correctAnswer)) {
            newResults[question.question_number] = correctAnswer.some(
              (correct) => correct.toLowerCase() === userAnswer.toLowerCase()
            );
          } else {
            newResults[question.question_number] =
              correctAnswer.toLowerCase() === userAnswer.toLowerCase();
          }
        } else {
          newResults[question.question_number] = false;
        }
      }

      if (newResults[question.question_number]) correctCount++;
    });

    setResults(newResults);
    setScore(correctCount);

    try {
      await userApi.submitMyQuizProgress(quiz.id, {
        current_question: 1,
        answers: selectedAnswers,
        status: QuizProgressStatus.COMPLETED,
        score: correctCount,
        total_questions: total,
        quiz_name: quiz.name,
      });
    } catch (error) {
      console.log(error);
    }

  };
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.name}</CardTitle>
          <CardDescription>Answer all questions and submit to see your score.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.content.map((q) => (
            <div key={q.question_number} className="space-y-3">
              <div className="font-medium flex items-start gap-2">
                <span className="text-primary font-semibold">{q.question_number}.</span>
                <div className="flex-1">
                  <MarkdownRenderer content={q.question_text} />
                </div>
              </div>
              <div className="space-y-2">
                {(q.question_type === QuestionType.MCQ || q.question_type === QuestionType.MULTIPLE_ANSWER) && (
                  <div className="grid gap-2">
                    {q.question_options.map((option) => {
                      const name = `question-${q.question_number}`;
                      const isMulti = q.question_type === QuestionType.MULTIPLE_ANSWER;
                      const checked = isMulti
                        ? Array.isArray(selectedAnswers[q.question_number]) &&
                        (selectedAnswers[q.question_number] as string[]).includes(option)
                        : selectedAnswers[q.question_number] === option;
                      return (
                        <label
                          key={option}
                          className="flex items-center gap-2 rounded-md border p-2 hover:bg-accent"
                        >
                          <input
                            type={isMulti ? "checkbox" : "radio"}
                            name={name}
                            value={option}
                            checked={checked}
                            onChange={(e) => {
                              if (!isMulti) {
                                handleAnswerSelect(q.question_number, option);
                              } else {
                                const current = (selectedAnswers[q.question_number] || []) as string[];
                                const updated = e.target.checked
                                  ? [...current, option]
                                  : current.filter((ans) => ans !== option);
                                handleAnswerSelect(q.question_number, updated);
                              }
                            }}
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
                {q.question_type === QuestionType.SHORT_ANSWER && (
                  <input
                    type="text"
                    className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Enter your answer"
                    onChange={(e) => handleAnswerSelect(q.question_number, e.target.value)}
                  />
                )}
              </div>
              {results[q.question_number] !== undefined && (
                <p className={results[q.question_number] ? "text-green-600" : "text-destructive"}>
                  {results[q.question_number] ? "Correct!" : "Incorrect!"}
                </p>
              )}
              {score !== null && q.question_hint && (
                <p className="text-muted-foreground text-sm">Hint: {q.question_hint}</p>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {score !== null ? `Score: ${score} / ${total}` : `${total} question(s)`}
          </span>
          <Button onClick={handleSubmit}>Submit Answers</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizComponent;