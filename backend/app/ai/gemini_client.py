from google import genai
from app.core.config import settings


class GeminiClient:
    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    def generate_content(self, prompt: str) -> str:
        response = self.client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
        )

        return response.text.strip()


gemini_client = GeminiClient()