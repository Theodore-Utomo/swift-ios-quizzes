from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from app.schemas.quiz import Quiz
from app.schemas.users import User, Token, UserLogin
from app.schemas.classes import ClassCreate, ClassOut
from app.schemas.quiz_progress import QuizProgress 
from app.auth import create_access_token, get_password_hash, verify_password
from app.database import db
from dotenv import load_dotenv
from firebase_admin import auth
from datetime import datetime
from typing import List
import os

# Load environment variables from .env
load_dotenv()

# Access the secret key and service account path
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*", "https://my-quiz-app-frontend.onrender.com"],  # Replace later during production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error: " + str(exc)},
    )

# ---------------------
# User Endpoints
# ---------------------

@app.post("/register/")
async def register_user(user: User):
    user_ref = db.collection("users").document(user.username)
    if user_ref.get().exists:
        raise HTTPException(status_code=400, detail="Username already registered")
    hashed_password = get_password_hash(user.password)
    user_ref.set({
        "username": user.username,
        "password": hashed_password,
        "role": user.role
    })
    return {"message": "User registered successfully"}

@app.post("/login/", response_model=Token)
async def login(user: UserLogin):
    user_ref = db.collection("users").document(user.username).get()
    if not user_ref.exists:
        raise HTTPException(status_code=400, detail="User doesn't exist or password")
    user_data = user_ref.to_dict()
    if not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    access_token = create_access_token(data={"sub": user.username, "role": user_data["role"]})
    return {"access_token": access_token, "token_type": "bearer"}

def get_user_uid(token: str) -> str:
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

@app.post("/sign-out/")
async def sign_out(token: str):
    try:
        user_uid = get_user_uid(token)
        auth.revoke_refresh_tokens(user_uid)
        return {"message": "Successfully signed out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error signing out: {str(e)}")

# ---------------------
# Class Endpoints
# ---------------------

@app.post("/classes/", response_model=ClassOut, status_code=status.HTTP_201_CREATED)
async def create_class(body: ClassCreate):
    class_ref = db.collection("classes").document()
    class_ref.set(body.dict())
    return ClassOut(class_id=class_ref.id, **body.dict())

@app.get("/classes/", response_model=list[ClassOut])
async def list_classes():
    return [
        ClassOut(class_id=doc.id, **doc.to_dict())
        for doc in db.collection("classes").stream()
    ]

@app.get("/classes/{class_id}", response_model=ClassOut)
async def get_class(class_id: str):
    doc = db.collection("classes").document(class_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Class not found")
    return ClassOut(class_id=doc.id, **doc.to_dict())

# Update a class (e.g. update the name)
@app.put("/classes/{class_id}", response_model=ClassOut)
async def update_class(class_id: str, body: ClassCreate):
    class_ref = db.collection("classes").document(class_id)
    if not class_ref.get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    class_ref.update(body.dict())
    updated_doc = class_ref.get()
    return ClassOut(class_id=updated_doc.id, **updated_doc.to_dict())

# Delete a class
@app.delete("/classes/{class_id}", status_code=204)
async def delete_class(class_id: str):
    class_ref = db.collection("classes").document(class_id)
    if not class_ref.get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    class_ref.delete()
    return

# ---------------------
# Quiz Endpoints (Nested under Classes)
# ---------------------

def quizzes_ref(class_id: str):
    return db.collection("classes").document(class_id).collection("quizzes")

@app.get("/classes/{class_id}/quizzes/", response_model=list[Quiz])
async def list_quizzes(class_id: str):
    if not db.collection("classes").document(class_id).get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    return [Quiz(**doc.to_dict()) for doc in quizzes_ref(class_id).stream()]

@app.post("/classes/{class_id}/quizzes/", response_model=Quiz, status_code=201)
async def add_quiz_to_class(class_id: str, quiz: Quiz):
    if not db.collection("classes").document(class_id).get().exists:
        raise HTTPException(status_code=404, detail="Class not found")
    quiz_doc = quizzes_ref(class_id).document()
    quiz_data = quiz.dict(exclude_unset=True)
    quiz_data["id"] = quiz_doc.id
    quiz_doc.set(quiz_data)
    return Quiz(**quiz_data)

@app.put("/classes/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def update_quiz(class_id: str, quiz_id: str, quiz: Quiz):
    quiz_doc = quizzes_ref(class_id).document(quiz_id)
    if not quiz_doc.get().exists:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Update the quiz document.
    quiz_doc.set(quiz.dict())
    
    # Update the quiz progress entries with the new quiz name, if they exist.
    users = db.collection("users").stream()
    for user in users:
         progress_ref = user.reference.collection("quizProgress").document(quiz_id)
         if progress_ref.get().exists:
              progress_ref.update({"quiz_name": quiz.name})
    
    return quiz

@app.delete("/classes/{class_id}/quizzes/{quiz_id}", status_code=204)
async def delete_quiz(class_id: str, quiz_id: str):
    quiz_doc = quizzes_ref(class_id).document(quiz_id)
    if not quiz_doc.get().exists:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Delete the quiz document.
    quiz_doc.delete()
    
    # Delete all quiz progress for this quiz from every user.
    users = db.collection("users").stream()
    for user in users:
         progress_ref = user.reference.collection("quizProgress").document(quiz_id)
         if progress_ref.get().exists:
              progress_ref.delete()
    
    return

@app.get("/classes/{class_id}/quizzes/{quiz_id}", response_model=Quiz)
async def get_quiz(class_id: str, quiz_id: str):
    quiz_doc = db.collection("classes").document(class_id).collection("quizzes").document(quiz_id)
    if not quiz_doc.get().exists:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return Quiz(**quiz_doc.get().to_dict())

# ---------------------
# Global Quizzes Endpoint: Get All Quizzes from All Classes
# ---------------------

@app.get("/quizzes", response_model=list[Quiz])
async def get_all_quizzes():
    quizzes = []
    classes = db.collection("classes").stream()
    for cls in classes:
        class_id = cls.id
        quizzes.extend([Quiz(**doc.to_dict()) for doc in db.collection("classes").document(class_id).collection("quizzes").stream()])
    return quizzes

# ---------------------
# Quiz Progress Endpoints: CRUD Operations for Users Saving Progress on Quizzes
# ---------------------

@app.get("/users/{username}/quizProgress/{quiz_id}", response_model=QuizProgress)
async def get_quiz_progress(username: str, quiz_id: str):
    user_ref = db.collection("users").document(username)
    if not user_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    progress_ref = user_ref.collection("quizProgress").document(quiz_id)
    progress_doc = progress_ref.get()
    if not progress_doc.exists:
        raise HTTPException(status_code=404, detail="Quiz progress not found")
    
    return progress_doc.to_dict()

@app.post("/users/{username}/quizProgress/{quiz_id}", response_model=QuizProgress, status_code=201)
async def upload_quiz_progress(username: str, quiz_id: str, progress: QuizProgress):
    # Get the user document by username.
    user_ref = db.collection("users").document(username)
    if not user_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Reference the quiz progress document under the user's quizProgress subcollection.
    progress_ref = user_ref.collection("quizProgress").document(quiz_id)
    
    # Set timestamps: if 'started_at' isn’t provided, use the current UTC time.
    now = datetime.utcnow()
    progress_data = progress.dict()
    if not progress_data.get("started_at"):
        progress_data["started_at"] = now
    progress_data["updated_at"] = now
    # Also, save the quiz_id inside the document.
    progress_data["quiz_id"] = quiz_id
    
    # Save the progress data to Firestore using merge so that you update existing entries.
    progress_ref.set(progress_data, merge=True)
    return progress_data

@app.get("/users/{username}/quizProgress", response_model=List[QuizProgress])
async def list_quiz_progress(username: str):
    user_ref = db.collection("users").document(username)
    if not user_ref.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    
    progress_docs = user_ref.collection("quizProgress").stream()
    # Add the document id (quiz_id) to the returned data.
    return [QuizProgress(**{**doc.to_dict(), "quiz_id": doc.id}) for doc in progress_docs]
