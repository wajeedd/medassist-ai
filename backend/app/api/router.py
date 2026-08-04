from fastapi import APIRouter

from app.api.v1.health import router as health_router
from app.api.v1.auth import router as auth_router
from app.api.v1.patients import router as patients_router
from app.api.v1.medical_records import router as medical_records_router
from app.api.v1.ai import router as ai_router
from app.api.v1.reports import router as reports_router

router = APIRouter()

router.include_router(health_router)
router.include_router(auth_router)
router.include_router(patients_router)
router.include_router(medical_records_router)
router.include_router(ai_router)
router.include_router(reports_router)