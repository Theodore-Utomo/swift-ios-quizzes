from pydantic import BaseModel
from typing import List, Union
from enum import Enum


class QuestionType(str, Enum):
    """Question type enumeration."""
    MCQ = "MCQ"
    MULTIPLE_ANSWER = "Multiple_answer"
    SHORT_ANSWER = "Short_answer"


class Question(BaseModel):
    question_number: int
    question_type: QuestionType
    question_text: str
    question_options: List[str]
    question_answer: Union[str, List[str]]
    question_hint: str


class Quiz(BaseModel):
    id: str
    name: str
    content: List[Question]
