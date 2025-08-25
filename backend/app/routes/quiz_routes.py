"""
Quiz management routes.
"""

from fastapi import APIRouter, status, Request
from typing import List
from app.schemas.quiz import Quiz
from app.services.quiz_service import QuizService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.post("/classes/{class_id}/quizzes", response_model=Quiz, status_code=status.HTTP_201_CREATED)
async def create_quiz(class_id: str, quiz: Quiz, request: Request):
    """Create a new quiz in a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await QuizService.create_quiz(class_id, quiz)


@router.get("/classes/{class_id}/quizzes", response_model=List[Quiz])
async def list_quizzes_by_class(class_id: str, request: Request):
    """Get all quizzes for a specific class. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await QuizService.list_quizzes_by_class(class_id)


@router.get("/classes/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(class_id: str, quiz_id: str, request: Request):
    """Get a specific quiz from a class. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await QuizService.find_first_record(class_id, quiz_id)


@router.put("/classes/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def update_quiz(class_id: str, quiz_id: str, quiz: Quiz, request: Request):
    """Update a quiz in a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await QuizService.update_record(class_id, quiz_id, quiz)


@router.delete("/classes/{class_id}/quizzes/{quiz_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_quiz(class_id: str, quiz_id: str, request: Request):
    """Delete a quiz from a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    await QuizService.delete_record(class_id, quiz_id)
    return

