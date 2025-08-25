"""
Class management service.
"""

from fastapi import HTTPException, status
from typing import List
from app.schemas.classes import ClassCreate, ClassOut
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
        """Delete a class and all its quizzes."""
        class_ref = db.collection("classes").document(class_id)
        if not class_ref.get().exists:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Delete all quizzes in the class first
        quizzes_ref = class_ref.collection("quizzes")
        for quiz_doc in quizzes_ref.stream():
            quiz_doc.reference.delete()
        
        # Then delete the class
        class_ref.delete()
        return
