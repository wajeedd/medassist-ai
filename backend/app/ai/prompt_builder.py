from datetime import date

from app.models.medical_record import MedicalRecord
from app.models.patient import Patient


# ============================================================
# PATIENT AGE HELPER
# ============================================================

def calculate_age(date_of_birth: date) -> int:
    today = date.today()

    age = today.year - date_of_birth.year

    if (today.month, today.day) < (
        date_of_birth.month,
        date_of_birth.day,
    ):
        age -= 1

    return age


# ============================================================
# SINGLE MEDICAL RECORD AI PROMPT
# ============================================================

def build_medical_prompt(
    patient: Patient,
    record: MedicalRecord,
    diabetes_ml_context: dict | None = None,
) -> str:

    patient_age = calculate_age(
        patient.date_of_birth
    )

    # ========================================================
    # DATASET-BASED ML SUPPORT
    # ========================================================

    ml_section = ""

    if diabetes_ml_context is not None:

        ml_section = f"""
------------------------------------

DATASET-BASED ML SUPPORT

A disease-specific machine learning model has analyzed
the available clinical features extracted from this
medical record.

Algorithm:
{diabetes_ml_context.get("model")}

Dataset:
{diabetes_ml_context.get("dataset")}

Diabetes Risk Probability:
{diabetes_ml_context.get("risk_score")}

Dataset Prediction:
{diabetes_ml_context.get("prediction")}

Feature Coverage:
{diabetes_ml_context.get("feature_coverage")}%

Detected Dataset Features:
{diabetes_ml_context.get("detected_features", {})}

IMPORTANT:

This is a dataset-based machine learning screening signal.

It is NOT a confirmed diagnosis.

Do NOT blindly copy the ML prediction into the general
clinical risk score.

Keep the dataset-based diabetes assessment separate
from the general clinical risk assessment.

Use the ML result only as supporting context alongside
the actual clinical information provided in the record.

Do not invent missing clinical features.

------------------------------------
"""

    return f"""
You are an experienced clinical decision support AI.

Analyze the following patient medical record.

Your task is to provide a structured clinical decision-support
analysis based ONLY on the information provided.

Do NOT diagnose the patient autonomously.

PATIENT INFORMATION

Name:
{patient.first_name} {patient.last_name}

Gender:
{patient.gender}

Date of Birth:
{patient.date_of_birth}

Current Age:
{patient_age} years

IMPORTANT:
The Current Age value above has been calculated by the application
from the patient's date of birth. Use this exact age in the response.
Do NOT recalculate or estimate the patient's age.

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

{ml_section}

------------------------------------

RISK SCORING RULES

Evaluate the patient's clinical risk using the available
clinical information.

If sufficient clinical information is available:

- Provide a risk_score between 0 and 100.
- Provide an appropriate risk_level:
  - Low
  - Moderate
  - High

If the medical record contains insufficient, missing,
placeholder, invalid, or uninterpretable clinical information,
DO NOT assign a risk score of 0.

Instead return:

"risk_score": null
"risk_level": "Insufficient Data"

Missing information must NOT be interpreted as a healthy
or zero-risk condition.

Do not invent symptoms, diagnoses, vital signs, test results,
medications, or other clinical findings.

------------------------------------

IMPORTANT RISK SCORING RULES

Assess the patient's clinical risk only when sufficient meaningful
clinical information is available.

Risk score must be between 0 and 100 when the record contains
enough meaningful clinical information for an assessment.

Risk levels:

0-39   = Low
40-69  = Moderate
70-100 = High

If the medical record contains insufficient, missing, corrupted,
uninterpretable, or non-clinical information such that a reliable
risk assessment cannot be performed:

- Set "risk_score" to null.
- Set "risk_level" to "Insufficient Data".
- Do not treat missing information as Low Risk.
- Do not invent clinical findings.
- Explain the documentation/data limitation in the summary.

A risk score of 0 should ONLY be returned when the available
clinical information genuinely supports a minimal clinical risk.

Do NOT use 0 as a placeholder for missing data.

------------------------------------

IMPORTANT DATA QUALITY RULES

Do not invent symptoms, diagnoses, medications, test results,
vital signs, or clinical findings.

If fields contain meaningless or uninterpretable text, treat them
as unavailable clinical information.

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations outside the JSON.

Return this structure exactly:

{{
"summary":"",
"risk_score":null,
"risk_level":"",
"possible_conditions":[],
"recommended_tests":[],
"recommendations":[],
"emergency":false
}}
"""


# ============================================================
# LONGITUDINAL MEDICAL HISTORY AI PROMPT
# ============================================================

def build_longitudinal_prompt(
    patient: Patient,
    records: list[MedicalRecord],
) -> str:

    patient_age = calculate_age(
        patient.date_of_birth
    )

    records_text = ""

    for index, record in enumerate(
        records,
        start=1,
    ):

        records_text += f"""
====================================
MEDICAL RECORD {index}
====================================

Visit Date:
{record.visit_date}

Visit Type:
{record.visit_type}

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

Previous AI Risk Score:
{record.ai_risk_score}

Previous AI Risk Level:
{getattr(record, "ai_risk_level", None)}

Previous AI Summary:
{record.ai_summary}

Previous AI Recommendation:
{record.ai_recommendation}

Dataset-Based Diabetes ML Risk:
{getattr(record, "ml_diabetes_risk_score", None)}

Dataset-Based Diabetes ML Prediction:
{getattr(record, "ml_diabetes_prediction", None)}

Dataset-Based ML Feature Coverage:
{getattr(record, "ml_diabetes_feature_coverage", None)}%

"""

    return f"""
You are an experienced clinical decision support AI.

Analyze the patient's complete longitudinal medical history.

Your task is NOT to diagnose the patient autonomously.

Instead, identify meaningful:

- Clinical patterns
- Changes across visits
- Health trends
- Risk evolution
- Recurring conditions
- Recurring complaints
- Important changes
- Documentation gaps
- Follow-up considerations

Use ONLY the information provided.

Do not invent any clinical information.

------------------------------------

PATIENT INFORMATION

Name:
{patient.first_name} {patient.last_name}

Gender:
{patient.gender}

Date of Birth:
{patient.date_of_birth}

Current Age:
{patient_age} years

IMPORTANT:
The Current Age value above has been calculated by the application
from the patient's date of birth. Use this exact age if age is
mentioned in the analysis. Do NOT recalculate or estimate the
patient's age.

------------------------------------

COMPLETE MEDICAL HISTORY

{records_text}

------------------------------------

DATASET-BASED ML INTERPRETATION

Dataset-based diabetes ML results are supporting
disease-specific signals.

They must NOT automatically be merged with the
general AI clinical risk score.

Consider them as additional context only.

Do not treat a dataset prediction as a confirmed diagnosis.

------------------------------------

ANALYSIS REQUIREMENTS

1. OVERALL HEALTH TREND

Determine the overall health trend using one of:

- Improving
- Stable
- Worsening
- Mixed
- Insufficient Data

Base the trend ONLY on clinically meaningful information
available across the patient's assessable visits.

Do NOT require every medical record to contain complete
clinical information.

If there are multiple clinically assessable visits,
determine the trend from those visits even if later
records contain missing, corrupted, or placeholder data.

Ignore invalid or non-clinical records when determining
the clinical trend, but mention the documentation gaps
separately.

Use "Insufficient Data" ONLY when there is not enough
meaningful clinical information across the available
records to identify any reasonable health trend.

Do not consider missing documentation as evidence of
clinical improvement or worsening.

------------------------------------

2. RISK EVOLUTION

Explain how the patient's clinical risk changed
across the available clinically assessable visits.

A missing or null AI risk score means that the record
was not sufficiently assessable.

Do NOT interpret a missing/null risk score as zero risk.

Clearly distinguish:

- Actual changes in clinical risk
from
- Missing or insufficient clinical information.

------------------------------------

3. OVERALL RISK LEVEL

Determine the overall risk level using the clinically
assessable records and their valid AI risk scores.

If one or more valid AI risk scores are available, use
those valid scores to determine the overall risk level.

Ignore null, missing, corrupted, or unassessable records
when determining the risk level, but mention those
documentation limitations when relevant.

Use:

- Average/overall score 0-39 = Low
- Average/overall score 40-69 = Moderate
- Average/overall score 70-100 = High

If there are NO valid AI risk scores and there is also
insufficient meaningful clinical information to determine
risk, return:

"Insufficient Data"

Never interpret missing risk scores as zero.

------------------------------------

4. AVERAGE RISK SCORE

Calculate the average ONLY from valid, available
AI risk scores.

Do NOT include null, missing, invalid, or unavailable
risk scores.

Do NOT treat missing risk scores as 0.

If there are no valid risk scores, return:

"average_risk_score": null

------------------------------------

5. KEY OBSERVATIONS

Identify important clinical observations across
the patient's medical history.

Include meaningful changes in:

- Symptoms
- Diagnoses
- Vital signs
- Risk scores
- Clinical status

Also mention significant documentation gaps
when relevant.

------------------------------------

6. RECURRING CONDITIONS

Identify diagnoses or clinical conditions that
appear repeatedly in the available records.

Do not invent recurring conditions.

If none are identified, return an empty list.

------------------------------------

7. RECURRING COMPLAINTS

Identify symptoms or chief complaints that
appear repeatedly.

Do not treat unrelated complaints as recurring.

If none are identified, return an empty list.

------------------------------------

8. IMPORTANT CHANGES

Identify meaningful changes across visits, including:

- Vital signs
- Symptoms
- Diagnoses
- Treatment plans
- Risk scores
- Clinical status
- Documentation quality

Clearly distinguish clinical changes from
missing information.

------------------------------------

9. FOLLOW-UP RECOMMENDATIONS

Provide general clinical decision-support recommendations
based ONLY on the supplied medical history.

Recommendations should focus on:

- Appropriate follow-up
- Monitoring
- Completing missing documentation
- Reviewing clinically important changes

Recommendations must be presented as decision support
for review by a qualified healthcare professional.

------------------------------------

IMPORTANT SAFETY REQUIREMENTS

Do not claim certainty where the data is incomplete.

Do not invent:

- Symptoms
- Diagnoses
- Test results
- Medications
- Vital signs
- Clinical findings

Do not provide an autonomous diagnosis.

Do not interpret missing information as normal findings.

Do not interpret missing risk scores as zero.

Use "Insufficient Data" when appropriate.

Recommendations must be presented as clinical
decision support for review by a qualified healthcare professional.

------------------------------------

RETURN FORMAT

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations outside the JSON.

Return this structure exactly:

{{
    "overall_health_trend": "",
    "risk_evolution": "",
    "overall_risk_level": "",
    "average_risk_score": null,
    "key_observations": [],
    "recurring_conditions": [],
    "recurring_complaints": [],
    "important_changes": [],
    "follow_up_recommendations": []
}}
"""