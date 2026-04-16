"""
Statistics routes.
"""

from fastapi import APIRouter, Request
from app.middleware.auth_middleware import auth_middleware
from app.services.metrics_service import MetricsService


router = APIRouter()

@router.get("/metrics")
async def get_metrics(request: Request):
  user = await auth_middleware.require_instructor(request)
  return await MetricsService.get_metrics()
