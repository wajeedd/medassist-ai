# Software Requirements Specification (SRS)

# MedAssist AI
### A Multimodal Clinical Decision Support Platform

Version: 1.0

Status: Draft

---

# 1. Introduction

## 1.1 Purpose

The purpose of MedAssist AI is to develop an intelligent, secure, explainable, and scalable Clinical Decision Support Platform that assists healthcare professionals in analyzing patient information from multiple data sources. The platform integrates structured clinical data, patient symptoms, laboratory reports, and medical imaging to provide AI-assisted diagnostic insights, disease risk predictions, and evidence-based clinical recommendations.

The system is intended to support medical professionals in making informed clinical decisions rather than replacing their expertise. It emphasizes transparency, explainability, and responsible AI practices while maintaining patient privacy and data security.

---

## 1.2 Scope

MedAssist AI is designed as a multimodal healthcare platform capable of processing various forms of patient information through an integrated AI pipeline.

The initial version (Mini Project) includes:

- Patient Registration
- Patient History Management
- Symptom Analysis
- Disease Risk Prediction
- Laboratory Report Interpretation
- Explainable AI
- Clinical Recommendation Generation
- Doctor Dashboard
- PDF Report Generation

The extended version (Major Project) will include:

- Medical Image Analysis
- ECG Interpretation
- Electronic Health Record Integration
- Medical LLM Assistant
- Drug Interaction Checking
- Real-Time Patient Monitoring
- Wearable Device Integration
- Predictive Healthcare Analytics

---

## 1.3 Intended Audience

This document is intended for:

- Software Developers
- AI/ML Engineers
- Healthcare Professionals
- UI/UX Designers
- Test Engineers
- Project Supervisors
- Academic Evaluators

---

## 1.4 Definitions

Clinical Decision Support System (CDSS)
: Software that assists healthcare professionals by providing evidence-based recommendations.

Multimodal AI
: Artificial Intelligence capable of processing multiple forms of input such as text, images, laboratory reports, and structured clinical records.

Explainable AI (XAI)
: AI techniques that make model predictions understandable to human users.

Electronic Health Record (EHR)
: A digital version of a patient's medical history.

---

## 1.5 References

- World Health Organization (WHO)
- FastAPI Documentation
- React Documentation
- PostgreSQL Documentation
- Scikit-learn Documentation
- PyTorch Documentation
- SHAP Explainability Documentation

---

## 1.6 Document Overview

This Software Requirements Specification describes the functional and non-functional requirements, system architecture, software components, interfaces, constraints, and future enhancements of MedAssist AI. It serves as the foundational document for the design, implementation, testing, deployment, and maintenance of the system.
---

# 2. Overall Description

## 2.1 Product Perspective

MedAssist AI is a web-based Clinical Decision Support System (CDSS) designed to assist healthcare professionals in analyzing patient data and making informed clinical decisions. The platform combines traditional software engineering with Artificial Intelligence to process multiple healthcare data modalities, including patient demographics, symptoms, laboratory reports, and medical images.

The mini project provides a complete, standalone decision support platform. The major project extends this foundation by adding advanced AI capabilities such as medical image analysis, Electronic Health Record (EHR) integration, wearable device connectivity, and conversational AI, without requiring architectural redesign.

---

## 2.2 Product Functions

The platform provides the following core functions:

- User authentication and role-based access
- Patient registration and profile management
- Medical history management
- Symptom collection
- Disease risk prediction
- Laboratory report analysis
- AI-generated clinical recommendations
- Explainable AI visualizations
- PDF report generation
- Doctor dashboard for patient management

Future extensions include:

- Medical image analysis
- ECG interpretation
- Medical chatbot
- Drug interaction analysis
- Predictive healthcare analytics
- Hospital information system integration

---

## 2.3 User Classes

### Doctor

- Reviews patient records
- Uses AI recommendations
- Downloads clinical reports
- Makes final clinical decisions

### Healthcare Staff

- Registers patients
- Updates patient information
- Uploads laboratory reports

### Administrator

- Manages users
- Monitors system activity
- Configures platform settings

### AI System

- Processes clinical data
- Generates predictions
- Produces explanations
- Calculates confidence scores

---

## 2.4 Operating Environment

Frontend

- React
- TypeScript
- Tailwind CSS

Backend

- FastAPI
- Python

Database

- PostgreSQL

AI Frameworks

- Scikit-learn
- PyTorch
- SHAP

Deployment

- Docker
- Docker Compose

Operating Systems

- Windows (Development)
- Linux (Production)

---

## 2.5 Design Constraints

- Patient privacy must be protected.
- AI recommendations are advisory only.
- The system should remain modular and extensible.
- APIs must follow REST principles.
- Medical data must be validated before processing.
- Large AI models should be independently deployable.

---

## 2.6 Assumptions and Dependencies

Assumptions

- Healthcare professionals verify AI outputs.
- Required datasets are available.
- Internet access is available for the web application.

Dependencies

- Python ecosystem
- FastAPI
- React
- PostgreSQL
- Docker
- GitHub

---

# 3. Functional Requirements

## FR-001: User Authentication

**Module:** Authentication

**Description:**
The system shall allow authorized users to securely log in and access the platform based on their assigned roles.

**Priority:** High

**Acceptance Criteria:**
- Users can log in with valid credentials.
- Invalid credentials are rejected.
- Session is securely maintained.
- User roles determine accessible features.

**Mini Project Scope:**
Doctor and Administrator login.

**Major Project Extension:**
OAuth2, Single Sign-On (SSO), Multi-Factor Authentication (MFA).

---

## FR-002: Patient Registration

**Module:** Patient Management

**Description:**
The system shall allow healthcare staff to register new patients and maintain demographic information.

**Priority:** High

**Acceptance Criteria:**
- Required fields are validated.
- Duplicate records are prevented.
- Patient ID is generated automatically.
- Registration is stored in the database.

**Mini Project Scope:**
Basic patient registration.

**Major Project Extension:**
National Health ID integration.

---

## FR-003: Patient Medical History

**Module:** Patient Management

**Description:**
The system shall allow healthcare professionals to record and view previous medical history.

**Priority:** High

**Acceptance Criteria:**
- Medical history is editable.
- Previous diagnoses are visible.
- Allergies can be recorded.
- Chronic conditions are stored.

---

## FR-004: Symptom Collection

**Module:** Clinical Assessment

**Description:**
The system shall collect patient symptoms through structured forms.

**Priority:** High

**Acceptance Criteria:**
- Symptoms are validated.
- Multiple symptoms can be selected.
- Symptom severity is recorded.

---

## FR-005: Disease Risk Prediction

**Module:** AI Engine

**Description:**
The AI system shall analyze patient information and estimate disease probabilities.

**Priority:** High

**Acceptance Criteria:**
- Prediction confidence is displayed.
- Multiple possible conditions are ranked.
- Processing time remains acceptable.

**Mini Project Scope:**
Machine Learning prediction.

**Major Project Extension:**
Hybrid ML + Large Language Model reasoning.

---

## FR-006: Laboratory Report Analysis

**Module:** AI Engine

**Description:**
The system shall analyze laboratory values and identify abnormal results.

**Priority:** High

**Acceptance Criteria:**
- Normal ranges are displayed.
- Abnormal values are highlighted.
- Clinical interpretation is generated.

---

## FR-007: Explainable AI

**Module:** Explainability

**Description:**
The system shall explain why predictions were generated.

**Priority:** High

**Acceptance Criteria:**
- Feature importance is shown.
- Prediction confidence is visible.
- Explanations are understandable to clinicians.

---

## FR-008: Clinical Recommendation Generation

**Module:** Clinical Decision Support

**Description:**
The system shall generate AI-assisted clinical recommendations based on available patient information.

**Priority:** High

**Acceptance Criteria:**
- Recommendations include confidence.
- Recommendations are clearly labeled as AI-generated.
- Recommendations never replace clinician judgment.

---

## FR-009: PDF Report Generation

**Module:** Reporting

**Description:**
The platform shall generate downloadable patient assessment reports.

**Priority:** Medium

**Acceptance Criteria:**
- Report contains patient details.
- AI findings are included.
- Report includes generation date.
- Report is downloadable as PDF.

---

## FR-010: Doctor Dashboard

**Module:** Dashboard

**Description:**
The system shall provide doctors with a dashboard to review patient information and AI assessments.

**Priority:** High

**Acceptance Criteria:**
- Patient list is searchable.
- Recent assessments are visible.
- Reports are downloadable.