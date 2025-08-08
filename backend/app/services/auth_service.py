"""
Authentication service for user management.
"""

from fastapi import HTTPException
from app.schemas.users import User, UserLogin
from app.utils.auth_utils import create_access_token, get_password_hash, verify_password
from app.database import db
from firebase_admin import auth


class AuthService:
    """Service for authentication operations."""

    @staticmethod
    async def register_user(user: User):
        """Register a new user."""
        user_ref = db.collection("users").document(user.username)
        if user_ref.get().exists:
            raise HTTPException(status_code=400, detail="Username already registered")

        hashed_password = get_password_hash(user.password)
        user_ref.set(
            {"username": user.username, "password": hashed_password, "role": user.role}
        )
        return {"message": "User registered successfully"}

    @staticmethod
    async def login_user(user: UserLogin):
        """Authenticate user and return access token."""
        user_ref = db.collection("users").document(user.username).get()
        if not user_ref.exists:
            raise HTTPException(
                status_code=400, detail="User doesn't exist or password"
            )

        user_data = user_ref.to_dict()
        if not verify_password(user.password, user_data["password"]):
            raise HTTPException(status_code=400, detail="Invalid username or password")

        access_token = create_access_token(
            data={"sub": user.username, "role": user_data["role"]}
        )
        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    def get_user_uid(token: str) -> str:
        """Get user UID from Firebase token."""
        try:
            decoded_token = auth.verify_id_token(token)
            return decoded_token["uid"]
        except Exception:
            raise HTTPException(status_code=401, detail="Invalid or expired token")

    @staticmethod
    async def sign_out_user(token: str):
        """Sign out user by revoking refresh tokens."""
        try:
            user_uid = AuthService.get_user_uid(token)
            auth.revoke_refresh_tokens(user_uid)
            return {"message": "Successfully signed out"}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error signing out: {str(e)}")
