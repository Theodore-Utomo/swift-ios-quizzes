from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas.quiz import Quiz
from google.cloud import firestore
from backend.app.schemas.users import User, Token, UserLogin
from backend.app.auth import create_access_token, get_password_hash, verify_password
from backend.app.database import db
from dotenv import load_dotenv
from firebase_admin import auth
import os


# Load environment variables from .env
load_dotenv()

# Access the secret key and service account path
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI() ## Instantiates an app object that lets you make API Calls


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/register/")
async def register_user(user: User):
    user_ref = db.collection("users").document(user.username)

    # Check if the username already exists
    if user_ref.get().exists:
        raise HTTPException(status_code=400, detail="Username already registered")

    # Store user with hashed password and role
    hashed_password = get_password_hash(user.password)
    user_ref.set({
        "username": user.username,
        "password": hashed_password,
        "role": user.role
    })
    return {"message": "User registered successfully"}

@app.post("/login/", response_model=Token)
async def login(user: UserLogin):
    # Fetch user data from Firestore
    user_ref = db.collection("users").document(user.username).get()
    if not user_ref.exists:
        raise HTTPException(status_code=400, detail="User doesn't exist or password")

    user_data = user_ref.to_dict()
    # Verify password
    if not verify_password(user.password, user_data["password"]):
        raise HTTPException(status_code=400, detail="Invalid username or password")
    # Create a token with the user's role
    access_token = create_access_token(data={"sub": user.username, "role": user_data["role"]})
    return {"access_token": access_token, "token_type": "bearer"}


def get_user_uid(token: str) -> str:
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token['uid']
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# Sign-out route
@app.post("/sign-out/")
async def sign_out(token: str):
    try:
        # Verify the token and get the user UID
        user_uid = get_user_uid(token)

        # Revoke refresh tokens for the user
        auth.revoke_refresh_tokens(user_uid)

        return {"message": "Successfully signed out"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error signing out: {str(e)}")

def get_quizzes() -> list[Quiz]:
    """
    Retrieve all quizzes from the Firestore database.
    
    Returns:
        A list of Quiz objects.
    """
    try:
        # Stream all documents from the "quizzes" collection.
        quiz_docs = db.collection("quizzes").stream()
        quizzes = []
        # Convert each document to a Quiz model.
        for doc in quiz_docs:
            quiz_data = doc.to_dict()
            # Optionally, ensure that the document's data matches the Quiz schema.
            quizzes.append(Quiz(**quiz_data))
        return quizzes
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving quizzes: {str(e)}")

@app.get("/quizzes")
async def quiz() -> list[Quiz]:
    return get_quizzes()


@app.get("/quizzes/{id}")
async def quiz_by_id(id: int) -> Quiz:
    quizzes = get_quizzes()
    
    # Check if the id is within the valid range
    if id < 1 or id > len(quizzes):
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Return the quiz (id - 1 because list indices start at 0)
    return quizzes[id - 1]

@app.post("/quizzes", response_model=Quiz)
async def add_quiz(quiz: Quiz):
    """
    BEWARE THIS FUNCTION IS UNTESTED
    """
    
    # Create a reference to a Firestore document for the quiz using its id as the document ID.
    quiz_ref = db.collection("quizzes").document(str(quiz.id))
    
    # Check if a quiz with this ID already exists.
    if quiz_ref.get().exists:
        raise HTTPException(status_code=400, detail="Quiz already exists")
    
    # Convert the Quiz object to a dictionary and store it in Firestore.
    quiz_ref.set(quiz.dict())
    
    return quiz

