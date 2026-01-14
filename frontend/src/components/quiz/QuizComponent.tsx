import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Button } from "../ui/button";
import { MarkdownRenderer } from "../ui/markdown-renderer";
import { useUserApi } from "../../hooks/useUserApi";
import { Quiz, QuestionType } from "../../types/quiz";
import { QuizProgressStatus } from "../../types/progress";

interface QuizComponentProps {
  quiz: Quiz;
  courseId: string;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, courseId }) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string | string[]>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const total = quiz.content.length;
  
  const userApi = useUserApi();
  const navigate = useNavigate();

  const handleAnswerSelect = (questionNumber: number, answer: string | string[]) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionNumber]: answer }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    let correctCount = 0;
    const results: Record<number, boolean> = {};

    quiz.content.forEach((question) => {
      const userAnswer = selectedAnswers[question.question_number];
      const correctAnswer = question.question_answer;
      let isCorrect = false;

      if (question.question_type === QuestionType.MCQ) {
        isCorrect = userAnswer === correctAnswer;
        if (isCorrect) correctCount++;
      } else if (question.question_type === QuestionType.MULTIPLE_ANSWER) {
        let correctAnswerArray: string[];
        if (Array.isArray(correctAnswer)) {
          correctAnswerArray = correctAnswer;
        } else if (typeof correctAnswer === "string") {
          if (correctAnswer.startsWith('[') && correctAnswer.endsWith(']')) {
            try {
              correctAnswerArray = JSON.parse(correctAnswer);
            } catch {
              correctAnswerArray = correctAnswer.split(", ").filter(a => a.trim());
            }
          } else {
            correctAnswerArray = correctAnswer ? correctAnswer.split(", ").filter(a => a.trim()) : [];
          }
        } else {
          correctAnswerArray = [];
        }

        isCorrect =
          Array.isArray(userAnswer) &&
          userAnswer.length === correctAnswerArray.length &&
          userAnswer.every((ans) => correctAnswerArray.includes(ans));
        if (isCorrect) correctCount++;
      } else if (question.question_type === QuestionType.SHORT_ANSWER) {
        if (typeof userAnswer === "string") {
          if (Array.isArray(correctAnswer)) {
            isCorrect = correctAnswer.some((correct) => correct.toLowerCase() === userAnswer.toLowerCase());
          } else {
            isCorrect = correctAnswer.toLowerCase() === userAnswer.toLowerCase();
          }
          if (isCorrect) correctCount++;
        }
      }

      results[question.question_number] = isCorrect;
    });

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

    navigate(`/courses/${courseId}/quizzes/${quiz.id}/results`, {
      state: {
        quiz,
        selectedAnswers,
        results,
        score: correctCount,
        total,
        courseId,
      },
    });
  };

  if (isSubmitting) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-lg font-medium">Submitting your answers...</p>
            <p className="text-sm text-muted-foreground mt-2">Please wait while we process your quiz.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {score !== null ? `Score: ${score} / ${total}` : `${total} question(s)`}
          </span>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Answers"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizComponent;