from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr

from app.enums.user_role import UserRole


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    full_name: str
    email: EmailStr
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime