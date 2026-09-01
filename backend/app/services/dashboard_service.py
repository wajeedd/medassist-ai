from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.patient import Patient
from app.models.medical_record import MedicalRecord

from app.schemas.dashboard import (
    DashboardStats,
    RecentMedicalRecord,
)


class DashboardService:

    @staticmethod
    def get_dashboard_stats(
        db: Session,
    ) -> DashboardStats:

        # ==========================================
        # TOTAL PATIENTS
        # ==========================================

        total_patients = (
            db.query(func.count(Patient.id))
            .scalar()
        ) or 0

        # ==========================================
        # TOTAL MEDICAL RECORDS
        # ==========================================

        total_medical_records = (
            db.query(func.count(MedicalRecord.id))
            .scalar()
        ) or 0

        # ==========================================
        # TOTAL AI ANALYSES
        #
        # An analysis exists when ai_summary is present.
        # This includes both:
        # - Valid risk assessments
        # - Insufficient Data assessments
        # ==========================================

        total_ai_analyses = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_summary.isnot(None)
            )
            .count()
        )

        # ==========================================
        # HIGH RISK
        # ==========================================

        high_risk_cases = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_risk_score.isnot(None),
                MedicalRecord.ai_risk_score >= 70,
            )
            .count()
        )

        # ==========================================
        # MODERATE RISK
        # ==========================================

        moderate_risk_cases = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_risk_score.isnot(None),
                MedicalRecord.ai_risk_score >= 40,
                MedicalRecord.ai_risk_score < 70,
            )
            .count()
        )

        # ==========================================
        # LOW RISK
        # ==========================================

        low_risk_cases = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_risk_score.isnot(None),
                MedicalRecord.ai_risk_score < 40,
            )
            .count()
        )

        # ==========================================
        # INSUFFICIENT DATA
        #
        # AI analysis exists but no valid risk score.
        # ==========================================

        insufficient_data_cases = (
            db.query(MedicalRecord)
            .filter(
                MedicalRecord.ai_summary.isnot(None),
                MedicalRecord.ai_risk_score.is_(None),
            )
            .count()
        )

        # ==========================================
        # RECENT MEDICAL RECORDS
        # ==========================================

        records = (
            db.query(
                MedicalRecord,
                Patient.first_name,
                Patient.last_name,
            )
            .join(
                Patient,
                MedicalRecord.patient_id == Patient.id,
            )
            .order_by(
                MedicalRecord.visit_date.desc()
            )
            .limit(8)
            .all()
        )

        recent_records = []

        for record, first_name, last_name in records:

            # --------------------------------------
            # Determine risk level
            # --------------------------------------

            if record.ai_risk_score is None:

                risk_level = "Insufficient Data"

            elif record.ai_risk_score >= 70:

                risk_level = "High"

            elif record.ai_risk_score >= 40:

                risk_level = "Moderate"

            else:

                risk_level = "Low"

            # --------------------------------------
            # Add recent record
            # --------------------------------------

            recent_records.append(
                RecentMedicalRecord(
                    id=str(record.id),

                    patient_id=str(
                        record.patient_id
                    ),

                    patient_name=(
                        f"{first_name} "
                        f"{last_name}"
                    ),

                    visit_date=record.visit_date,

                    visit_type=record.visit_type,

                    chief_complaint=(
                        record.chief_complaint
                    ),

                    ai_risk_score=(
                        record.ai_risk_score
                    ),

                    ai_risk_level=risk_level,
                )
            )

        # ==========================================
        # RETURN DASHBOARD DATA
        # ==========================================

        return DashboardStats(

            total_patients=total_patients,

            total_medical_records=(
                total_medical_records
            ),

            total_ai_analyses=(
                total_ai_analyses
            ),

            high_risk_cases=(
                high_risk_cases
            ),

            moderate_risk_cases=(
                moderate_risk_cases
            ),

            low_risk_cases=(
                low_risk_cases
            ),

            insufficient_data_cases=(
                insufficient_data_cases
            ),

            recent_records=recent_records,
        )