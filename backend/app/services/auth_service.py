from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.enums.user_role import UserRole
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest


class AuthService:

    @staticmethod
    def register(db: Session, request: RegisterRequest):
        existing_user = UserRepository.get_by_email(db, request.email)

        if existing_user:
            raise ValueError("Email is already registered.")

        user = User(
            full_name=request.full_name,
            email=request.email,
            hashed_password=hash_password(request.password),
            role=UserRole.DOCTOR,
           
        )

        return UserRepository.create(db, user)

    @staticmethod
    def login(db: Session, request: LoginRequest):
        print("=" * 50)
        print("EMAIL RECEIVED:", request.email)

        user = UserRepository.get_by_email(db, request.email)

        print("USER FOUND:", user)

        if user:
            print("HASH FROM DB:", user.hashed_password)

            result = verify_password(
            request.password,
            user.hashed_password,
        )

        print("PASSWORD VERIFIED:", result)

        if not user:
            raise ValueError("Invalid email or password.")

        if not verify_password(
        request.password,
        user.hashed_password,
    ):
            raise ValueError("Invalid email or password.")

        token = create_access_token(
        {
            "sub": str(user.id),
            "role": user.role.value,
        }
    )

        return {
        "access_token": token,
        "token_type": "bearer",
    }