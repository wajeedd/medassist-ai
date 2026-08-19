from app.models.medical_record import MedicalRecord
from app.models.patient import Patient


# ============================================================
# SINGLE MEDICAL RECORD AI PROMPT
# ============================================================

def build_medical_prompt(
    patient: Patient,
    record: MedicalRecord,
) -> str:

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

RISK SCORING RULES

Evaluate the patient's clinical risk using the available
clinical information.

If sufficient clinical information is available:

- Provide a risk_score between 0 and 100.
- Provide an appropriate risk_level:
  - Low
  - Moderate
  - High

IMPORTANT:

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

RESPONSE REQUIREMENTS

Return ONLY valid JSON.

Do not include markdown.

Do not include explanations outside the JSON.

Return this structure exactly:

{{
    "summary": "",
    "risk_score": null,
    "risk_level": "",
    "possible_conditions": [],
    "recommended_tests": [],
    "recommendations": [],
    "emergency": false
}}
"""


# ============================================================
# LONGITUDINAL MEDICAL HISTORY AI PROMPT
# ============================================================

def build_longitudinal_prompt(
    patient: Patient,
    records: list[MedicalRecord],
) -> str:

    records_text = ""

    for index, record in enumerate(records, start=1):

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

------------------------------------

COMPLETE MEDICAL HISTORY

{records_text}

------------------------------------

ANALYSIS REQUIREMENTS

1. OVERALL HEALTH TREND

Determine the overall health trend using one of:

- Improving
- Stable
- Worsening
- Mixed
- Insufficient Data

Do not consider missing documentation as evidence
of clinical improvement.

------------------------------------

2. RISK EVOLUTION

Explain how the patient's clinical risk changed
across the available clinically assessable visits.

IMPORTANT:

A missing or null AI risk score means that the record
was not sufficiently assessable.

Do NOT interpret a missing/null risk score as zero risk.

Clearly distinguish:

- Actual changes in clinical risk
from
- Missing or insufficient clinical information.

------------------------------------

3. OVERALL RISK LEVEL

Determine the overall risk level using:

- Low
- Moderate
- High
- Insufficient Data

If there is not enough valid clinical information
to determine the overall risk, use:

"Insufficient Data"

------------------------------------

4. AVERAGE RISK SCORE

Calculate the average ONLY from valid, available
AI risk scores.

IMPORTANT:

Do NOT include null, missing, invalid, or unavailable
risk scores in the calculation.

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

Do not interpret missing risk scores as zero risk.

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