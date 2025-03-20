from pydantic import BaseModel, Field

class ClassCreate(BaseModel):
    name: str = Field(..., title="Class Name", description="The display name of this class")

class ClassOut(BaseModel):
    class_id: str = Field(..., alias="class_id", description="Firestore document ID for the class")
    name: str

    class Config:
        allow_population_by_field_name = True
        schema_extra = {
            "example": {
                "class_id": "Biology101",
                "name": "Biology 101"
            }
        }
