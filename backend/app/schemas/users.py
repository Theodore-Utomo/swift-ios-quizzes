from pydantic import BaseModel, EmailStr
from typing import Optional
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
    session_token: str


class MagicLinkRequest(BaseModel):
    email: EmailStr


class MagicLinkVerify(BaseModel):
    token: str


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
