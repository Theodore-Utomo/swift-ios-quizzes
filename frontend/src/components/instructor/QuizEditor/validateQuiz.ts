import { Quiz, QuestionType } from "../../../types/quiz";

/**
 * Validates a quiz and returns the first error message, or null if valid.
 */
export function validateQuiz(quiz: Quiz): string | null {
  if (!quiz.name.trim()) {
    return "Please enter a quiz name";
  }

  if (quiz.content.length === 0) {
    return "Please add at least one question";
  }

  for (const question of quiz.content) {
    if (!question.question_text.trim()) {
      return "Please fill in all question texts";
    }

    if (
      (question.question_type === QuestionType.MCQ ||
        question.question_type === QuestionType.MULTIPLE_ANSWER) &&
      question.question_options.length < 2
    ) {
      return "Multiple choice questions must have at least 2 options";
    }

    if (
      !question.question_answer ||
      (typeof question.question_answer === "string" &&
        !question.question_answer.trim()) ||
      (Array.isArray(question.question_answer) &&
        question.question_answer.length === 0)
    ) {
      return "Please provide answers for all questions";
    }

    if (
      question.question_type === QuestionType.MCQ ||
      question.question_type === QuestionType.MULTIPLE_ANSWER
    ) {
      let answerArray: string[];

      if (question.question_type === QuestionType.MCQ) {
        answerArray =
          typeof question.question_answer === "string"
            ? [question.question_answer].filter((a) => a.trim())
            : Array.isArray(question.question_answer)
              ? question.question_answer
              : [];
      } else {
        if (Array.isArray(question.question_answer)) {
          answerArray = question.question_answer;
        } else if (typeof question.question_answer === "string") {
          if (
            question.question_answer.startsWith("[") &&
            question.question_answer.endsWith("]")
          ) {
            try {
              answerArray = JSON.parse(question.question_answer);
            } catch {
              answerArray = [];
            }
          } else {
            answerArray = question.question_answer
              ? question.question_answer.split(", ").filter((a) => a.trim())
              : [];
          }
        } else {
          answerArray = [];
        }
      }

      const invalidAnswers = answerArray.filter(
        (answer) => !question.question_options.includes(answer)
      );
      if (invalidAnswers.length > 0) {
        return `Invalid answer(s) for question ${question.question_number}: ${invalidAnswers.join(", ")}. Please select from available options.`;
      }
    }
  }

  return null;
}
