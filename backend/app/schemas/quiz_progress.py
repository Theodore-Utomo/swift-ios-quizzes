from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Optional

class QuizProgress(BaseModel):
    current_question: int
    answers: Dict[str, str] = {}  # Map of question IDs to answers
    status: str                   # e.g., "in-progress", "completed"
    score: Optional[int] = None
    total_questions: Optional[int] = None
    quiz_name: Optional[str] = None   # <-- New field for quiz name
    started_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
