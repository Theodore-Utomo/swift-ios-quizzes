from fastapi import APIRouter, status, Request
from typing import List
from app.schemas.courses import CourseCreate, CourseOut
from app.services.course_service import CourseService
from app.middleware.auth_middleware import auth_middleware

router = APIRouter()


@router.post("/", response_model=CourseOut, status_code=status.HTTP_201_CREATED)
async def create_course(body: CourseCreate, request: Request):
    """Create a new course. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await CourseService.create_record(body)


@router.get("/", response_model=List[CourseOut])
async def list_courses(request: Request):
    """Get all courses. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await CourseService.list_courses()


@router.get("/{course_id}", response_model=CourseOut)
async def get_course(course_id: str, request: Request):
    """Get a specific course by ID. Requires authentication."""
    user = await auth_middleware.require_auth(request)
    return await CourseService.find_first_record(course_id)


@router.put("/{course_id}", response_model=CourseOut)
async def update_course(course_id: str, body: CourseCreate, request: Request):
    """Update a course. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    return await CourseService.update_record(course_id, body)


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(course_id: str, request: Request):
    """Delete a course. Requires instructor role."""
    user = await auth_middleware.require_instructor(request)
    await CourseService.delete_record(course_id)
    return
