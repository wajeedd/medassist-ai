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

            cleaned_response = response.strip()

            # Remove Markdown code fences if Gemini returns them
            cleaned_response = re.sub(
                r"^```(?:json)?\s*",
                "",
                cleaned_response,
                flags=re.IGNORECASE,
            )

            cleaned_response = re.sub(
                r"\s*```$",
                "",
                cleaned_response,
            )

            cleaned_response = cleaned_response.strip()

            data = json.loads(cleaned_response)

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
    # CHECK WHETHER MEDICAL RECORD HAS ENOUGH DATA
    # =====================================================

    @staticmethod
    def has_sufficient_clinical_data(
        medical_record: MedicalRecord,
    ) -> bool:

        # -------------------------------------------------
        # Required clinical narrative fields
        # -------------------------------------------------

        narrative_fields = [
            medical_record.chief_complaint,
            medical_record.symptoms,
            medical_record.diagnosis,
            medical_record.treatment_plan,
            medical_record.doctor_notes,
        ]

        valid_narrative_fields = [
            str(value).strip()
            for value in narrative_fields
            if value is not None
            and str(value).strip()
        ]

        # -------------------------------------------------
        # Vital signs
        # -------------------------------------------------

        vital_signs = [
            medical_record.temperature,
            medical_record.blood_pressure,
            medical_record.heart_rate,
            medical_record.respiratory_rate,
            medical_record.oxygen_saturation,
        ]

        valid_vital_signs = [
            value
            for value in vital_signs
            if value is not None
        ]

        # -------------------------------------------------
        # Detect obvious placeholder text
        # -------------------------------------------------

        placeholder_values = {
            "zxc",
            "zxc zx",
            "nooooas",
            "sdf",
            "czx",
            "test",
            "testing",
            "abc",
            "xyz",
            "n/a",
            "na",
            "none",
        }

        has_placeholder = False

        for value in valid_narrative_fields:

            normalized = (
                value.lower()
                .strip()
            )

            if normalized in placeholder_values:
                has_placeholder = True
                break

        # -------------------------------------------------
        # Clinical data is insufficient when:
        #
        # 1. No meaningful narrative AND
        # 2. No vital signs
        #
        # OR obvious placeholder-only documentation exists.
        # -------------------------------------------------

        if (
            not valid_narrative_fields
            and not valid_vital_signs
        ):
            return False

        if (
            has_placeholder
            and not valid_vital_signs
            and len(valid_narrative_fields) <= 1
        ):
            return False

        return True


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

        # -------------------------------------------------
        # Generate AI analysis
        # -------------------------------------------------

        analysis = AIService.analyze(
            patient,
            medical_record,
        )

        # -------------------------------------------------
        # Check clinical data quality
        # -------------------------------------------------

        sufficient_data = (
            AIService.has_sufficient_clinical_data(
                medical_record
            )
        )

        # -------------------------------------------------
        # Save AI summary
        # -------------------------------------------------

        medical_record.ai_summary = (
            analysis.summary
        )

        # -------------------------------------------------
        # Save risk score
        #
        # If the record does not contain enough clinical
        # information, do NOT save AI's 0 as a genuine
        # low-risk score.
        # -------------------------------------------------

        if sufficient_data:

            medical_record.ai_risk_score = (
                analysis.risk_score
            )

        else:

            medical_record.ai_risk_score = None

        # -------------------------------------------------
        # Save recommendations
        # -------------------------------------------------

        medical_record.ai_recommendation = (
            "\n".join(
                analysis.recommendations
            )
        )

        # -------------------------------------------------
        # Commit changes
        # -------------------------------------------------

        db.commit()

        db.refresh(
            medical_record
        )

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
            cleaned_response = re.sub(
                r"^```(?:json)?\s*",
                "",
                cleaned_response,
                flags=re.IGNORECASE,
            )

            # Remove closing Markdown code fence
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