from uuid import UUID
from app.schemas.ai import LongitudinalAIResponse
from app.services.ai_service import AIService
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordResponse,
    MedicalRecordUpdate,
)
from app.services.medical_record_service import MedicalRecordService


router = APIRouter(
    prefix="/medical-records",
    tags=["Medical Records"],
)


# -------------------------
# Create Medical Record
# -------------------------

@router.post(
    "",
    response_model=MedicalRecordResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_medical_record(
    request: MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.create_medical_record(
        db=db,
        medical_record=request,
        doctor_id=current_user.id,
    )


# -------------------------
# Get All Medical Records
# -------------------------

@router.get(
    "",
    response_model=list[MedicalRecordResponse],
)
def get_all_medical_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.get_all_medical_records(db)


# -------------------------
# Get Medical Records by Patient
# IMPORTANT: Keep this BEFORE /{medical_record_id}
# -------------------------

@router.get(
    "/patient/{patient_id}",
    response_model=list[MedicalRecordResponse],
)
def get_patient_medical_records(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.get_patient_medical_records(
        db,
        patient_id,
    )

# -------------------------
# AI Longitudinal Patient Analysis
# IMPORTANT: Keep this BEFORE /{medical_record_id}
# -------------------------

@router.get(
    "/patient/{patient_id}/longitudinal-analysis",
    response_model=LongitudinalAIResponse,
)
def analyze_patient_longitudinal_history(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return AIService.analyze_patient_history(
        db=db,
        patient_id=patient_id,
    )
# -------------------------
# Get Medical Record by ID
# -------------------------

@router.get(
    "/{medical_record_id}",
    response_model=MedicalRecordResponse,
)
def get_medical_record(
    medical_record_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.get_medical_record(
        db,
        medical_record_id,
    )


# -------------------------
# Update Medical Record
# -------------------------

@router.put(
    "/{medical_record_id}",
    response_model=MedicalRecordResponse,
)
def update_medical_record(
    medical_record_id: UUID,
    request: MedicalRecordUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.update_medical_record(
        db,
        medical_record_id,
        request,
    )


# -------------------------
# Delete Medical Record
# -------------------------

@router.delete(
    "/{medical_record_id}",
)
def delete_medical_record(
    medical_record_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return MedicalRecordService.delete_medical_record(
        db,
        medical_record_id,
    )