import json

from fastapi import HTTPException

from app.ai.gemini_client import gemini_client
from app.ai.prompt_builder import build_medical_prompt
from app.models.medical_record import MedicalRecord
from app.models.patient import Patient
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