from fastapi import FastAPI, HTTPException
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

@app.get("/quizzes/{id}")
async def quiz_by_id(id: int) -> Quiz:
    quizzes = backend.app.quizzes.get_quizzes()
    
    # Check if the id is within the valid range
    if id < 1 or id > len(quizzes):
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    # Return the quiz (id - 1 because list indices start at 0)
    return quizzes[id - 1]
