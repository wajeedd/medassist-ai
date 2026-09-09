import json
import re
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import (
    build_medical_prompt,
    build_longitudinal_prompt,
)
from app.ml.diabetes_predictor import diabetes_predictor

from app.models.medical_record import MedicalRecord
from app.models.patient import Patient

from app.repositories.medical_record_repository import (
    MedicalRecordRepository,
)
from app.repositories.patient_repository import (
    PatientRepository,
)

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
        diabetes_ml_context: dict | None = None,
    ) -> AIAnalysisResponse:

        prompt = build_medical_prompt(
            patient,
            medical_record,
            diabetes_ml_context=diabetes_ml_context,
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
            "null",
            "unknown",
            "-",
            "--",
            "...",
        }

        # =================================================
        # CHECK NARRATIVE FIELDS
        # =================================================

        narrative_fields = [
            medical_record.chief_complaint,
            medical_record.symptoms,
            medical_record.diagnosis,
            medical_record.treatment_plan,
            medical_record.doctor_notes,
        ]

        meaningful_narrative = []

        for value in narrative_fields:

            if value is None:
                continue

            text = str(value).strip()

            if not text:
                continue

            normalized = text.lower()

            if normalized in placeholder_values:
                continue

            meaningful_narrative.append(text)

        # =================================================
        # CHECK VITAL SIGNS
        # =================================================

        vital_signs = [
            medical_record.temperature,
            medical_record.blood_pressure,
            medical_record.heart_rate,
            medical_record.respiratory_rate,
            medical_record.oxygen_saturation,
        ]

        valid_vitals = []

        for value in vital_signs:

            if value is None:
                continue

            text = str(value).strip()

            if not text:
                continue

            valid_vitals.append(value)

        # =================================================
        # NO MEANINGFUL CLINICAL DATA
        # =================================================

        if (
            not meaningful_narrative
            and not valid_vitals
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

        # =================================================
        # GET MEDICAL RECORD
        # =================================================

        medical_record = MedicalRecordRepository.get_by_id(
            db=db,
            medical_record_id=medical_record_id,
        )

        if medical_record is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Medical record not found.",
            )

        # =================================================
        # GET PATIENT
        # =================================================

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=medical_record.patient_id,
        )

        if patient is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found.",
            )

        # =================================================
        # CHECK CLINICAL DATA BEFORE AI ANALYSIS
        # =================================================

        sufficient_data = AIService.has_sufficient_clinical_data(
            medical_record
        )

        # =================================================
        # RUN DATASET-BASED DIABETES ML ANALYSIS
        # =================================================

        diabetes_ml_result = diabetes_predictor.predict(
            medical_record
        )

        # =================================================
        # BUILD ML CONTEXT FOR GEMINI
        # =================================================

        diabetes_ml_context = {
            "model": diabetes_ml_result.get("model"),
            "dataset": diabetes_ml_result.get("dataset"),
            "risk_score": diabetes_ml_result.get(
                "risk_score"
            ),
            "prediction": diabetes_ml_result.get(
                "prediction"
            ),
            "feature_coverage": diabetes_ml_result.get(
                "feature_coverage"
            ),
            "detected_features": diabetes_ml_result.get(
                "detected_features",
                {},
            ),
        }

        # =================================================
        # GENERATE GEMINI AI ANALYSIS
        # =================================================

        analysis = AIService.analyze(
            patient,
            medical_record,
            diabetes_ml_context=diabetes_ml_context,
        )

        # =================================================
        # SAVE GEMINI AI SUMMARY
        # =================================================

        medical_record.ai_summary = analysis.summary

        # =================================================
        # SAVE GEMINI RISK SCORE
        #
        # Insufficient clinical data = NULL
        # Never use 0 as a placeholder.
        # =================================================

        if sufficient_data:

            medical_record.ai_risk_score = (
                analysis.risk_score
            )

        else:

            medical_record.ai_risk_score = None

        # =================================================
        # SAVE GEMINI RECOMMENDATIONS
        # =================================================

        medical_record.ai_recommendation = (
            "\n".join(
                analysis.recommendations
            )
        )

        # =================================================
        # SAVE GEMINI ANALYSIS TIMESTAMP
        # =================================================

        medical_record.ai_analyzed_at = datetime.now(
            timezone.utc
        )

        # =================================================
        # SAVE DATASET-BASED DIABETES ML RESULT
        # =================================================

        medical_record.ml_diabetes_risk_score = (
            diabetes_ml_result.get("risk_score")
        )

        medical_record.ml_diabetes_prediction = (
            diabetes_ml_result.get("prediction")
        )

        medical_record.ml_diabetes_model = (
            diabetes_ml_result.get("model")
        )

        medical_record.ml_diabetes_feature_coverage = (
            diabetes_ml_result.get("feature_coverage")
        )

        medical_record.ml_diabetes_analyzed_at = (
            datetime.now(timezone.utc)
        )

        # =================================================
        # SAVE CHANGES
        # =================================================

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

        # =================================================
        # GET PATIENT
        # =================================================

        patient = PatientRepository.get_by_id(
            db=db,
            patient_id=patient_id,
        )

        if patient is None:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found.",
            )

        # =================================================
        # GET ALL MEDICAL RECORDS
        # =================================================

        records = MedicalRecordRepository.get_by_patient(
            db=db,
            patient_id=patient_id,
        )

        # =================================================
        # VALIDATE MEDICAL HISTORY
        # =================================================

        if not records:

            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No medical records found for this patient.",
            )

        # =================================================
        # BUILD LONGITUDINAL PROMPT
        # =================================================

        prompt = build_longitudinal_prompt(
            patient=patient,
            records=records,
        )

        # =================================================
        # GENERATE AI RESPONSE
        # =================================================

        response = gemini_client.generate_content(
            prompt
        )

        # =================================================
        # PARSE AI JSON RESPONSE
        # =================================================

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