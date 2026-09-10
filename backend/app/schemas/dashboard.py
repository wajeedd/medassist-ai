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


class DiabetesModelMetrics(BaseModel):

    algorithm: str

    dataset: str

    accuracy: float

    precision: float

    recall: float

    f1_score: float

    roc_auc: float

    cv_f1_mean: float

    cv_f1_std: float

    feature_importance: dict[str, float]

    confusion_matrix: list[list[int]]