import uuid
from datetime import date, datetime
from typing import Optional, TYPE_CHECKING

from sqlalchemy import Date, DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.enums.gender import Gender
from app.enums.blood_group import BloodGroup

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.medical_record import MedicalRecord


class Patient(Base):
    __tablename__ = "patients"

    # -------------------------
    # Primary Key
    # -------------------------
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # -------------------------
    # Personal Information
    # -------------------------
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)

    last_name: Mapped[str] = mapped_column(String(100), nullable=False)

    date_of_birth: Mapped[date] = mapped_column(
        Date,
        nullable=False,
    )

    gender: Mapped[Gender] = mapped_column(
        Enum(Gender),
        nullable=False,
    )

    blood_group: Mapped[Optional[BloodGroup]] = mapped_column(
        Enum(BloodGroup),
        nullable=True,
    )

    # -------------------------
    # Contact Information
    # -------------------------
    phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    email: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )

    address: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    city: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    state: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    country: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    postal_code: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    # -------------------------
    # Emergency Contact
    # -------------------------
    emergency_contact_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    emergency_contact_relationship: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    emergency_contact_phone: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
    )

    # -------------------------
    # Medical Information
    # -------------------------
    height_cm: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    weight_kg: Mapped[Optional[float]] = mapped_column(
        Float,
        nullable=True,
    )

    allergies: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    medical_conditions: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    current_medications: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # -------------------------
    # Audit Information
    # -------------------------
    created_by: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=False,
    )

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
    doctor: Mapped["User"] = relationship(
        back_populates="patients",
    )

    medical_records: Mapped[list["MedicalRecord"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
    )