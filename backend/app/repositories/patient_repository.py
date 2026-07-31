from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientUpdate


class PatientRepository:

    def __init__(self, db: Session):
        self.db = db

    # -------------------------
    # Create Patient
    # -------------------------
    def create(
        self,
        patient_data: PatientCreate,
        created_by: UUID,
    ) -> Patient:

        patient = Patient(
            **patient_data.model_dump(),
            created_by=created_by,
        )

        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)

        return patient

    # -------------------------
    # Get Patient By ID
    # -------------------------
    def get_by_id(
        self,
        patient_id: UUID,
    ) -> Patient | None:

        return self.db.get(Patient, patient_id)

    # -------------------------
    # Get All Patients
    # -------------------------
    def get_all(self) -> list[Patient]:

        stmt = select(Patient)

        return list(self.db.scalars(stmt).all())

    # -------------------------
    # Update Patient
    # -------------------------
    def update(
        self,
        patient: Patient,
        patient_data: PatientUpdate,
    ) -> Patient:

        update_data = patient_data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(patient, key, value)

        self.db.commit()
        self.db.refresh(patient)

        return patient

    # -------------------------
    # Delete Patient
    # -------------------------
    def delete(
        self,
        patient: Patient,
    ) -> None:

        self.db.delete(patient)
        self.db.commit()