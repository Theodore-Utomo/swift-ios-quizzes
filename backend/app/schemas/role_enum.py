"""
Enum definitions for the application.
"""
from enum import Enum


class UserRole(str, Enum):
    """User role enumeration."""
    STUDENT = "student"
    INSTRUCTOR = "instructor" 