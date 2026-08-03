from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.medical_record import MedicalRecord
from app.repositories.medical_record_repository import MedicalRecordRepository
from app.repositories.patient_repository import PatientRepository
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
)


class MedicalRecordService:

    @staticmethod
    def create_medical_record(
        db: Session,
        medical_record: MedicalRecordCreate,
        doctor_id: UUID,
    ) -> MedicalRecord:

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=medical_record.patient_id,
       )

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found",
            )

        return MedicalRecordRepository.create(
            db,
            medical_record,
            doctor_id,
        )

    @staticmethod
    def get_medical_record(
        db: Session,
        medical_record_id: UUID,
    ) -> MedicalRecord:

        record = MedicalRecordRepository.get_by_id(
            db,
            medical_record_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        return record

    @staticmethod
    def get_all_medical_records(
        db: Session,
    ) -> list[MedicalRecord]:

        return MedicalRecordRepository.get_all(db)

    @staticmethod
    def get_patient_medical_records(
        db: Session,
        patient_id: UUID,
    ) -> list[MedicalRecord]:

        return MedicalRecordRepository.get_by_patient(
            db,
            patient_id,
        )

    @staticmethod
    def update_medical_record(
        db: Session,
        medical_record_id: UUID,
        data: MedicalRecordUpdate,
    ) -> MedicalRecord:

        record = MedicalRecordRepository.get_by_id(
            db,
            medical_record_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        return MedicalRecordRepository.update(
            db,
            record,
            data,
        )

    @staticmethod
    def delete_medical_record(
        db: Session,
        medical_record_id: UUID,
    ):

        record = MedicalRecordRepository.get_by_id(
            db,
            medical_record_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        MedicalRecordRepository.delete(
            db,
            record,
        )

        return {
            "message": "Medical record deleted successfully"
        }