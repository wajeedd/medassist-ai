from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.medical_record import MedicalRecord
from app.schemas.dashboard import DashboardStats


class DashboardService:

    @staticmethod
    def get_dashboard_stats(
        db: Session,
    ) -> DashboardStats:

        total_patients = (
            db.query(func.count(Patient.id))
            .scalar()
        )

        total_medical_records = (
            db.query(func.count(MedicalRecord.id))
            .scalar()
        )

        total_ai_analyses = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_summary.isnot(None)
            )
            .count()
        )

        high_risk_cases = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_risk_score >= 70
            )
            .count()
        )

        return DashboardStats(
            total_patients=total_patients,
            total_medical_records=total_medical_records,
            total_ai_analyses=total_ai_analyses,
            high_risk_cases=high_risk_cases,
        )