"""
Quiz management service.
"""

from fastapi import HTTPException
from typing import List
from app.schemas.quiz import Quiz
from app.database import db


class QuizService:
    """Service for quiz management operations."""

    @staticmethod
    def _get_quizzes_ref(class_id: str):
        """Get quizzes collection reference for a class."""
        return db.collection("classes").document(class_id).collection("quizzes")

    @staticmethod
    async def _verify_class_exists(class_id: str):
        """Verify that a class exists."""
        if not db.collection("classes").document(class_id).get().exists:
            raise HTTPException(status_code=404, detail="Class not found")

    @staticmethod
    async def create_record(class_id: str, quiz: Quiz) -> Quiz:
        """Create a new quiz in a class."""
        await QuizService._verify_class_exists(class_id)
        
        quiz_doc = QuizService._get_quizzes_ref(class_id).document()
        quiz_data = quiz.dict(exclude_unset=True)
        quiz_data["id"] = quiz_doc.id
        quiz_data["class_id"] = class_id  # Store class reference
        
        quiz_doc.set(quiz_data)
        return Quiz(**quiz_data)

    @staticmethod
    async def find_first_record(class_id: str, quiz_id: str) -> Quiz:
        """Get a specific quiz from a class."""
        await QuizService._verify_class_exists(class_id)
        
        quiz_doc = QuizService._get_quizzes_ref(class_id).document(quiz_id)
        quiz_snapshot = quiz_doc.get()
        
        if not quiz_snapshot.exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
            
        return Quiz(**quiz_snapshot.to_dict())

    @staticmethod
    async def list_quizzes_by_class(class_id: str) -> List[Quiz]:
        """Get all quizzes for a specific class."""
        await QuizService._verify_class_exists(class_id)
        
        return [
            Quiz(**doc.to_dict())
            for doc in QuizService._get_quizzes_ref(class_id).stream()
        ]

    @staticmethod
    async def list_all_quizzes() -> List[Quiz]:
        """Get all quizzes across all classes."""
        quizzes = []
        classes = db.collection("classes").stream()
        
        for cls in classes:
            class_id = cls.id
            class_quizzes = [
                Quiz(**doc.to_dict())
                for doc in QuizService._get_quizzes_ref(class_id).stream()
            ]
            quizzes.extend(class_quizzes)
            
        return quizzes

    @staticmethod
    async def update_record(class_id: str, quiz_id: str, quiz: Quiz) -> Quiz:
        """Update a quiz in a class."""
        await QuizService._verify_class_exists(class_id)
        
        quiz_doc = QuizService._get_quizzes_ref(class_id).document(quiz_id)
        if not quiz_doc.get().exists:
            raise HTTPException(status_code=404, detail="Quiz not found")

        quiz_data = quiz.dict()
        quiz_data["id"] = quiz_id
        quiz_data["class_id"] = class_id
        
        quiz_doc.set(quiz_data)
        return Quiz(**quiz_data)

    @staticmethod
    async def delete_record(class_id: str, quiz_id: str):
        """Delete a quiz from a class."""
        await QuizService._verify_class_exists(class_id)
        
        quiz_doc = QuizService._get_quizzes_ref(class_id).document(quiz_id)
        if not quiz_doc.get().exists:
            raise HTTPException(status_code=404, detail="Quiz not found")

        quiz_doc.delete()
        return

