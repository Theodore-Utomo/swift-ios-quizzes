/**
 * Quiz progress-related types and enums
 */

export enum QuizProgressStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ABANDONED = "abandoned"
}

export interface QuizProgress {
  id: string;
  quiz_id?: string;
  quiz_name?: string;
  current_question?: number;
  answers?: Record<number, string | string[]>;
  status: QuizProgressStatus;
  score?: number;
  total_questions?: number;
  started_at?: string;
  updated_at?: string;
}

export interface QuizProgressSubmission {
  current_question: number;
  answers: Record<number, string | string[]>;
  status: QuizProgressStatus;
  score: number;
  total_questions: number;
  quiz_name: string;
}
