from fastapi import APIRouter, Depends
from app.schemas.users import (
    StytchUser, StytchLogin, StytchSession,
    MagicLinkRequest, MagicLinkVerify, StytchAuthResponse, StytchMessageResponse
)
from app.services.stytch_service import StytchService

router = APIRouter()


@router.post("/register/", response_model=StytchMessageResponse)
async def register_user(user: StytchUser):
    """Register a new user with Stytch."""
    stytch_service = StytchService()
    return await stytch_service.register_user(user)


@router.post("/login/", response_model=StytchMessageResponse)
async def login_stytch(user: StytchLogin):
    """Send magic link for Stytch authentication."""
    stytch_service = StytchService()
    return await stytch_service.send_magic_link(user.email)


@router.post("/verify/", response_model=StytchAuthResponse)
async def verify_magic_link(verify_data: MagicLinkVerify):
    """Verify magic link token and authenticate user."""
    stytch_service = StytchService()
    return await stytch_service.verify_magic_link(verify_data.token)


@router.post("/authenticate/", response_model=StytchAuthResponse)
async def authenticate_session(session_data: StytchSession):
    """Authenticate a session token."""
    stytch_service = StytchService()
    return await stytch_service.authenticate_session(session_data.session_token)


@router.post("/logout/", response_model=StytchMessageResponse)
async def logout_stytch(session_data: StytchSession):
    """Logout user by revoking session token."""
    stytch_service = StytchService()
    return await stytch_service.logout_user(session_data.session_token)


@router.post("/send-magic-link/", response_model=StytchMessageResponse)
async def send_magic_link(request: MagicLinkRequest):
    """Send magic link to user's email."""
    stytch_service = StytchService()
    return await stytch_service.send_magic_link(request.email)
