from fastapi import APIRouter, HTTPException
from schemas.quiz import Quiz
from database import quizzes_collection
from bson import ObjectID

router = APIRouter()

@router.post("/create")
async def create_quiz(quiz: Quiz):
    quiz_data = quiz.dict()
    await quizzes_collection.insert_one(quiz_data)
    return {"message": "Quiz created successfully"}

@router.put("/update/{quiz_id}")
async def update_quiz(quiz_id: str, updated_quiz: Quiz):
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=400, detail="Invalid quiz ID")
    
    update_result = await quizzes_collection.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": updated_quiz.dict()}
    )
    
    if update_result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Quiz not found or no changes made")
    
    return {"message": "Quiz updated successfully"}

@router.get("/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = await quizzes_collection.find_one({"_id": quiz_id})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@router.delete("/delete/{quiz_id}")
async def delete_quiz(quiz_id: str):
    if not ObjectId.is_valid(quiz_id):
        raise HTTPException(status_code=400, detail="Invalid quiz ID")
    
    delete_result = await quizzes_collection.delete_one({"_id": ObjectId(quiz_id)})
    
    if delete_result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    return {"message": "Quiz deleted successfully"}
