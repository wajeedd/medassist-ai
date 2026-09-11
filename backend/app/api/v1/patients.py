from uuid import UUID

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User

from app.schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
)

from app.services.patient_service import PatientService


router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
)


# =========================================================
# CREATE PATIENT
# =========================================================

@router.post(
    "",
    response_model=PatientResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PatientService(db)

    return service.create_patient(
        patient_data=patient_data,
        created_by=current_user.id,
    )


# =========================================================
# GET ALL PATIENTS
# =========================================================

@router.get(
    "",
    response_model=list[PatientResponse],
)
def get_all_patients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PatientService(db)

    return service.get_all_patients(
        created_by=current_user.id,
    )


# =========================================================
# GET PATIENT BY ID
# =========================================================

@router.get(
    "/{patient_id}",
    response_model=PatientResponse,
)
def get_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PatientService(db)

    return service.get_patient(
        patient_id=patient_id,
        created_by=current_user.id,
    )


# =========================================================
# UPDATE PATIENT
# =========================================================

@router.put(
    "/{patient_id}",
    response_model=PatientResponse,
)
def update_patient(
    patient_id: UUID,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PatientService(db)

    return service.update_patient(
        patient_id=patient_id,
        patient_data=patient_data,
        created_by=current_user.id,
    )


# =========================================================
# DELETE PATIENT
# =========================================================

@router.delete(
    "/{patient_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_patient(
    patient_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PatientService(db)

    service.delete_patient(
        patient_id=patient_id,
        created_by=current_user.id,
    )