from fastapi import APIRouter, status, Request
from typing import List
from app.schemas.classes import ClassCreate, ClassOut
from app.services.class_service import ClassService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.post("/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(body: ClassCreate, request: Request):
    """Create a new class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.create_record(body)


@router.get("/", response_model=List[ClassOut])
async def list_classes(request: Request):
    """Get all classes. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.list_classes()


@router.get("/{class_id}", response_model=ClassOut)
async def get_class(class_id: str, request: Request):
    """Get a specific class by ID. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await ClassService.find_first_record(class_id)


@router.put("/{class_id}", response_model=ClassOut)
async def update_class(class_id: str, body: ClassCreate, request: Request):
    """Update a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await ClassService.update_record(class_id, body)


@router.delete("/{class_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_class(class_id: str, request: Request):
    """Delete a class. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    await ClassService.delete_record(class_id)
    return
