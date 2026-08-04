from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.styles import (
    ParagraphStyle,
    getSampleStyleSheet,
)
from reportlab.lib.units import inch
from reportlab.platypus import (
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


class PDFGenerator:

    @staticmethod
    def _safe(value):
        """
        Convert None values to '-'
        Convert Enum values to readable text
        """

        if value is None:
            return "-"

        text = str(value)

        if "." in text:
            text = text.split(".")[-1]

        text = text.replace("_", " ")

        return text.title()

    @staticmethod
    def _risk_level(score):

        if score is None:
            return "Unknown"

        if score <= 30:
            return "LOW"

        if score <= 70:
            return "MEDIUM"

        return "HIGH"

    @staticmethod
    def generate_medical_report(
        patient,
        medical_record,
    ) -> BytesIO:

        buffer = BytesIO()

        doc = SimpleDocTemplate(
            buffer,
            pagesize=(8.27 * inch, 11.69 * inch),   # A4
            rightMargin=35,
            leftMargin=35,
            topMargin=40,
            bottomMargin=30,
        )

        styles = getSampleStyleSheet()

        # ---------------------------------------------------
        # Custom Styles
        # ---------------------------------------------------

        title_style = ParagraphStyle(
            "TitleStyle",
            parent=styles["Title"],
            alignment=TA_CENTER,
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#0F4C81"),
            spaceAfter=12,
        )

        subtitle_style = ParagraphStyle(
            "SubtitleStyle",
            parent=styles["Heading2"],
            alignment=TA_CENTER,
            fontSize=13,
            textColor=colors.HexColor("#555555"),
            spaceAfter=20,
        )

        section_style = ParagraphStyle(
            "SectionStyle",
            parent=styles["Heading2"],
            fontSize=15,
            leading=20,
            textColor=colors.white,
            backColor=colors.HexColor("#0F4C81"),
            leftIndent=8,
            spaceBefore=10,
            spaceAfter=10,
        )

        normal_style = ParagraphStyle(
            "NormalStyle",
            parent=styles["BodyText"],
            fontSize=10,
            leading=16,
            alignment=TA_LEFT,
        )

        footer_style = ParagraphStyle(
            "FooterStyle",
            parent=styles["Italic"],
            alignment=TA_CENTER,
            textColor=colors.grey,
            fontSize=9,
        )

        story = []

        # ---------------------------------------------------
        # HEADER
        # ---------------------------------------------------

        story.append(
            Paragraph(
                "🏥 <b>MEDASSIST AI</b>",
                title_style,
            )
        )

        story.append(
            Paragraph(
                "AI-Powered Clinical Decision Support System",
                subtitle_style,
            )
        )

        story.append(
            Paragraph(
                "<b>Clinical Medical Report</b>",
                styles["Heading1"],
            )
        )

        story.append(Spacer(1, 18))

        # ---------------------------------------------------
        # Report Information Table
        # ---------------------------------------------------

        report_table = Table(
            [
                [
                    "Report ID",
                    str(medical_record.id)[:8].upper(),
                ],
                [
                    "Generated On",
                    datetime.now().strftime(
                        "%d-%b-%Y %I:%M %p"
                    ),
                ],
            ],
            colWidths=[120, 320],
        )

        report_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#0F4C81")),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
                    ("GRID", (0, 0), (-1, -1), 1, colors.grey),
                    ("BACKGROUND", (1, 0), (1, -1), colors.whitesmoke),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                ]
            )
        )

        story.append(report_table)
        story.append(Spacer(1, 18))
        # ---------------------------------------------------
        # PATIENT INFORMATION
        # ---------------------------------------------------

        story.append(
            Paragraph(
                "PATIENT INFORMATION",
                section_style,
            )
        )

        patient_table = Table(
            [
                [
                    "Patient Name",
                    f"{patient.first_name} {patient.last_name}",
                ],
                [
                    "Gender",
                    PDFGenerator._safe(patient.gender),
                ],
                [
                    "Date of Birth",
                    patient.date_of_birth.strftime("%d-%b-%Y"),
                ],
                [
                    "Blood Group",
                    PDFGenerator._safe(patient.blood_group),
                ],
                [
                    "Phone",
                    patient.phone,
                ],
                [
                    "Email",
                    patient.email,
                ],
                [
                    "Address",
                    patient.address,
                ],
                [
                    "City",
                    patient.city,
                ],
                [
                    "State",
                    patient.state,
                ],
                [
                    "Country",
                    patient.country,
                ],
                [
                    "Postal Code",
                    patient.postal_code,
                ],
            ],
            colWidths=[150, 290],
        )

        patient_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

                    ("BACKGROUND", (0, 0), (0, -1),
                     colors.HexColor("#E8F1FB")),

                    ("FONTNAME", (0, 0), (0, -1),
                     "Helvetica-Bold"),

                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),

                    ("TOPPADDING", (0, 0), (-1, -1), 8),

                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),

                    ("BACKGROUND", (1, 0), (1, -1),
                     colors.white),
                ]
            )
        )

        story.append(patient_table)

        story.append(Spacer(1, 18))

        # ---------------------------------------------------
        # VISIT INFORMATION
        # ---------------------------------------------------

        story.append(
            Paragraph(
                "VISIT INFORMATION",
                section_style,
            )
        )

        visit_table = Table(
            [
                [
                    "Visit Date",
                    medical_record.visit_date.strftime("%d-%b-%Y"),
                ],
                [
                    "Visit Type",
                    PDFGenerator._safe(
                        medical_record.visit_type
                    ),
                ],
                [
                    "Chief Complaint",
                    medical_record.chief_complaint,
                ],
                [
                    "Symptoms",
                    medical_record.symptoms,
                ],
                [
                    "Diagnosis",
                    medical_record.diagnosis,
                ],
                [
                    "Treatment Plan",
                    medical_record.treatment_plan,
                ],
                [
                    "Doctor Notes",
                    medical_record.doctor_notes,
                ],
                [
                    "Prescription",
                    medical_record.prescription,
                ],
            ],
            colWidths=[150, 290],
        )

        visit_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),

                    ("BACKGROUND", (0, 0), (0, -1),
                     colors.HexColor("#E8F1FB")),

                    ("FONTNAME", (0, 0), (0, -1),
                     "Helvetica-Bold"),

                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),

                    ("TOPPADDING", (0, 0), (-1, -1), 8),

                    ("VALIGN", (0, 0), (-1, -1), "TOP"),

                    ("BACKGROUND", (1, 0), (1, -1),
                     colors.white),
                ]
            )
        )

        story.append(visit_table)

        story.append(Spacer(1, 20))
        # ---------------------------------------------------
        # VITAL SIGNS
        # ---------------------------------------------------

        story.append(
            Paragraph(
                "VITAL SIGNS",
                section_style,
            )
        )

        vitals_table = Table(
            [
                ["Temperature", f"{medical_record.temperature} °F"],
                ["Blood Pressure", medical_record.blood_pressure],
                ["Heart Rate", f"{medical_record.heart_rate} bpm"],
                ["Respiratory Rate", f"{medical_record.respiratory_rate} /min"],
                ["Oxygen Saturation", f"{medical_record.oxygen_saturation}%"],
            ],
            colWidths=[180, 260],
        )

        vitals_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#E8F1FB")),
                    ("BACKGROUND", (1, 0), (1, -1), colors.white),
                    ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )

        story.append(vitals_table)

        story.append(Spacer(1, 18))

        # ---------------------------------------------------
        # AI CLINICAL ANALYSIS
        # ---------------------------------------------------

        story.append(
            Paragraph(
                "AI CLINICAL ANALYSIS",
                section_style,
            )
        )

        risk_score = medical_record.ai_risk_score or 0
        risk_level = PDFGenerator._risk_level(risk_score)

        if risk_level == "LOW":
            risk_color = colors.green
        elif risk_level == "MEDIUM":
            risk_color = colors.orange
        else:
            risk_color = colors.red

        story.append(
            Paragraph(
                "<b>Clinical Summary</b>",
                styles["Heading3"],
            )
        )

        story.append(
            Paragraph(
                medical_record.ai_summary or "No AI summary available.",
                normal_style,
            )
        )

        story.append(Spacer(1, 10))

        risk_table = Table(
            [
                ["Risk Score", f"{risk_score} / 100"],
                ["Risk Level", risk_level],
            ],
            colWidths=[180, 260],
        )

        risk_table.setStyle(
            TableStyle(
                [
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                    ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#0F4C81")),
                    ("TEXTCOLOR", (0, 0), (0, -1), colors.white),
                    ("BACKGROUND", (1, 0), (1, 0), colors.white),
                    ("BACKGROUND", (1, 1), (1, 1), risk_color),
                    ("TEXTCOLOR", (1, 1), (1, 1), colors.white),
                    ("FONTNAME", (0, 0), (-1, -1), "Helvetica-Bold"),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                ]
            )
        )

        story.append(risk_table)

        story.append(Spacer(1, 15))

        story.append(
            Paragraph(
                "<b>AI Recommendations</b>",
                styles["Heading3"],
            )
        )

        recommendations = (
            medical_record.ai_recommendation
            or "No recommendations available."
        )

        for recommendation in recommendations.split("\n"):
            recommendation = recommendation.strip()

            if recommendation:
                story.append(
                    Paragraph(
                        f"• {recommendation}",
                        normal_style,
                    )
                )

        story.append(Spacer(1, 20))
        # ---------------------------------------------------
        # FOOTER
        # ---------------------------------------------------

        story.append(
            Spacer(1, 20)
        )

        footer_table = Table(
            [
                [
                    Paragraph(
                        "<b>Generated by MedAssist AI</b>",
                        footer_style,
                    )
                ],
                [
                    Paragraph(
                        "AI-Powered Clinical Decision Support System",
                        footer_style,
                    )
                ],
                [
                    Paragraph(
                        "Powered by Google Gemini",
                        footer_style,
                    )
                ],
                [
                    Paragraph(
                        "<font color='red'><b>CONFIDENTIAL MEDICAL REPORT</b></font>",
                        footer_style,
                    )
                ],
                [
                    Paragraph(
                        datetime.now().strftime(
                            "Generated on %d-%b-%Y at %I:%M %p"
                        ),
                        footer_style,
                    )
                ],
            ],
            colWidths=[440],
        )

        footer_table.setStyle(
            TableStyle(
                [
                    ("LINEABOVE", (0, 0), (-1, 0), 1, colors.grey),
                    ("TOPPADDING", (0, 0), (-1, -1), 8),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                    ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ]
            )
        )

        story.append(footer_table)

        # ---------------------------------------------------
        # BUILD PDF
        # ---------------------------------------------------

        doc.build(story)

        buffer.seek(0)

        return buffer