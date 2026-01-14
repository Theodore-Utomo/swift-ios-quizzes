from fastapi import APIRouter, Depends, HTTPException, Request
from typing import List
from app.schemas.feedback import FeedbackSubmission
from app.middleware.auth_middleware import auth_middleware
from app.services.feedback_service import FeedbackService


router = APIRouter()

@router.post("/", response_model=FeedbackSubmission, status_code=201)
async def submit_feedback(feedback: FeedbackSubmission, request: Request):
  user = await auth_middleware.require_auth(request)
  return await FeedbackService.create_record(feedback)
