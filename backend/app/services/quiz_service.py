"""
Quiz management service.
"""

from fastapi import HTTPException
from typing import List, Optional
from app.schemas.quiz import Quiz
from app.schemas.quiz_progress import QuizProgress, QuizProgressSubmission
from app.database import db
from datetime import datetime
import uuid


class QuizService:
    """Service for quiz management operations."""

    @staticmethod
    def _generate_quiz_progress_id() -> str:
        """Generate a unique quiz progress ID."""
        return str(uuid.uuid4())

    @staticmethod
    async def get_all_quizzes():
        """Get all quizzes across all classes."""
        quizzes = []
        classes = db.collection("classes").stream()
        for cls in classes:
            class_id = cls.id
            quizzes.extend(
                [
                    Quiz(**doc.to_dict())
                    for doc in db.collection("classes")
                    .document(class_id)
                    .collection("quizzes")
                    .stream()
                ]
            )
        return quizzes

    @staticmethod
    async def get_quiz_progress(user_id: str, quiz_progress_id: str):
        """Get quiz progress for a specific user and quiz progress ID."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        progress_ref = user_ref.collection("quizProgress").document(quiz_progress_id)
        progress_doc = progress_ref.get()
        if not progress_doc.exists:
            raise HTTPException(status_code=404, detail="Quiz progress not found")

        progress_data = progress_doc.to_dict()
        progress_data["id"] = quiz_progress_id
        return progress_data

    @staticmethod
    async def upload_quiz_progress(user_id: str, quiz_id: str, progress: QuizProgressSubmission):
        """Upload quiz progress for a user."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Generate a unique quiz progress ID
        quiz_progress_id = QuizService._generate_quiz_progress_id()

        # Reference the quiz progress document under the user's quizProgress subcollection.
        progress_ref = user_ref.collection("quizProgress").document(quiz_progress_id)

        # Set timestamps: if 'started_at' isn't provided, use the current UTC time.
        now = datetime.utcnow()
        progress_data = progress.dict()
        if not progress_data.get("started_at"):
            progress_data["started_at"] = now
        progress_data["updated_at"] = now
        # Save both the quiz_id and the unique id inside the document.
        progress_data["quiz_id"] = quiz_id
        progress_data["id"] = quiz_progress_id

        # Save the progress data to Firestore.
        progress_ref.set(progress_data)
        return progress_data

    @staticmethod
    async def list_quiz_progress(user_id: str):
        """Get all quiz progress for a user."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        progress_docs = user_ref.collection("quizProgress").stream()
        # Add the document id as the id field to the returned data.
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
