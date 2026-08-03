from fastapi import APIRouter

from app.ai.gemini_client import gemini_client

router = APIRouter(
    prefix="/ai",
    tags=["AI Analysis"],
)


@router.get("/test")
def test_ai():
    """
    Test Gemini API connection.
    """

    response = gemini_client.generate_content(
        "Reply with only: Gemini AI is connected successfully."
    )

    return {
        "status": "success",
        "response": response,
    }