"""
Course management service.
"""

from fastapi import HTTPException, status
from typing import List
from app.schemas.courses import CourseCreate, CourseOut
from app.database import db


class CourseService:
    """Service for course management operations."""

    @staticmethod
    async def create_record(body: CourseCreate) -> CourseOut:
        """Create a new course."""
        course_ref = db.collection("courses").document()
        course_ref.set(body.dict())
        return CourseOut(id=course_ref.id, **body.dict())

    @staticmethod
    async def list_courses() -> List[CourseOut]:
        """Get all courses."""
        return [
            CourseOut(id=doc.id, **doc.to_dict())
            for doc in db.collection("courses").stream()
        ]

    @staticmethod
    async def find_first_record(course_id: str) -> CourseOut:
        """Get a specific course by ID."""
        doc = db.collection("courses").document(course_id).get()
        if not doc.exists:
            raise HTTPException(status_code=404, detail="Course not found")
        return CourseOut(id=doc.id, **doc.to_dict())

    @staticmethod
    async def update_record(course_id: str, body: CourseCreate) -> CourseOut:
        """Update a course."""
        course_ref = db.collection("courses").document(course_id)
        if not course_ref.get().exists:
            raise HTTPException(status_code=404, detail="Course not found")
        course_ref.update(body.dict())
        updated_doc = course_ref.get()
        return CourseOut(id=updated_doc.id, **updated_doc.to_dict())

    @staticmethod
    async def delete_record(course_id: str):
        """Delete a course and all its quizzes."""
        course_ref = db.collection("courses").document(course_id)
        if not course_ref.get().exists:
            raise HTTPException(status_code=404, detail="Course not found")
        
        # Delete all quizzes in the course first
        quizzes_ref = course_ref.collection("quizzes")
        for quiz_doc in quizzes_ref.stream():
            quiz_doc.reference.delete()
        
        # Then delete the course
        course_ref.delete()
        return
