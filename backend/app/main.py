from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth_routes as auth, classes_routes as classes, quizzes_routes as quizzes
from dotenv import load_dotenv
import os
import logging
from fastapi.responses import JSONResponse


# Load environment variables from .env
load_dotenv()

# Basic logging config for local debugging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
)

# Access the secret key and service account path
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "https://my-quiz-app-frontend.onrender.com",
    ],  # Replace later during production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error: " + str(exc)},
    )


# Include routers
app.include_router(auth.router, tags=["authentication"])
app.include_router(classes.router, prefix="/classes", tags=["classes"])
app.include_router(quizzes.router, prefix="/quizzes", tags=["quizzes"])
