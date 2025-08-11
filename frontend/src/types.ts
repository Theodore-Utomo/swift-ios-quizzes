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
  

export interface TokenResponse {
    access_token: string;
    token_type: string;
}

export interface LoginProps {
    onLogin: (token: string) => void;
}

// Class types
export interface ClassCreate {
    name: string;
}

export interface ClassOut {
    class_id: string;
    name: string;
}

// Quiz Progress types
export interface QuizProgress {
    quiz_id?: string;
    quiz_name?: string;
    current_question?: number;
    answers?: Record<number, string | string[]>;
    status: string;
    score?: number;
    total_questions?: number;
    started_at?: string;
    updated_at?: string;
}

export interface QuizProgressSubmission {
    current_question: number;
    answers: Record<number, string | string[]>;
    status: string;
    score: number;
    total_questions: number;
    quiz_name: string;
}

// Auth types
export interface AuthRequest {
    session_token: string;
}