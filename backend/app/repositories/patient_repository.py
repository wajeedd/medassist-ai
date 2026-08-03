from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


class PatientRepository:

    # -------------------------
    # Create Patient
    # -------------------------
    @staticmethod
    def create(
        db: Session,
        patient_data: PatientCreate,
        created_by: UUID,
    ) -> Patient:

        patient = Patient(
            **patient_data.model_dump(),
            created_by=created_by,
        )

        db.add(patient)
        db.commit()
        db.refresh(patient)

        return patient

    # -------------------------
    # Get Patient By ID
    # -------------------------
    @staticmethod
    def get_by_id(
        db: Session,
        patient_id: UUID,
    ) -> Patient | None:

        return db.get(
            Patient,
            patient_id,
        )

    # -------------------------
    # Get All Patients
    # -------------------------
    @staticmethod
    def get_all(
        db: Session,
    ) -> list[Patient]:

        stmt = select(Patient)

        return list(
            db.scalars(stmt).all()
        )

    # -------------------------
    # Update Patient
    # -------------------------
    @staticmethod
    def update(
        db: Session,
        patient: Patient,
        patient_data: PatientUpdate,
    ) -> Patient:

        update_data = patient_data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(patient, key, value)

        db.commit()
        db.refresh(patient)

        return patient

    # -------------------------
    # Delete Patient
    # -------------------------
    @staticmethod
    def delete(
        db: Session,
        patient: Patient,
    ) -> None:

        db.delete(patient)
        db.commit()