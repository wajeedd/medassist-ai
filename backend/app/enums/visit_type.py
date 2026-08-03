from enum import Enum


class VisitType(str, Enum):
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow_up"
    EMERGENCY = "emergency"
    TELEMEDICINE = "telemedicine"
    ANNUAL_CHECKUP = "annual_checkup"