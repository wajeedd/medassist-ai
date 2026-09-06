import uuid
from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    Date,
    DateTime,
    Enum,
    Float,
    ForeignKey,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database.base import Base
from app.enums.visit_type import VisitType


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    # -------------------------
    # Primary Key
    # -------------------------

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # -------------------------
    # Relationships / Foreign Keys
    # -------------------------

    patient_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("patients.id"),
        nullable=False,
    )

    doctor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

    # -------------------------
    # Visit Information
    # -------------------------

    visit_date: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    visit_type: Mapped[VisitType] = mapped_column(
        Enum(VisitType),
        nullable=False,
    )

    chief_complaint: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    # -------------------------
    # Clinical Information
    # -------------------------

    symptoms: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    diagnosis: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    treatment_plan: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    doctor_notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # -------------------------
    # Vital Signs
    # -------------------------

    temperature: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    blood_pressure: Mapped[Optional[str]] = mapped_column(
        String(20),
        nullable=True,
    )

    heart_rate: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    respiratory_rate: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    oxygen_saturation: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    # -------------------------
    # Prescription
    # -------------------------

    prescription: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    follow_up_date: Mapped[Optional[date]] = mapped_column(
        Date,
        nullable=True,
    )

    # -------------------------
    # AI Fields
    # Reserved for future AI phase
    # -------------------------

    ai_summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    ai_risk_score: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    ai_recommendation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    ai_analyzed_at: Mapped[Optional[datetime]] = mapped_column(
    DateTime(timezone=True),
    nullable=True,
)

    # -------------------------
    # Audit Information
    # -------------------------

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    # -------------------------
    # Relationships
    # -------------------------

    patient = relationship(
        "Patient",
        back_populates="medical_records",
    )

    doctor = relationship(
        "User",
        back_populates="medical_records",
    )