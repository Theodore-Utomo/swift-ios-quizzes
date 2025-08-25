from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from app.routes import auth_routes as auth, classes_routes as classes, quiz_progress_routes as quiz_progress
from app.middleware.rate_limiting import limiter
from app.middleware.security_headers import SecurityHeadersMiddleware
from app.middleware.request_logging import RequestLoggingMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from pydantic import ValidationError
from dotenv import load_dotenv
import os
import logging
from datetime import datetime
from fastapi.responses import JSONResponse


# Load environment variables from .env
load_dotenv()

# Enhanced logging configuration
def setup_logging():
    """Setup logging configuration based on environment."""
    log_level = logging.INFO
    environment = os.getenv("ENVIRONMENT").lower()
    
    if environment == "production":
        log_level = logging.WARNING
    elif environment == "development":
        log_level = logging.DEBUG
    
    # Configure root logger
    logging.basicConfig(
        level=log_level,
        format="%(asctime)s %(levelname)s [%(name)s] %(message)s",
        handlers=[
            logging.StreamHandler(),
        ]
    )
    
    # Set specific loggers
    logging.getLogger("uvicorn.access").setLevel(logging.INFO)
    logging.getLogger("slowapi").setLevel(logging.WARNING)
    
    # Application logger
    app_logger = logging.getLogger("quiz_app")
    app_logger.setLevel(log_level)
    
    return app_logger

app_logger = setup_logging()

# Access the secret key and service account path
SECRET_KEY = os.getenv("SECRET_KEY")

app = FastAPI()

# Add request logging (first, so it logs everything)
app.add_middleware(RequestLoggingMiddleware)

# Add security headers
app.add_middleware(SecurityHeadersMiddleware)

# Add rate limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

# Add CORS middleware
# Get allowed origins from environment variable
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)



@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    # Log the full error for debugging
    logging.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    
    # Check if we're in production environment
    is_production = os.getenv("ENVIRONMENT").lower() == "production"
    
    if is_production:
        # Don't expose internal error details in production
        return JSONResponse(
            status_code=500,
            content={"detail": "Internal server error"},
        )
    else:
        # Show detailed errors in development
        return JSONResponse(
            status_code=500,
            content={"detail": f"Internal server error: {str(exc)}"},
        )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle validation errors."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"][1:])  # Skip 'body' prefix
        message = error["msg"]
        errors.append(f"{field}: {message}")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": errors
        }
    )


@app.exception_handler(ValidationError)
async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        field = ".".join(str(loc) for loc in error["loc"])
        message = error["msg"]
        errors.append(f"{field}: {message}")
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": errors
        }
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for production monitoring."""
    try:
        # Test database connection by trying to access a collection
        from app.database import db
        # This will raise an exception if database is not accessible
        db.collection("health_check").limit(1).get()
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "database": "connected"
        }
    except Exception as e:
        logging.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "timestamp": datetime.utcnow().isoformat(),
                "database": "disconnected",
                "error": "Database connection failed"
            }
        )


@app.get("/healthz")
async def health_check_simple():
    """Simple health check for load balancers."""
    return {"status": "ok"}


# Include routers
app.include_router(auth.router, tags=["authentication"])
app.include_router(classes.router, prefix="/classes", tags=["classes"])
app.include_router(quiz_progress.router, prefix="/QuizProgress", tags=["quiz-progress"])
