import json
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import build_medical_prompt
from app.models.medical_record import MedicalRecord
from app.models.patient import Patient
from app.repositories.medical_record_repository import MedicalRecordRepository
from app.repositories.patient_repository import PatientRepository
from app.schemas.ai import AIAnalysisResponse


class AIService:

    @staticmethod
    def analyze(
        patient: Patient,
        medical_record: MedicalRecord,
    ) -> AIAnalysisResponse:

        prompt = build_medical_prompt(
            patient,
            medical_record,
        )

        response = gemini_client.generate_content(prompt)

        try:
            data = json.loads(response)
            return AIAnalysisResponse(**data)

        except Exception:
            raise HTTPException(
                status_code=500,
                detail="Failed to parse AI response.",
            )

    @staticmethod
    def analyze_medical_record(
        db: Session,
        medical_record_id: UUID,
    ) -> AIAnalysisResponse:

        medical_record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
        )

        if medical_record is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found.",
            )

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=medical_record.patient_id,
        )

        if patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found.",
            )

        analysis = AIService.analyze(
            patient,
            medical_record,
        )

        # Save AI output into database
        medical_record.ai_summary = analysis.summary
        medical_record.ai_risk_score = analysis.risk_score

        medical_record.ai_recommendation = "\n".join(
            analysis.recommendations
        )

        db.commit()
        db.refresh(medical_record)

        return analysis