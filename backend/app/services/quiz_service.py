"""
Quiz management service.
"""

from fastapi import HTTPException
from typing import List, Optional
from app.schemas.quiz import Quiz
from app.schemas.quiz_progress import QuizProgress
from app.database import db
from datetime import datetime


class QuizService:
    """Service for quiz management operations."""

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
    async def get_quiz_progress(user_id: str, quiz_id: str):
        """Get quiz progress for a specific user and quiz."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        progress_ref = user_ref.collection("quizProgress").document(quiz_id)
        progress_doc = progress_ref.get()
        if not progress_doc.exists:
            raise HTTPException(status_code=404, detail="Quiz progress not found")

        return progress_doc.to_dict()

    @staticmethod
    async def upload_quiz_progress(user_id: str, quiz_id: str, progress: QuizProgress):
        """Upload quiz progress for a user."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        # Reference the quiz progress document under the user's quizProgress subcollection.
        progress_ref = user_ref.collection("quizProgress").document(quiz_id)

        # Set timestamps: if 'started_at' isn't provided, use the current UTC time.
        now = datetime.utcnow()
        progress_data = progress.dict()
        if not progress_data.get("started_at"):
            progress_data["started_at"] = now
        progress_data["updated_at"] = now
        # Also, save the quiz_id inside the document.
        progress_data["quiz_id"] = quiz_id

        # Save the progress data to Firestore using merge so that you update existing entries.
        progress_ref.set(progress_data, merge=True)
        return progress_data

    @staticmethod
    async def list_quiz_progress(user_id: str):
        """Get all quiz progress for a user."""
        # Verify user exists
        user_ref = db.collection("users").document(user_id)
        if not user_ref.get().exists:
            raise HTTPException(status_code=404, detail="User not found")

        progress_docs = user_ref.collection("quizProgress").stream()
        # Add the document id (quiz_id) to the returned data.
        return [
            QuizProgress(**{**doc.to_dict(), "quiz_id": doc.id})
            for doc in progress_docs
        ]
