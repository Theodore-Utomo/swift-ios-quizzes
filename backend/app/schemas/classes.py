from pydantic import BaseModel, Field, validator
import re


class ClassCreate(BaseModel):
    name: str = Field(
        ..., 
        title="Class Name", 
        description="The display name of this class",
        min_length=1,
        max_length=100
    )
    
    @validator('name')
    def validate_name(cls, v):
        if not v or not v.strip():
            raise ValueError('Class name cannot be empty')
        
        # Remove excessive whitespace
        v = re.sub(r'\s+', ' ', v.strip())
        
        # Check for valid characters (letters, numbers, spaces, basic punctuation)
        if not re.match(r'^[a-zA-Z0-9\s\-_().,]+$', v):
            raise ValueError('Class name contains invalid characters')
        
        return v


class ClassOut(BaseModel):
    class_id: str = Field(
        ..., alias="class_id", description="Firestore document ID for the class"
    )
    name: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {"example": {"class_id": "Biology101", "name": "Biology 101"}}
