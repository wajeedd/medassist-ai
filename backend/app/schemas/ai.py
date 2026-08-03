from pydantic import BaseModel


class AIAnalysisResponse(BaseModel):
    summary: str

    risk_score: int
    risk_level: str

    possible_conditions: list[str]

    recommended_tests: list[str]

    recommendations: list[str]

    emergency: bool