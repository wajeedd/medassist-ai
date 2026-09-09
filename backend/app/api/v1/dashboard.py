from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.dashboard import (
    DashboardStats,
    DiabetesModelMetrics,
)
from app.services.dashboard_service import DashboardService
from app.services.ml_service import MLService


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"],
)


@router.get(
    "/stats",
    response_model=DashboardStats,
)
def get_dashboard_stats(
    db: Session = Depends(get_db),
):

    return DashboardService.get_dashboard_stats(db)


@router.get(
    "/ml-metrics",
    response_model=DiabetesModelMetrics,
)
def get_diabetes_model_metrics():

    return MLService.get_diabetes_model_metrics()