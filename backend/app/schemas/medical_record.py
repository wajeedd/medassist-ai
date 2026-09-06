from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.enums.visit_type import VisitType


# -------------------------
# Create Medical Record
# -------------------------
class MedicalRecordCreate(BaseModel):

    patient_id: UUID

    visit_date: date
    visit_type: VisitType

    chief_complaint: str

    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    doctor_notes: Optional[str] = None

    temperature: Optional[float] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None

    prescription: Optional[str] = None
    follow_up_date: Optional[date] = None


# -------------------------
# Update Medical Record
# -------------------------
class MedicalRecordUpdate(BaseModel):

    visit_date: Optional[date] = None
    visit_type: Optional[VisitType] = None

    chief_complaint: Optional[str] = None

    symptoms: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None
    doctor_notes: Optional[str] = None

    temperature: Optional[float] = None
    blood_pressure: Optional[str] = None
    heart_rate: Optional[int] = None
    respiratory_rate: Optional[int] = None
    oxygen_saturation: Optional[float] = None

    prescription: Optional[str] = None
    follow_up_date: Optional[date] = None


# -------------------------
# Medical Record Response
# -------------------------
class MedicalRecordResponse(BaseModel):

    id: UUID

    patient_id: UUID
    doctor_id: UUID

    visit_date: date
    visit_type: VisitType

    chief_complaint: str

    symptoms: Optional[str]
    diagnosis: Optional[str]
    treatment_plan: Optional[str]
    doctor_notes: Optional[str]

    temperature: Optional[float]
    blood_pressure: Optional[str]
    heart_rate: Optional[int]
    respiratory_rate: Optional[int]
    oxygen_saturation: Optional[float]

    prescription: Optional[str]
    follow_up_date: Optional[date]

    # AI fields
    ai_summary: Optional[str]
    ai_risk_score: Optional[float]
    ai_recommendation: Optional[str]
    ai_analyzed_at: Optional[datetime]

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)