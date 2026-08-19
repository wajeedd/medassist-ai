import json
import re
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import (
    build_medical_prompt,
    build_longitudinal_prompt,
)

from app.models.medical_record import MedicalRecord
from app.models.patient import Patient

from app.repositories.medical_record_repository import MedicalRecordRepository
from app.repositories.patient_repository import PatientRepository

from app.schemas.ai import (
    AIAnalysisResponse,
    LongitudinalAIResponse,
)


class AIService:

    # =====================================================
    # SINGLE MEDICAL RECORD AI ANALYSIS
    # =====================================================

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

        except Exception as error:

            print(
                "AI response parsing error:",
                error,
            )

            print(
                "Raw AI response:",
                response,
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse AI response.",
            )


    # =====================================================
    # SAVE SINGLE MEDICAL RECORD AI ANALYSIS
    # =====================================================

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

        # -----------------------------------------
        # Save AI output into database
        # -----------------------------------------

        medical_record.ai_summary = analysis.summary

        medical_record.ai_risk_score = analysis.risk_score

        medical_record.ai_recommendation = "\n".join(
            analysis.recommendations
        )

        db.commit()

        db.refresh(medical_record)

        return analysis


    # =====================================================
    # LONGITUDINAL PATIENT AI ANALYSIS
    # =====================================================

    @staticmethod
    def analyze_patient_history(
        db: Session,
        patient_id: UUID,
    ) -> LongitudinalAIResponse:

        # -----------------------------------------
        # Get patient
        # -----------------------------------------

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=patient_id,
        )

        if patient is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found.",
            )

        # -----------------------------------------
        # Get all medical records
        # -----------------------------------------

        records = MedicalRecordRepository.get_by_patient(
            db=db,
            patient_id=patient_id,
        )

        # -----------------------------------------
        # Validate medical history
        # -----------------------------------------

        if not records:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No medical records found for this patient.",
            )

        # -----------------------------------------
        # Build longitudinal AI prompt
        # -----------------------------------------

        prompt = build_longitudinal_prompt(
            patient=patient,
            records=records,
        )

        # -----------------------------------------
        # Generate AI response
        # -----------------------------------------

        response = gemini_client.generate_content(
            prompt
        )

        # -----------------------------------------
        # Parse AI JSON response
        # -----------------------------------------

        try:

            cleaned_response = response.strip()

            # Remove opening Markdown code fence
            # Example:
            # ```json
            cleaned_response = re.sub(
                r"^```(?:json)?\s*",
                "",
                cleaned_response,
                flags=re.IGNORECASE,
            )

            # Remove closing Markdown code fence
            # Example:
            # ```
            cleaned_response = re.sub(
                r"\s*```$",
                "",
                cleaned_response,
            )

            cleaned_response = cleaned_response.strip()

            data = json.loads(
                cleaned_response
            )

            return LongitudinalAIResponse(
                **data
            )

        except Exception as error:

            print(
                "Longitudinal AI response parsing error:",
                error,
            )

            print(
                "Raw longitudinal AI response:",
                response,
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to parse longitudinal AI response.",
            )