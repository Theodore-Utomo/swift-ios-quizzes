"""
Quiz management routes.
"""

from fastapi import APIRouter, Request, HTTPException
from typing import List
from app.schemas.quiz_progress import QuizProgress, QuizProgressSubmission
from app.services.quiz_progress_service import QuizProgressService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.get("/{user_id}/quizProgress/{quiz_progress_id}", response_model=QuizProgress)
async def get_quiz_progress(user_id: str, quiz_progress_id: str, request: Request):
    """Get quiz progress by its unique ID. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    # Users can only access their own progress unless they're instructors
    if user["user_id"] != user_id and user["role"] != "instructor":
        raise HTTPException(status_code=403, detail="Access denied")
    return await QuizProgressService.find_first_record(user_id, quiz_progress_id)

@router.post(
    "/{user_id}/quizProgress/{quiz_id}", response_model=QuizProgress, status_code=201
)
async def upload_quiz_progress(user_id: str, quiz_id: str, progress: QuizProgressSubmission, request: Request):
    """Upload quiz progress for a user. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    if user["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    return await QuizProgressService.create_record(user_id, quiz_id, progress)


@router.get("/{user_id}", response_model=List[QuizProgress])
async def list_quiz_progress(user_id: str, request: Request):
    """Get all quiz progress for a user. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await QuizProgressService.list_all_records(user_id)
