"""
Quiz progress management service.
"""

from fastapi import HTTPException
from typing import List, Optional
from app.schemas.quiz import Quiz
from app.schemas.quiz_progress import QuizProgress, QuizProgressSubmission
from app.database import db
from datetime import datetime
import uuid

class QuizProgressService:
  """Service for quiz progress management operations."""

  @staticmethod
  def _generate_quiz_progress_id() -> str:
      """Generate a unique quiz progress ID."""
      return str(uuid.uuid4())

  @staticmethod
  async def find_first_record(user_id: str, quiz_id: str):
      """Get the first quiz progress record for a specific user and quiz."""
      # Verify user exists
      user_ref = db.collection("users").document(user_id)
      if not user_ref.get().exists:
          raise HTTPException(status_code=404, detail="User not found")

      # Query for the first progress record for this quiz
      progress_docs = (
          user_ref.collection("quizProgress")
          .where("quiz_id", "==", quiz_id)
          .order_by("started_at", direction="ASCENDING")
          .limit(1)
          .stream()
      )
      
      progress_list = list(progress_docs)
      if not progress_list:
          raise HTTPException(status_code=404, detail="Quiz progress not found")

      progress_data = progress_list[0].to_dict()
      progress_data["id"] = progress_list[0].id
      return progress_data

    
  @staticmethod
  async def create_record(user_id: str, quiz_id: str, progress: QuizProgressSubmission):
    """Create a new quiz progress record."""
    user_ref = db.collection("users").document(user_id)
    if not user_ref.get().exists:
      raise HTTPException(status_code=404, detail="User not found")

    # Generate a unique quiz progress ID
    quiz_progress_id = QuizProgressService._generate_quiz_progress_id()
    progress_ref = user_ref.collection("quizProgress").document(quiz_progress_id)

    now = datetime.utcnow()
    progress_data = progress.dict()
    if not progress_data.get("started_at"):
      progress_data["started_at"] = now
    progress_data["updated_at"] = now
    progress_data["quiz_id"] = quiz_id
    progress_data["id"] = quiz_progress_id

    progress_ref.set(progress_data)
    return progress_data
      
  @staticmethod
  async def update_record(quiz_progress_id: str, user_id: str, quiz_id: str, progress: QuizProgress):
    """Update an existing quiz progress record."""
    user_ref = db.collection("users").document(user_id)
    if not user_ref.get().exists:
      raise HTTPException(status_code=404, detail="User not found")
    
    progress_ref = user_ref.collection("quizProgress").document(quiz_progress_id)
    if not progress_ref.get().exists:
      raise HTTPException(status_code=404, detail="Quiz progress not found")
    
    progress_data = progress.dict()
    progress_data["updated_at"] = datetime.utcnow()
    progress_data["quiz_id"] = quiz_id
    progress_data["id"] = quiz_progress_id
    
    progress_ref.set(progress_data, merge=True)
    return progress_data

  @staticmethod
  async def list_all_records(user_id: str):
    """Get all quiz progress records for a user."""
    user_ref = db.collection("users").document(user_id)
    if not user_ref.get().exists:
      raise HTTPException(status_code=404, detail="User not found")

    progress_docs = user_ref.collection("quizProgress").stream()
    progress_list = []
    for doc in progress_docs:
        doc_data = doc.to_dict()
        # Ensure the id field is set to the document ID
        doc_data["id"] = doc.id
        # Handle existing records that might not have quiz_id
        if "quiz_id" not in doc_data:
            doc_data["quiz_id"] = doc.id  # Fallback for old records
        progress_list.append(doc_data)
    
    return progress_list