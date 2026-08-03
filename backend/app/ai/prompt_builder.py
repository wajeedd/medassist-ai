from app.models.medical_record import MedicalRecord
from app.models.patient import Patient


def build_medical_prompt(
    patient: Patient,
    record: MedicalRecord,
) -> str:

    return f"""
You are an experienced clinical decision support AI.

Analyze the following patient.

PATIENT INFORMATION

Name:
{patient.first_name} {patient.last_name}

Gender:
{patient.gender}

Date of Birth:
{patient.date_of_birth}

------------------------------------

VISIT INFORMATION

Chief Complaint:
{record.chief_complaint}

Symptoms:
{record.symptoms}

Diagnosis:
{record.diagnosis}

Treatment Plan:
{record.treatment_plan}

Doctor Notes:
{record.doctor_notes}

------------------------------------

VITAL SIGNS

Temperature:
{record.temperature}

Blood Pressure:
{record.blood_pressure}

Heart Rate:
{record.heart_rate}

Respiratory Rate:
{record.respiratory_rate}

Oxygen Saturation:
{record.oxygen_saturation}

------------------------------------

Return ONLY valid JSON.

Do not include markdown.

Return this structure exactly:

{{
"summary":"",
"risk_score":0,
"risk_level":"",
"possible_conditions":[],
"recommended_tests":[],
"recommendations":[],
"emergency":false
}}
"""