"""
Quiz management routes.
"""

from fastapi import APIRouter, Request, HTTPException
from typing import List
from app.schemas.quiz import Quiz
from app.schemas.quiz_progress import QuizProgress
from app.services.quiz_service import QuizService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.get("/{user_id}/quizProgress/{quiz_id}", response_model=QuizProgress)
async def get_quiz_progress(user_id: str, quiz_id: str, request: Request):
    """Get quiz progress for a specific user and quiz. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    # Users can only access their own progress unless they're instructors
    if user["user_id"] != user_id and user["role"] != "instructor":
        raise HTTPException(status_code=403, detail="Access denied")
    return await QuizService.get_quiz_progress(user_id, quiz_id)


@router.post(
    "/{user_id}/quizProgress/{quiz_id}", response_model=QuizProgress, status_code=201
)
async def upload_quiz_progress(user_id: str, quiz_id: str, progress: QuizProgress, request: Request):
    """Upload quiz progress for a user. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    # Users can only submit their own progress
    if user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await QuizService.upload_quiz_progress(user_id, quiz_id, progress)


@router.get("/{user_id}/quizProgress", response_model=List[QuizProgress])
async def list_quiz_progress(user_id: str, request: Request):
    """Get all quiz progress for a user. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    # Users can only access their own progress unless they're instructors
    if user["user_id"] != user_id and user["role"] != "instructor":
        raise HTTPException(status_code=403, detail="Access denied")
    return await QuizService.list_quiz_progress(user_id)
