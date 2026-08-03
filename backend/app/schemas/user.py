from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr

from app.enums.user_role import UserRole


class UserResponse(BaseModel):
    id: UUID
    full_name: str
    email: EmailStr
    role: UserRole
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True