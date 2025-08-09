"""
Quiz management routes.
"""

from fastapi import APIRouter
from typing import List
from app.schemas.quiz import Quiz
from app.schemas.quiz_progress import QuizProgress
from app.services.quiz_service import QuizService

router = APIRouter()


@router.get("/", response_model=List[Quiz])
async def get_all_quizzes():
    """Get all quizzes across all classes."""
    return await QuizService.get_all_quizzes()


@router.get("/{user_id}/quizProgress/{quiz_id}", response_model=QuizProgress)
async def get_quiz_progress(user_id: str, quiz_id: str):
    """Get quiz progress for a specific user and quiz."""
    return await QuizService.get_quiz_progress(user_id, quiz_id)


@router.post(
    "/{user_id}/quizProgress/{quiz_id}", response_model=QuizProgress, status_code=201
)
async def upload_quiz_progress(user_id: str, quiz_id: str, progress: QuizProgress):
    """Upload quiz progress for a user."""
    return await QuizService.upload_quiz_progress(user_id, quiz_id, progress)


@router.get("/{user_id}/quizProgress", response_model=List[QuizProgress])
async def list_quiz_progress(user_id: str):
    """Get all quiz progress for a user."""
    return await QuizService.list_quiz_progress(user_id)
