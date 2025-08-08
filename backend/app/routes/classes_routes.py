from fastapi import APIRouter, status
from typing import List
from app.schemas.classes import ClassCreate, ClassOut
from app.schemas.quiz import Quiz
from app.services.class_service import ClassService

router = APIRouter()


@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(body: ClassCreate):
    """Create a new class."""
    return await ClassService.create_class(body)


@router.get("/", response_model=List[ClassOut])
async def list_classes():
    """Get all classes."""
    return await ClassService.list_classes()


@router.get("/{class_id}", response_model=ClassOut)
async def get_class(class_id: str):
    """Get a specific class by ID."""
    return await ClassService.get_class(class_id)


@router.put("/{class_id}", response_model=ClassOut)
async def update_class(class_id: str, body: ClassCreate):
    """Update a class."""
    return await ClassService.update_class(class_id, body)


@router.delete("/{class_id}", status_code=204)
async def delete_class(class_id: str):
    """Delete a class."""
    return await ClassService.delete_class(class_id)


@router.get("/{class_id}/quizzes/", response_model=List[Quiz])
async def list_quizzes(class_id: str):
    """Get all quizzes for a class."""
    return await ClassService.list_quizzes(class_id)


@router.post("/{class_id}/quizzes/", response_model=Quiz, status_code=201)
async def add_quiz_to_class(class_id: str, quiz: Quiz):
    """Add a quiz to a class."""
    return await ClassService.add_quiz_to_class(class_id, quiz)


@router.put("/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def update_quiz(class_id: str, quiz_id: str, quiz: Quiz):
    """Update a quiz in a class."""
    return await ClassService.update_quiz(class_id, quiz_id, quiz)


@router.delete("/{class_id}/quizzes/{quiz_id}", status_code=204)
async def delete_quiz(class_id: str, quiz_id: str):
    """Delete a quiz from a class."""
    return await ClassService.delete_quiz(class_id, quiz_id)


@router.get("/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(class_id: str, quiz_id: str):
    """Get a specific quiz from a class."""
    return await ClassService.get_quiz(class_id, quiz_id)
