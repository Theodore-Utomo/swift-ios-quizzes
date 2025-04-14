from pydantic import BaseModel
from typing import List, Union

class Question(BaseModel):
    question_number: int
    question_type: str
    question_text: str
    question_options: List[str]
    question_answer: Union[str, List[str]]
    question_hint: str
    
class Quiz(BaseModel):
    id: str
    name: str
    content: List[Question]