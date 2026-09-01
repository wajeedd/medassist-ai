from pydantic import BaseModel


# -----------------------------------------
# Longitudinal Patient AI Analysis
# -----------------------------------------

class LongitudinalAIResponse(BaseModel):

    overall_health_trend: str

    risk_evolution: str

    overall_risk_level: str

    average_risk_score: float | None

    key_observations: list[str]

    recurring_conditions: list[str]

    recurring_complaints: list[str]

    important_changes: list[str]

    follow_up_recommendations: list[str]


# -----------------------------------------
# Single Medical Record AI Analysis
# -----------------------------------------

class AIAnalysisResponse(BaseModel):

    summary: str

    risk_score: int | None

    risk_level: str

    possible_conditions: list[str]

    recommended_tests: list[str]

    recommendations: list[str]

    emergency: bool