"""
Statistics schema.
"""
from pydantic import BaseModel

class StatisticsOut(BaseModel):
  total_students: int
  number_of_courses: int
  number_of_quizzes: int
  