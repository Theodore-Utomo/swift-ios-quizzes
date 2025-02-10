export interface Question {
    question_number: number;
    question_type: 'MCQ' | 'Multiple_answer' | 'Short_answer';
    question_text: string;
    question_options: string[];
    question_answer: string | string[];
}

export interface Quiz {
    id: number;
    name: string;
    content: Question[];
}
