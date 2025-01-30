from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.schemas.quiz import Quiz
import backend.app.quizzes


app = FastAPI() ## Instantiates an app object that lets you make API Calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/quizzes")
async def quiz() -> list[Quiz]:
    return backend.app.quizzes.get_quizzes()