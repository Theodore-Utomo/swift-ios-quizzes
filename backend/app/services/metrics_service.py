"""
Statistics service.
"""

import logging
from typing import Any

from fastapi import HTTPException, status
from app.database import db
from app.schemas.metrics import MetricsOut

class MetricsService:
  """Service for metrics management operations."""

  # Helper Functions Here
  @staticmethod
  async def get_total_students():
    """Get total number of students."""
    students_query_count = db.collection("users").where("role", "==", "student").count().get()
    return students_query_count[0][0].value

  @staticmethod
  async def get_total_courses():
    """Get total number of courses."""
    courses_query_count = db.collection("courses").count().get()
    return courses_query_count[0][0].value

  @staticmethod
  async def get_total_quizzes():
    """Get total number of quizzes."""
    courses_ref = db.collection("courses").get()
    num_quizzes = 0
    for course_doc in courses_ref:
      quizzes_stream = db.collection("courses").document(course_doc.id).collection("quizzes").stream()
      quizzes_list: list[Any] = list(quizzes_stream) 
      num_quizzes += len(quizzes_list)
    return num_quizzes

  # Main Functions Here
  @staticmethod
  async def get_metrics():
    """Get student statistics."""
    try:
      num_students = await MetricsService.get_total_students()
      num_courses = await MetricsService.get_total_courses()
      num_quizzes = await MetricsService.get_total_quizzes()

      return MetricsOut(
        total_students=num_students,
        number_of_courses=num_courses,
        number_of_quizzes=num_quizzes
      )
    except HTTPException:
      raise
    except Exception as e:
      logging.exception("Failed to fetch metrics: %s", e)
      raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to load metrics"
      )