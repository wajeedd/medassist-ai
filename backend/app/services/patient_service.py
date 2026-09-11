from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.repositories.patient_repository import PatientRepository
from app.schemas.patient import PatientCreate, PatientUpdate


class PatientService:

    def __init__(self, db: Session):
        self.db = db

    # -------------------------
    # Create Patient
    # -------------------------
    def create_patient(
        self,
        patient_data: PatientCreate,
        created_by: UUID,
    ) -> Patient:

        return PatientRepository.create(
            db=self.db,
            patient_data=patient_data,
            created_by=created_by,
        )

    # -------------------------
    # Get Patient
    # -------------------------
    def get_patient(
        self,
        patient_id: UUID,
        created_by: UUID,
    ) -> Patient:

        patient = PatientRepository.get_by_id(
            db=self.db,
            patient_id=patient_id,
            created_by=created_by,
        )

        if patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found",
            )

        return patient

    # -------------------------
    # Get All Patients
    # -------------------------
    def get_all_patients(
        self,
        created_by: UUID,
    ) -> list[Patient]:

        return PatientRepository.get_all(
            db=self.db,
            created_by=created_by,
        )

    # -------------------------
    # Update Patient
    # -------------------------
    def update_patient(
        self,
        patient_id: UUID,
        patient_data: PatientUpdate,
        created_by: UUID,
    ) -> Patient:

        patient = self.get_patient(
            patient_id=patient_id,
            created_by=created_by,
        )

        return PatientRepository.update(
            db=self.db,
            patient=patient,
            patient_data=patient_data,
        )

    # -------------------------
    # Delete Patient
    # -------------------------
    def delete_patient(
        self,
        patient_id: UUID,
        created_by: UUID,
    ) -> None:

        patient = self.get_patient(
            patient_id=patient_id,
            created_by=created_by,
        )

        PatientRepository.delete(
            db=self.db,
            patient=patient,
        )