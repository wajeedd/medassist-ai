from uuid import UUID

from sqlalchemy.orm import Session

from app.models.medical_record import MedicalRecord
from app.models.patient import Patient
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
)

class MedicalRecordRepository:

    # -------------------------
    # Create Medical Record
    # -------------------------
    @staticmethod
    def create(
        db: Session,
        medical_record: MedicalRecordCreate,
        doctor_id: UUID,
    ) -> MedicalRecord:

        db_record = MedicalRecord(
            **medical_record.model_dump(),
            doctor_id=doctor_id,
        )

        db.add(db_record)
        db.commit()
        db.refresh(db_record)

        return db_record

    # -------------------------
    # Get Medical Record By ID
    # -------------------------
    @staticmethod
    def get_by_id(
        db: Session,
        medical_record_id: UUID,
        doctor_id: UUID,
    ) -> MedicalRecord | None:

        return (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.id == medical_record_id,
                MedicalRecord.doctor_id == doctor_id,
            )
            .first()
        )

    # -------------------------
    # Get All Medical Records
    # -------------------------
    @staticmethod
    def get_all(
        db: Session,
        doctor_id: UUID,
    ) -> list[MedicalRecord]:

        return (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.doctor_id == doctor_id,
            )
            .all()
        )

        # -------------------------
    # Get Records For Patient Account
    # -------------------------
    @staticmethod
    def get_for_patient(
        db: Session,
        patient_user_id: UUID,
    ) -> list[MedicalRecord]:

        return (
            db.query(MedicalRecord)
            .join(
                Patient,
                MedicalRecord.patient_id == Patient.id,
            )
            .filter(
                Patient.user_id == patient_user_id,
            )
            .all()
        )

    # -------------------------
    # Update
    # -------------------------
    @staticmethod
    def update(
        db: Session,
        medical_record: MedicalRecord,
        data: MedicalRecordUpdate,
    ) -> MedicalRecord:

        update_data = data.model_dump(
            exclude_unset=True,
        )

        for key, value in update_data.items():
            setattr(medical_record, key, value)

        db.commit()
        db.refresh(medical_record)

        return medical_record

    # -------------------------
    # Delete
    # -------------------------
    @staticmethod
    def delete(
        db: Session,
        medical_record: MedicalRecord,
    ) -> None:

        db.delete(medical_record)
        db.commit()