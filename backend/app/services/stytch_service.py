"""
Stytch authentication service for user management.
"""

import os
import uuid
from typing import Optional
import logging
from fastapi import HTTPException
import stytch
from app.schemas.users import (
    StytchUser,
    StytchAuthResponse,
    StytchMessageResponse,
)
from app.database import db


class StytchService:
    """Service for Stytch authentication operations."""

    def __init__(self):
        """Initialize Stytch client."""
        self.logger = logging.getLogger(__name__)
        # Strip quotes from environment variables if present
        project_id = os.getenv("STYTCH_PROJECT_ID")
        secret = os.getenv("STYTCH_SECRET")
        
        self.client = stytch.Client(
            project_id=project_id,
            secret=secret
        )

    @staticmethod
    def _extract_user_id(user_obj) -> Optional[str]:
        """Return Stytch user_id from a user object if present."""
        return getattr(user_obj, "user_id", None)

    @staticmethod
    def _extract_primary_email(user_obj) -> Optional[str]:
        """Return the first email address from user.emails, if available."""
        emails = getattr(user_obj, "emails", None)
        if not isinstance(emails, list):
            return None
        for item in emails:
            email = getattr(item, "email", None)
            if not email and isinstance(item, dict):
                email = item.get("email")
            if email:
                return email
        return None

    def _find_user_by_email(self, email: str):
        """Find a user document by email address."""
        users_ref = db.collection("users")
        query = users_ref.where("email", "==", email).limit(1)
        results = query.get()
        if results:
            return results[0]
        return None

    def _create_user_with_uuid(self, email: str, stytch_user_id: Optional[str], role: str = "student"):
        """Create a new user with a UUID as document ID."""
        user_id = str(uuid.uuid4())
        user_ref = db.collection("users").document(user_id)
        user_ref.set({
            "username": email,
            "role": role,
            "stytch_id": str(stytch_user_id) if stytch_user_id else None,
            "email": email
        })
        return user_ref.get()

    async def register_user(self, user: StytchUser) -> StytchMessageResponse:
        """Register a new user with Stytch."""
        try:
            # Create user in Stytch - just pass email
            stytch_response = self.client.users.create(
                email=user.email
            )
            
            # Handle response - it's a CreateResponse object
            stytch_user_id = stytch_response.user_id
            
            role_value = "student"  
            
            # Check if user already exists
            existing_user = self._find_user_by_email(user.email)
            if existing_user:
                raise HTTPException(status_code=400, detail="User already exists")
            
            self._create_user_with_uuid(user.email, stytch_user_id, role_value)
            
            return StytchMessageResponse(message="User registered successfully", stytch_user_id=str(stytch_user_id))
            
        except Exception as e:
            if "already exists" in str(e).lower():
                raise HTTPException(status_code=400, detail="User already exists")
            else:
                raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")



    async def authenticate_session(self, session_token: str) -> StytchAuthResponse:
        """Authenticate a session token from Stytch."""
        try:
            self.logger.debug("[stytch_service] authenticate_session start")
            stytch_response = self.client.sessions.authenticate(
                session_token=session_token
            )
            user_obj = getattr(stytch_response, "user", None)
            stytch_user_id = self._extract_user_id(user_obj) or getattr(stytch_response, "user_id", None)
            user_email = self._extract_primary_email(user_obj)
            self.logger.debug("[stytch_service] authenticate_session stytch ok user_id=%s", stytch_user_id or "<none>")
            if user_email is None:
                raise HTTPException(status_code=500, detail="No email found in session user")
            
            # Get user data from Firestore
            user_data = self._find_user_by_email(user_email)
            
            if not user_data:
                # If user missing, create a default entry for robustness
                user_data = self._create_user_with_uuid(user_email, stytch_user_id, "student")
            
            user_dict = user_data.to_dict()
            logging.info(f"USER_DICT: {user_dict}")
            
            self.logger.info("[stytch_service] authenticate_session success email=%s role=%s", user_email, user_dict.get("role", "student"))            
            return StytchAuthResponse(
                stytch_user_id=str(stytch_user_id) if stytch_user_id else None,
                user_id=user_data.id,
                email=user_email,
                role=user_dict.get("role", "student"),
                session_token=session_token,
            )
            
        except Exception as e:
            self.logger.exception("[stytch_service] authenticate_session error: %s", str(e))
            if "expired" in str(e).lower():
                raise HTTPException(status_code=401, detail="Session expired")
            elif "invalid" in str(e).lower():
                raise HTTPException(status_code=401, detail="Invalid session token")
            else:
                raise HTTPException(status_code=500, detail=f"Authentication failed: {str(e)}")

    async def logout_user(self, session_token: str) -> StytchMessageResponse:
        """Logout user by revoking session token."""
        try:
            # Revoke the session token
            self.client.sessions.revoke(session_token=session_token)
            return StytchMessageResponse(message="Successfully logged out")
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Logout failed: {str(e)}")

    async def send_magic_link(self, email: str) -> StytchMessageResponse:
        """Send magic link to user's email."""
        try:
            self.logger.info("[stytch_service] send_magic_link email=%s", email)
            
            # Get frontend URL from environment variable
            frontend_url = os.getenv("FRONTEND_URL")
            callback_url = f"{frontend_url}/auth/callback"
            
            stytch_response = self.client.magic_links.email.login_or_create(
                email=email,
                login_magic_link_url=callback_url,
                signup_magic_link_url=callback_url
            )
            
            return StytchMessageResponse(message="Magic link sent to your email", email=email, stytch_user_id=str(stytch_response.user_id))
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to send magic link: {str(e)}")

    async def verify_magic_link(self, token: str) -> StytchAuthResponse:
        """Verify magic link token and authenticate user."""
        try:
            # Start (debug-level; avoid token noise in normal logs)
            self.logger.debug("[stytch_service] verify_magic_link start")
            # Ask Stytch to create a session and return a session_token
            stytch_response = self.client.magic_links.authenticate(
                token=token,
                session_duration_minutes=60,
            )
            user_obj = getattr(stytch_response, "user", None)
            stytch_user_id = self._extract_user_id(user_obj) or getattr(stytch_response, "user_id", None)
            user_email = self._extract_primary_email(user_obj)
            self.logger.debug("[stytch_service] verify_magic_link stytch ok user_id=%s", stytch_user_id or "<none>")
            
            # Get user data from Firestore
            if user_email is None:
                raise HTTPException(status_code=500, detail="No email found in verified user")
            user_data = self._find_user_by_email(user_email)
            
            if not user_data:
                # Create user in Firestore if they don't exist
                user_data = self._create_user_with_uuid(user_email, stytch_user_id, "student")
                user_dict = {"role": "student"}
            else:
                user_dict = user_data.to_dict()
            
            token_str = str(getattr(stytch_response, 'session_token', ''))

            self.logger.info(
                "[stytch_service] verify_magic_link success email=%s role=%s",
                user_email,
                user_dict.get("role", "student"),
            )            
            return StytchAuthResponse(
                stytch_user_id=str(stytch_response.user_id),
                user_id=user_data.id,
                email=user_email,
                role=user_dict.get("role", "student"),
                session_token=token_str,
            )
            
        except Exception as e:
            self.logger.exception("[stytch_service] verify_magic_link error: %s", str(e))
            if "expired" in str(e).lower():
                raise HTTPException(status_code=401, detail="Magic link expired")
            elif "invalid" in str(e).lower():
                raise HTTPException(status_code=401, detail="Invalid magic link")
            else:
                raise HTTPException(status_code=500, detail=f"Magic link verification failed: {str(e)}") 