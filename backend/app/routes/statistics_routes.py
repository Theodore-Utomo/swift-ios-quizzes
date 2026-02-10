"""
Statistics routes.
"""

from fastapi import APIRouter, Request
from app.middleware.auth_middleware import auth_middleware
from app.services.statistics_service import StatisticsService


router = APIRouter()

@router.get("/statistics")
async def get_statistics(request: Request):
  user = await auth_middleware.require_instructor(request)
  return await StatisticsService.get_statistics()

@router.get("/statistics-test")
async def get_statistics_test():
  """Test endpoint without authentication for development."""
  return await StatisticsService.get_statistics()