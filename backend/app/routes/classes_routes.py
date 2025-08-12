from fastapi import APIRouter, status, Request
from typing import List
from app.schemas.classes import ClassCreate, ClassOut
from app.schemas.quiz import Quiz
from app.services.class_service import ClassService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(body: ClassCreate, request: Request):
    """Create a new class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.create_class(body)


@router.get("/", response_model=List[ClassOut])
async def list_classes(request: Request):
    """Get all classes. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.list_classes()


@router.get("/{class_id}", response_model=ClassOut)
async def get_class(class_id: str, request: Request):
    """Get a specific class by ID. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.get_class(class_id)


@router.put("/{class_id}", response_model=ClassOut)
async def update_class(class_id: str, body: ClassCreate, request: Request):
    """Update a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.update_class(class_id, body)


@router.delete("/{class_id}", status_code=204)
async def delete_class(class_id: str, request: Request):
    """Delete a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.delete_class(class_id)


@router.get("/{class_id}/quizzes/", response_model=List[Quiz])
async def list_quizzes(class_id: str, request: Request):
    """Get all quizzes for a class. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.list_quizzes(class_id)


@router.post("/{class_id}/quizzes/", response_model=Quiz, status_code=201)
async def add_quiz_to_class(class_id: str, quiz: Quiz, request: Request):
    """Add a quiz to a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.add_quiz_to_class(class_id, quiz)


@router.put("/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def update_quiz(class_id: str, quiz_id: str, quiz: Quiz, request: Request):
    """Update a quiz in a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.update_quiz(class_id, quiz_id, quiz)


@router.delete("/{class_id}/quizzes/{quiz_id}", status_code=204)
async def delete_quiz(class_id: str, quiz_id: str, request: Request):
    """Delete a quiz from a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.delete_quiz(class_id, quiz_id)


@router.get("/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(class_id: str, quiz_id: str, request: Request):
    """Get a specific quiz from a class. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.get_quiz(class_id, quiz_id)
