from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Optional, Union, List
from .quiz_progress_status_enum import QuizProgressStatus


class QuizProgressSubmission(BaseModel):
    current_question: int
    answers: Dict[str, Union[str, List[str]]] = {}  
    status: QuizProgressStatus
    score: Optional[int] = None
    total_questions: Optional[int] = None
    quiz_name: Optional[str] = None  


class QuizProgress(BaseModel):
    id: str
    current_question: int
    answers: Dict[str, Union[str, List[str]]] = {}  
    status: QuizProgressStatus
    score: Optional[int] = None
    total_questions: Optional[int] = None
    quiz_name: Optional[str] = None  
    started_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    quiz_id: Optional[str] = None
