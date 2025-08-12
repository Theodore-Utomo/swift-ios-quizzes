"""
Quiz progress status enumeration.
"""
from enum import Enum


class QuizProgressStatus(str, Enum):
    """Quiz progress status enumeration."""
    NOT_STARTED = "not_started"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    ABANDONED = "abandoned"
