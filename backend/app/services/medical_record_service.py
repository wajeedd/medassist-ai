from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.medical_record import MedicalRecord
from app.repositories.medical_record_repository import MedicalRecordRepository
from app.repositories.patient_repository import PatientRepository
from app.services.ai_service import AIService
from app.schemas.medical_record import (
    MedicalRecordCreate,
    MedicalRecordUpdate,
)


class MedicalRecordService:

    # =========================================================
    # CREATE MEDICAL RECORD
    # =========================================================

    @staticmethod
    def create_medical_record(
        db: Session,
        medical_record: MedicalRecordCreate,
        doctor_id: UUID,
    ) -> MedicalRecord:

        # -----------------------------------------------------
        # Verify that the patient belongs to the logged-in doctor
        # -----------------------------------------------------

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=medical_record.patient_id,
            created_by=doctor_id,
        )

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found",
            )

        # -----------------------------------------------------
        # Create the medical record
        # -----------------------------------------------------

        record = MedicalRecordRepository.create(
            db=db,
            medical_record=medical_record,
            doctor_id=doctor_id,
        )

        # -----------------------------------------------------
        # Automatically generate AI analysis
        # -----------------------------------------------------

        AIService.analyze_medical_record(
            db=db,
            medical_record_id=record.id,
        )

        # -----------------------------------------------------
        # Reload record to get updated AI fields
        # -----------------------------------------------------

        db.refresh(record)

        return record

    # =========================================================
    # GET MEDICAL RECORD BY ID
    # =========================================================

    @staticmethod
    def get_medical_record(
        db: Session,
        medical_record_id: UUID,
        doctor_id: UUID,
    ) -> MedicalRecord:

        record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
            doctor_id=doctor_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        return record

    # =========================================================
    # GET ALL MEDICAL RECORDS
    # =========================================================

    @staticmethod
    def get_all_medical_records(
        db: Session,
        doctor_id: UUID,
    ) -> list[MedicalRecord]:

        return MedicalRecordRepository.get_all(
            db=db,
            doctor_id=doctor_id,
        )

    # =========================================================
    # GET MEDICAL RECORDS BY PATIENT
    # =========================================================

    @staticmethod
    def get_patient_medical_records(
        db: Session,
        patient_id: UUID,
        doctor_id: UUID,
    ) -> list[MedicalRecord]:

        # -----------------------------------------------------
        # First verify that the patient belongs to this doctor
        # -----------------------------------------------------

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=patient_id,
            created_by=doctor_id,
        )

        if not patient:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found",
            )

        # -----------------------------------------------------
        # Return only this doctor's records for that patient
        # -----------------------------------------------------

        return MedicalRecordRepository.get_by_patient(
            db=db,
            patient_id=patient_id,
            doctor_id=doctor_id,
        )

    # =========================================================
    # UPDATE MEDICAL RECORD
    # =========================================================

    @staticmethod
    def update_medical_record(
        db: Session,
        medical_record_id: UUID,
        data: MedicalRecordUpdate,
        doctor_id: UUID,
    ) -> MedicalRecord:

        # -----------------------------------------------------
        # Get record only if it belongs to this doctor
        # -----------------------------------------------------

        record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
            doctor_id=doctor_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        # -----------------------------------------------------
        # Update the medical record
        # -----------------------------------------------------

        record = MedicalRecordRepository.update(
            db=db,
            medical_record=record,
            data=data,
        )

        # -----------------------------------------------------
        # Re-run AI analysis using the updated record
        # -----------------------------------------------------

        AIService.analyze_medical_record(
            db=db,
            medical_record_id=record.id,
        )

        # -----------------------------------------------------
        # Reload record to get updated AI fields
        # -----------------------------------------------------

        db.refresh(record)

        return record

    # =========================================================
    # DELETE MEDICAL RECORD
    # =========================================================

    @staticmethod
    def delete_medical_record(
        db: Session,
        medical_record_id: UUID,
        doctor_id: UUID,
    ):

        # -----------------------------------------------------
        # Get record only if it belongs to this doctor
        # -----------------------------------------------------

        record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
            doctor_id=doctor_id,
        )

        if not record:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found",
            )

        # -----------------------------------------------------
        # Delete record
        # -----------------------------------------------------

        MedicalRecordRepository.delete(
            db=db,
            medical_record=record,
        )

        return {
            "message": "Medical record deleted successfully"
        }