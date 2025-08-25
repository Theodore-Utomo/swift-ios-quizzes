"""
Class management service.
"""

from fastapi import HTTPException, status
from typing import List
from app.schemas.classes import ClassCreate, ClassOut
from app.schemas.quiz import Quiz
from app.database import db


class ClassService:
    """Service for class management operations."""

    @staticmethod
    async def create_record(body: ClassCreate) -> ClassOut:
        """Create a new class."""
        class_ref = db.collection("classes").document()
        class_ref.set(body.dict())
        return ClassOut(class_id=class_ref.id, **body.dict())

    @staticmethod
    async def list_classes() -> List[ClassOut]:
        """Get all classes."""
        return [
            ClassOut(class_id=doc.id, **doc.to_dict())
            for doc in db.collection("classes").stream()
        ]

    @staticmethod
    async def find_first_record(class_id: str) -> ClassOut:
        """Get a specific class by ID."""
        doc = db.collection("classes").document(class_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Class not found")
        return ClassOut(class_id=doc.id, **doc.to_dict())

    @staticmethod
    async def update_record(class_id: str, body: ClassCreate) -> ClassOut:
        """Update a class."""
        class_ref = db.collection("classes").document(class_id)
        if not class_ref.get().exists:
            raise HTTPException(status_code=404, detail="Class not found")
        class_ref.update(body.dict())
        updated_doc = class_ref.get()
        return ClassOut(class_id=updated_doc.id, **updated_doc.to_dict())

    @staticmethod
    async def delete_record(class_id: str):
        """Delete a class."""
        class_ref = db.collection("classes").document(class_id)
        if not class_ref.get().exists:
            raise HTTPException(status_code=404, detail="Class not found")
        class_ref.delete()
        return

    @staticmethod
    def _get_quizzes_ref(class_id: str):
        """Get quizzes collection reference for a class."""
        return db.collection("classes").document(class_id).collection("quizzes")

    @staticmethod
    async def list_quizzes(class_id: str) -> List[Quiz]:
        """Get all quizzes for a class."""
        if not db.collection("classes").document(class_id).get().exists:
            raise HTTPException(status_code=404, detail="Class not found")
        return [
            Quiz(**doc.to_dict())
            for doc in ClassService._get_quizzes_ref(class_id).stream()
        ]

    @staticmethod
    async def add_quiz_to_class(class_id: str, quiz: Quiz) -> Quiz:
        """Add a quiz to a class."""
        if not db.collection("classes").document(class_id).get().exists:
            raise HTTPException(status_code=404, detail="Class not found")
        quiz_doc = ClassService._get_quizzes_ref(class_id).document()
        quiz_data = quiz.dict(exclude_unset=True)
        quiz_data["id"] = quiz_doc.id
        quiz_doc.set(quiz_data)
        return Quiz(**quiz_data)

    @staticmethod
    async def update_quiz(class_id: str, quiz_id: str, quiz: Quiz) -> Quiz:
        """Update a quiz in a class."""
        quiz_doc = ClassService._get_quizzes_ref(class_id).document(quiz_id)
        if not quiz_doc.get().exists:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Update the quiz document.
        quiz_doc.set(quiz.dict())

        return quiz

    @staticmethod
    async def delete_quiz(class_id: str, quiz_id: str):
        """Delete a quiz from a class."""
        quiz_doc = ClassService._get_quizzes_ref(class_id).document(quiz_id)
        if not quiz_doc.get().exists:
            raise HTTPException(status_code=404, detail="Quiz not found")

        # Delete the quiz document.
        quiz_doc.delete()

        return

    @staticmethod
    async def get_quiz(class_id: str, quiz_id: str) -> Quiz:
        """Get a specific quiz from a class."""
        quiz_doc = (
            db.collection("classes")
            .document(class_id)
            .collection("quizzes")
            .document(quiz_id)
        )
        if not quiz_doc.get().exists:
            raise HTTPException(status_code=404, detail="Quiz not found")
        return Quiz(**quiz_doc.get().to_dict())
