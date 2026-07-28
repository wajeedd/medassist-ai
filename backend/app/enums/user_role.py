from enum import Enum


class UserRole(str, Enum):
    ADMIN = "admin"
    DOCTOR = "doctor"
    LAB_TECHNICIAN = "lab_technician"