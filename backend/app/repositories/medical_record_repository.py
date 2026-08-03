from uuid import UUID

from sqlalchemy.orm import Session

from app.models.medical_record import MedicalRecord
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
)


class MedicalRecordRepository:

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

    @staticmethod
    def get_by_id(
        db: Session,
        medical_record_id: UUID,
    ) -> MedicalRecord | None:

        return (
            db.query(MedicalRecord)
            .filter(MedicalRecord.id == medical_record_id)
            .first()
        )

    @staticmethod
    def get_all(
        db: Session,
    ) -> list[MedicalRecord]:

        return db.query(MedicalRecord).all()

    @staticmethod
    def get_by_patient(
        db: Session,
        patient_id: UUID,
    ) -> list[MedicalRecord]:

        return (
            db.query(MedicalRecord)
            .filter(MedicalRecord.patient_id == patient_id)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        medical_record: MedicalRecord,
        data: MedicalRecordUpdate,
    ) -> MedicalRecord:

        update_data = data.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(medical_record, key, value)

        db.commit()
        db.refresh(medical_record)

        return medical_record

    @staticmethod
    def delete(
        db: Session,
        medical_record: MedicalRecord,
    ) -> None:

        db.delete(medical_record)
        db.commit()