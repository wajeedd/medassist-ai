from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.repositories.medical_record_repository import MedicalRecordRepository
from app.repositories.patient_repository import PatientRepository
from app.utils.pdf_generator import PDFGenerator


class ReportService:

    @staticmethod
    def generate_medical_report(
        db: Session,
        medical_record_id: UUID,
    ):

        # Get Medical Record
        medical_record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
        )

        if medical_record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found.",
            )

        # Get Patient
        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=medical_record.patient_id,
        )

        if patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found.",
            )

        # Generate PDF
        pdf = PDFGenerator.generate_medical_report(
            patient=patient,
            medical_record=medical_record,
        )

        return pdf