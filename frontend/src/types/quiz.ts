/**
 * Quiz-related types and enums
 */

export enum QuestionType {
  MCQ = "MCQ",
  MULTIPLE_ANSWER = "Multiple_answer",
  SHORT_ANSWER = "Short_answer"
}

export interface Question {
  question_number: number;
  question_type: QuestionType;
  question_text: string;
  question_options: string[];
  question_answer: string | string[];
  question_hint: string;
}

export interface Quiz {
  id: string;
  name: string;
  content: Question[];
}
