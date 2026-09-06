from uuid import UUID
from app.services.ai_service import AIService
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

        # Create the medical record
        record = MedicalRecordRepository.create(
            db=db,
            medical_record=medical_record,
            doctor_id=doctor_id,
        )

        # Automatically generate AI analysis
        AIService.analyze_medical_record(
            db=db,
            medical_record_id=record.id,
        )

        # Reload record to get updated AI fields
        db.refresh(record)

        return record
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

        # Update the medical record
        record = MedicalRecordRepository.update(
            db,
            record,
            data,
        )

        # Re-run AI analysis using the updated medical record
        AIService.analyze_medical_record(
            db=db,
            medical_record_id=record.id,
        )

        # Reload record to get the updated AI fields
        db.refresh(record)

        return record

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