"""
Statistics service.
"""

from fastapi import HTTPException, status
from app.database import db
from app.schemas.statistics import StatisticsOut

class StatisticsService:
  """Service for statistics management operations."""

  @staticmethod
  async def get_statistics():
    """Get student statistics."""
    count_query = db.collection("users").where("role", "==", "student").count().get()
    num_students = count_query[0][0].value
    
    courses_ref = db.collection("courses").get()
    num_courses = len(courses_ref)
    num_quizzes = 0

    for course_doc in courses_ref:
      quizzes = db.collection("courses").document(course_doc.id).collection("quizzes").get()
      num_quizzes += len(quizzes)
    
    return StatisticsOut(
      total_students=num_students,
      number_of_courses=num_courses,
      number_of_quizzes=num_quizzes
    )