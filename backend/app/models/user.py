import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func

from app.database.base import Base
from app.enums.user_role import UserRole

if TYPE_CHECKING:
    from app.models.patient import Patient
    from app.models.medical_record import MedicalRecord


class User(Base):
    __tablename__ = "users"

    # -------------------------
    # Primary Key
    # -------------------------
    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
    )

    # -------------------------
    # User Information
    # -------------------------
    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole),
        nullable=False,
        default=UserRole.DOCTOR,
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
    patients: Mapped[list["Patient"]] = relationship(
        back_populates="doctor",
        cascade="all, delete-orphan",
    )

    medical_records: Mapped[list["MedicalRecord"]] = relationship(
        back_populates="doctor",
        cascade="all, delete-orphan",
    )