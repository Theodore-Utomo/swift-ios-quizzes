"""
Authentication middleware for protecting routes.
"""

from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import logging
from app.services.stytch_service import StytchService

logger = logging.getLogger(__name__)

# Create HTTPBearer instance for token extraction
security = HTTPBearer(auto_error=False)


class AuthMiddleware:
    """Authentication middleware for protecting routes."""
    
    def __init__(self):
        self.stytch_service = StytchService()
    
    async def verify_session_token(self, session_token: str) -> dict:
        """Verify session token and return user data."""
        try:
            auth_response = await self.stytch_service.authenticate_session(session_token)
            return {
                "user_id": auth_response.user_id,
                "email": auth_response.email,
                "role": auth_response.role,
                "stytch_user_id": auth_response.stytch_user_id
            }
        except Exception as e:
            logger.warning(f"Session verification failed: {str(e)}")
            raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    async def get_current_user(self, request: Request) -> Optional[dict]:
        """Extract and verify user from request."""
        # Try to get session token from Authorization header
        authorization: str = request.headers.get("Authorization")
        session_token = None
        
        if authorization and authorization.startswith("Bearer "):
            session_token = authorization.replace("Bearer ", "")
        
        # Also try to get from custom header (for compatibility)
        if not session_token:
            session_token = request.headers.get("X-Session-Token")
        
        if not session_token:
            return None
        
        try:
            return await self.verify_session_token(session_token)
        except HTTPException:
            return None
    
    async def require_auth(self, request: Request) -> dict:
        """Require authentication and return user data."""
        user = await self.get_current_user(request)
        if not user:
            raise HTTPException(
                status_code=401, 
                detail="Authentication required",
                headers={"WWW-Authenticate": "Bearer"}
            )
        return user
    
    async def require_role(self, request: Request, required_role: str) -> dict:
        """Require specific role and return user data."""
        user = await self.require_auth(request)
        if user["role"] != required_role:
            raise HTTPException(
                status_code=403, 
                detail=f"Access denied. Required role: {required_role}"
            )
        return user
    
    async def require_instructor(self, request: Request) -> dict:
        """Require instructor role."""
        return await self.require_role(request, "instructor")


# Global instance
auth_middleware = AuthMiddleware()
