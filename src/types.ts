export interface Question {
    question_number: number;
    question_type: 'MCQ' | 'Multiple_answer' | 'Short_answer';
    question_text: string;
    question_options: string[];
    question_answer: string | string[];
    question_hint: string;
}

export interface Quiz {
    id: number;
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