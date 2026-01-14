"""
Feedback management service.
"""

from fastapi import HTTPException
from typing import List
from app.schemas.feedback import FeedbackSubmission
from app.database import db

class FeedbackService:
  """Service for feedback management operations."""

  @staticmethod
  async def create_record(feedback: FeedbackSubmission):
    """Create a new feedback record."""
    feedback_ref = db.collection("feedback").document()
    feedback_dict = feedback.dict()
    feedback_ref.set(feedback_dict)
    return feedback
