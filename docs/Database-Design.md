# Database Design

## Purpose

This document describes the initial database design for MedAssist AI. The database is designed to support patient management, AI-assisted clinical decision support, report generation, and future system extensions.

---

# Core Entities

## 1. Users

Stores information about system users.

Fields:
- id
- full_name
- email
- password_hash
- role
- created_at
- updated_at

---

## 2. Patients

Stores patient demographic information.

Fields:
- id
- patient_id
- first_name
- last_name
- date_of_birth
- gender
- phone
- email
- address
- blood_group
- emergency_contact
- created_by
- created_at
- updated_at

---

## 3. Medical History

Stores long-term clinical information.

Fields:
- id
- patient_id
- allergies
- chronic_conditions
- previous_surgeries
- family_history
- current_medications
- notes

---

## 4. Symptom Assessments

Stores information collected during a patient visit.

Fields:
- id
- patient_id
- visit_date
- symptoms
- temperature
- blood_pressure
- heart_rate
- oxygen_level
- weight
- height
- doctor_notes

---

## 5. Predictions

Stores AI-generated predictions.

Fields:
- id
- assessment_id
- predicted_condition
- confidence_score
- risk_level
- explanation
- model_version
- prediction_time

---

## 6. Reports

Stores generated patient reports.

Fields:
- id
- prediction_id
- report_path
- generated_at
- generated_by

---

# Entity Relationships

User
│
└── Patient
      │
      ├── Medical History
      │
      └── Symptom Assessment
              │
              └── Prediction
                      │
                      └── Report