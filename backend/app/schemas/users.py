from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
import re
from app.schemas.role_enum import UserRole


class User(BaseModel):
    username: str
    password: str
    role: UserRole


class UserLogin(BaseModel):
    username: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class StytchUser(BaseModel):
    email: EmailStr
    role: UserRole = UserRole.STUDENT


class StytchLogin(BaseModel):
    email: EmailStr


class StytchSession(BaseModel):
    session_token: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Stytch session token"
    )
    
    @validator('session_token')
    def validate_session_token(cls, v):
        if not v or not v.strip():
            raise ValueError('Session token cannot be empty')
        # Basic validation - should be alphanumeric with some special chars
        if not re.match(r'^[a-zA-Z0-9\-_.]+$', v):
            raise ValueError('Invalid session token format')
        return v.strip()


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerify(BaseModel):
    token: str = Field(
        ...,
        min_length=10,
        max_length=1000,
        description="Magic link verification token"
    )
    
    @validator('token')
    def validate_token(cls, v):
        if not v or not v.strip():
            raise ValueError('Token cannot be empty')
        # Basic validation for magic link token
        if not re.match(r'^[a-zA-Z0-9\-_.]+$', v):
            raise ValueError('Invalid token format')
        return v.strip()


class StytchAuthResponse(BaseModel):
    user_id: str
    email: str
    role: str
    session_token: str
    stytch_user_id: Optional[str] = None


class StytchMessageResponse(BaseModel):
    message: str
    email: Optional[str] = None
    user_id: Optional[str] = None
    stytch_user_id: Optional[str] = None
