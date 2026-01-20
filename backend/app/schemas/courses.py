from pydantic import BaseModel, Field, validator
import re


class CourseCreate(BaseModel):
    name: str = Field(
        ..., 
        title="Course Name", 
        description="The display name of this course",
        min_length=1,
        max_length=100
    )
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Course name cannot be empty')
        
        # Remove excessive whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        
        # Check for valid characters (letters, numbers, spaces, basic punctuation, and apostrophe)
        if not re.match(r'^[a-zA-Z0-9\s\-_().,:&;#\'"]+$', v):
            raise ValueError('Course name contains invalid characters')
        
        return v


class CourseOut(BaseModel):
    id: str = Field(
        ..., alias="id", description="Firestore document ID for the course"
    )
    name: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {"example": {"course_id": "Biology101", "name": "Biology 101"}}
