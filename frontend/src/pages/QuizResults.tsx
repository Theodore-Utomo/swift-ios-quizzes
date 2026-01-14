import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Quiz, QuestionType } from "../types/quiz";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MarkdownRenderer } from "../components/ui/markdown-renderer";

interface QuizResultsLocationState {
  quiz: Quiz;
  selectedAnswers: Record<number, string | string[]>;
  results: Record<number, boolean>;
  score: number;
  total: number;
  courseId: string;
}

const QuizResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as QuizResultsLocationState | null;

  if (!state) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              We couldn&apos;t find your quiz attempt. Please retake the quiz to see your results.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => navigate("/home")}>
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { quiz, selectedAnswers, results, score, total, courseId } = state;

  const formatUserAnswer = (answer: string | string[] | undefined): string => {
    if (!answer) return "No answer submitted";
    if (Array.isArray(answer)) {
      if (answer.length === 0) return "No answer submitted";
      return answer.join(", ");
    }
    return answer;
  };

  const formatCorrectAnswer = (questionType: QuestionType, rawAnswer: string | string[]): string => {
    if (questionType === QuestionType.MULTIPLE_ANSWER) {
      let correctAnswerArray: string[] = [];

      if (Array.isArray(rawAnswer)) {
        correctAnswerArray = rawAnswer;
      } else if (typeof rawAnswer === "string") {
        if (rawAnswer.startsWith("[") && rawAnswer.endsWith("]")) {
          try {
            correctAnswerArray = JSON.parse(rawAnswer);
          } catch {
            correctAnswerArray = rawAnswer.split(", ").filter((a) => a.trim());
          }
        } else {
          correctAnswerArray = rawAnswer ? rawAnswer.split(", ").filter((a) => a.trim()) : [];
        }
      }

      if (correctAnswerArray.length === 0) return "No correct answers configured";
      return correctAnswerArray.join(", ");
    }

    if (questionType === QuestionType.SHORT_ANSWER) {
      if (Array.isArray(rawAnswer)) {
        if (rawAnswer.length === 0) return "No correct answers configured";
        return rawAnswer.join(", ");
      }
      return rawAnswer || "No correct answer configured";
    }

    // MCQ
    if (Array.isArray(rawAnswer)) {
      if (rawAnswer.length === 0) return "No correct answer configured";
      return rawAnswer[0];
    }
    return rawAnswer || "No correct answer configured";
  };

  const handleRetry = () => {
    navigate(`/courses/${courseId}/quizzes/${quiz.id}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.name} - Results</CardTitle>
          <CardDescription>
            Review your answers compared to the correct answers. You can retry the quiz if you&apos;d like.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {quiz.content.map((question) => {
            const userAnswer = selectedAnswers[question.question_number];
            const isCorrect = results[question.question_number];
            const correctAnswer = formatCorrectAnswer(question.question_type, question.question_answer);

            return (
              <div
                key={question.question_number}
                className="space-y-3 rounded-md border p-4 bg-muted/50"
              >
                <div className="font-medium flex items-start gap-2">
                  <span className="text-primary font-semibold">{question.question_number}.</span>
                  <div className="flex-1">
                    <MarkdownRenderer content={question.question_text} />
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <p className={isCorrect ? "text-green-600" : "text-destructive"}>
                    {isCorrect ? "Your answer is correct." : "Your answer is incorrect."}
                  </p>
                  <p>
                    <span className="font-semibold">Your answer:</span>{" "}
                    <span>{formatUserAnswer(userAnswer)}</span>
                  </p>
                  <p>
                    <span className="font-semibold">Correct answer:</span>{" "}
                    <span>{correctAnswer}</span>
                  </p>
                  {question.question_hint && (
                    <p className="text-muted-foreground">
                      <span className="font-semibold"></span> {question.question_hint}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
          <div className="flex items-center justify-between">
            <span className="font-medium">
              Score: {score} / {total}
            </span>
            <Button onClick={handleRetry}>Retry Quiz</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizResultsPage;

