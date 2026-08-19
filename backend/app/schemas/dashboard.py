from datetime import date
from pydantic import BaseModel


class RecentMedicalRecord(BaseModel):

    id: str
    patient_id: str

    patient_name: str

    visit_date: date

    visit_type: str

    chief_complaint: str | None = None

    ai_risk_score: float | None = None

    ai_risk_level: str | None = None


class DashboardStats(BaseModel):

    total_patients: int

    total_medical_records: int

    total_ai_analyses: int

    high_risk_cases: int

    moderate_risk_cases: int

    low_risk_cases: int

    insufficient_data_cases: int

    recent_records: list[RecentMedicalRecord]