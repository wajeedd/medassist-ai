from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_patients: int
    total_medical_records: int
    total_ai_analyses: int
    high_risk_cases: int