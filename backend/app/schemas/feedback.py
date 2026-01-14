from pydantic import BaseModel
from datetime import datetime

class FeedbackSubmission(BaseModel):
  feedback_body: str
  submitted_at: datetime
  user_id: str

