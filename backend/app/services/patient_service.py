from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.enums.user_role import UserRole
from app.models.patient import Patient
from app.models.user import User
from app.repositories.patient_repository import PatientRepository
from app.repositories.user_repository import UserRepository
from app.schemas.patient import PatientCreate, PatientUpdate
from app.schemas.auth import PatientAccountCreate


class PatientService:

    def __init__(self, db: Session):
        self.db = db

    # -------------------------
    # Create Patient
    # -------------------------
    def create_patient(
        self,
        patient_data: PatientCreate,
        created_by: UUID,
    ) -> Patient:

        return PatientRepository.create(
            db=self.db,
            patient_data=patient_data,
            created_by=created_by,
        )

    # -------------------------
    # Get Patient
    # -------------------------
    def get_patient(
        self,
        patient_id: UUID,
        created_by: UUID,
    ) -> Patient:

        patient = PatientRepository.get_by_id(
            db=self.db,
            patient_id=patient_id,
            created_by=created_by,
        )

        if patient is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Patient not found",
            )

        return patient

    # -------------------------
    # Get All Patients
    # -------------------------
    def get_all_patients(
        self,
        created_by: UUID,
    ) -> list[Patient]:

        return PatientRepository.get_all(
            db=self.db,
            created_by=created_by,
        )

    # -------------------------
    # Update Patient
    # -------------------------
    def update_patient(
        self,
        patient_id: UUID,
        patient_data: PatientUpdate,
        created_by: UUID,
    ) -> Patient:

        patient = self.get_patient(
            patient_id=patient_id,
            created_by=created_by,
        )

        return PatientRepository.update(
            db=self.db,
            patient=patient,
            patient_data=patient_data,
        )

    # -------------------------
    # Delete Patient
    # -------------------------
    def delete_patient(
        self,
        patient_id: UUID,
        created_by: UUID,
    ) -> None:

        patient = self.get_patient(
            patient_id=patient_id,
            created_by=created_by,
        )

        PatientRepository.delete(
            db=self.db,
            patient=patient,
        )

    # -------------------------
    # Create Patient Account
    # -------------------------
    def create_patient_account(
        self,
        patient_id: UUID,
        account_data: PatientAccountCreate,
        created_by: UUID,
    ) -> Patient:

        # -------------------------------------------------
        # 1. Verify that the patient belongs to this doctor
        # -------------------------------------------------
        patient = self.get_patient(
            patient_id=patient_id,
            created_by=created_by,
        )

        # -------------------------------------------------
        # 2. Prevent duplicate patient accounts
        # -------------------------------------------------
        if patient.user_id is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This patient already has a login account.",
            )

        # -------------------------------------------------
        # 3. Check whether the email is already registered
        # -------------------------------------------------
        existing_user = UserRepository.get_by_email(
            self.db,
            account_data.email,
        )

        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is already registered.",
            )

        # -------------------------------------------------
        # 4. Create the patient login user
        # -------------------------------------------------
        user = User(
            full_name=f"{patient.first_name} {patient.last_name}",
            email=account_data.email,
            hashed_password=hash_password(account_data.password),
            role=UserRole.PATIENT,
        )

        # -------------------------------------------------
        # 5. Add user to database
        # -------------------------------------------------
        self.db.add(user)
        self.db.flush()

        # -------------------------------------------------
        # 6. Link patient profile to patient login
        # -------------------------------------------------
        patient.user_id = user.id

        # -------------------------------------------------
        # 7. Commit both changes
        # -------------------------------------------------
        self.db.commit()
        self.db.refresh(patient)

        return patient