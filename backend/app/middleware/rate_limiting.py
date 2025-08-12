"""
Rate limiting middleware.
"""

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

# Create in-memory limiter
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["1000 per hour"]
)
