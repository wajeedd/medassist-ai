from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import require_patient
from app.models.patient import Patient
from app.models.user import User
from app.schemas.patient import PatientResponse
from app.schemas.medical_record import PatientMedicalRecordResponse
from app.services.medical_record_service import MedicalRecordService


router = APIRouter(
    prefix="/patient",
    tags=["Patient Portal"],
)


# =========================================================
# GET MY PATIENT PROFILE
# =========================================================

@router.get(
    "/me",
    response_model=PatientResponse,
)
def get_my_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_patient),
):
    patient = (
        db.query(Patient)
        .filter(Patient.user_id == current_user.id)
        .first()
    )

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient profile not found.",
        )

    return patient


# =========================================================
# GET MY MEDICAL RECORDS
# =========================================================

@router.get(
    "/records",
    response_model=list[PatientMedicalRecordResponse],
)
def get_my_medical_records(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_patient),
):
    return MedicalRecordService.get_my_medical_records(
        db=db,
        patient_user_id=current_user.id,
    )