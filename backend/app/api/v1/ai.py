from uuid import UUID

from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

from app.ai.gemini_client import gemini_client
from app.database.session import get_db
from app.schemas.ai import AIAnalysisResponse
from app.services.ai_service import AIService

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"],
)


@router.get("/test")
def test_ai():

    response = gemini_client.generate_content(
        "Reply with only: Gemini AI is connected successfully."
    )

    return {
        "status": "success",
        "response": response,
    }


@router.post(
    "/analyze-medical-record/{medical_record_id}",
    response_model=AIAnalysisResponse,
)
def analyze_medical_record(
    medical_record_id: UUID,
    db: Session = Depends(get_db),
):

    return AIService.analyze_medical_record(
        db=db,
        medical_record_id=medical_record_id,
    )