from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr

from app.enums.gender import Gender
from app.enums.blood_group import BloodGroup


# -------------------------
# Create Patient
# -------------------------
class PatientCreate(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date

    gender: Gender
    blood_group: Optional[BloodGroup] = None

    phone: str
    email: Optional[EmailStr] = None

    address: str
    city: str
    state: str
    country: str
    postal_code: str

    emergency_contact_name: str
    emergency_contact_relationship: str
    emergency_contact_phone: str

    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None

    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    current_medications: Optional[str] = None


# -------------------------
# Update Patient
# -------------------------
class PatientUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None

    gender: Optional[Gender] = None
    blood_group: Optional[BloodGroup] = None

    phone: Optional[str] = None
    email: Optional[EmailStr] = None

    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None

    emergency_contact_name: Optional[str] = None
    emergency_contact_relationship: Optional[str] = None
    emergency_contact_phone: Optional[str] = None

    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None

    allergies: Optional[str] = None
    medical_conditions: Optional[str] = None
    current_medications: Optional[str] = None


# -------------------------
# Patient Response
# -------------------------
class PatientResponse(BaseModel):
    id: UUID

    first_name: str
    last_name: str
    date_of_birth: date

    gender: Gender
    blood_group: Optional[BloodGroup]

    phone: str
    email: Optional[EmailStr]

    address: str
    city: str
    state: str
    country: str
    postal_code: str

    emergency_contact_name: str
    emergency_contact_relationship: str
    emergency_contact_phone: str

    height_cm: Optional[float]
    weight_kg: Optional[float]

    allergies: Optional[str]
    medical_conditions: Optional[str]
    current_medications: Optional[str]

    created_by: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)