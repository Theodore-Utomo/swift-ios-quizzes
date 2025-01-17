from pydantic import BaseModel
from typing import List

class Question(BaseModel):
    question: str
    options: List[str]
    correct_option: int

class Quiz(BaseModel):
    title: str
    description: str
    questions: List[Question]