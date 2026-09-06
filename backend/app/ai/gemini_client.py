from google import genai
from google.genai import errors
from fastapi import HTTPException, status

from app.core.config import settings


class GeminiClient:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate_content(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model="gemini-3.6-flash",
                contents=prompt,
            )

            if not response.text:
                raise HTTPException(
                    status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                    detail="AI service returned an empty response. Please try again.",
                )

            return response.text.strip()

        except errors.ServerError:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is temporarily unavailable. Please try again in a moment.",
            )

        except errors.ClientError as error:
            print("Gemini client error:", error)

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service is currently unavailable. Please try again later.",
            )

        except HTTPException:
            raise

        except Exception as error:
            print("Gemini unexpected error:", error)

            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to connect to the AI service. Please try again later.",
            )


gemini_client = GeminiClient()