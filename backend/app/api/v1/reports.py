from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.report_service import ReportService

router = APIRouter(
    prefix="/reports",
    tags=["Reports"],
)


@router.get("/medical-record/{medical_record_id}")
def generate_medical_report(
    medical_record_id: UUID,
    db: Session = Depends(get_db),
):

    pdf = ReportService.generate_medical_report(
        db=db,
        medical_record_id=medical_record_id,
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f'attachment; filename="medical_report_{medical_record_id}.pdf"'
            )
        },
    )