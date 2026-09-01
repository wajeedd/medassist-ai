import { useEffect, useMemo, useState } from "react";

import MedicalRecordDetailsModal from "../medical-records/MedicalRecordDetailsModal";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Droplets,
  HeartPulse,
  ShieldPlus,
  Pill,
  Ruler,
  Weight,
  Activity,
  AlertTriangle,
  ClipboardList,
  Stethoscope,
  Loader2,
  Thermometer,
  Heart,
  Wind,
  Gauge,
  CalendarDays,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  History,
  ArrowUpRight,
} from "lucide-react";

import AnimatedModal from "../common/AnimatedModal";

import {
  getPatientMedicalRecords,
  getPatientLongitudinalAnalysis,
} from "../../services/medicalRecordService";

// ======================================================
// INFO CARD
// ======================================================

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4 border">
      <div className="flex items-center gap-2 mb-2 text-blue-600">
        {icon}

        <span className="font-semibold">
          {title}
        </span>
      </div>

      <p className="text-slate-700 break-words">
        {value !== null &&
        value !== undefined &&
        String(value).trim() !== ""
          ? value
          : "-"}
      </p>
    </div>
  );
}

// ======================================================
// RISK SCORE NORMALIZER
// ======================================================

function normalizeRiskScore(score) {
  if (
    score === null ||
    score === undefined ||
    score === ""
  ) {
    return null;
  }

  const numericScore = Number(score);

  if (
    !Number.isFinite(numericScore) ||
    numericScore < 0 ||
    numericScore > 100
  ) {
    return null;
  }

  return numericScore;
}

// ======================================================
// RISK STYLE
// ======================================================

function getRiskStyle(score) {
  const numericScore = normalizeRiskScore(score);

  if (numericScore === null) {
    return "bg-gray-100 text-gray-600";
  }

  if (numericScore >= 70) {
    return "bg-red-100 text-red-700";
  }

  if (numericScore >= 40) {
    return "bg-orange-100 text-orange-700";
  }

  return "bg-green-100 text-green-700";
}

// ======================================================
// RISK LABEL
// ======================================================

function getRiskLabel(score) {
  const numericScore = normalizeRiskScore(score);

  if (numericScore === null) {
    return "Insufficient Data";
  }

  if (numericScore >= 70) {
    return "High Risk";
  }

  if (numericScore >= 40) {
    return "Moderate Risk";
  }

  return "Low Risk";
}

// ======================================================
// OVERALL RISK DISPLAY
// ======================================================

function getOverallRiskDisplay(riskLevel) {
  const normalizedLevel =
    typeof riskLevel === "string"
      ? riskLevel.trim().toLowerCase()
      : "";

  switch (normalizedLevel) {
    case "low":
      return {
        bg: "bg-green-50",
        text: "text-green-700",
        icon: "text-green-600",
      };

    case "moderate":
      return {
        bg: "bg-orange-50",
        text: "text-orange-700",
        icon: "text-orange-600",
      };

    case "high":
      return {
        bg: "bg-red-50",
        text: "text-red-700",
        icon: "text-red-600",
      };

    default:
      return {
        bg: "bg-gray-50",
        text: "text-gray-600",
        icon: "text-gray-500",
      };
  }
}

// ======================================================
// HEALTH TREND DISPLAY
// ======================================================

function getTrendDisplay(trend) {
  const normalizedTrend =
    typeof trend === "string"
      ? trend.trim().toLowerCase()
      : "";

  switch (normalizedTrend) {
    case "improving":
      return {
        icon: (
          <TrendingUp
            size={20}
            className="text-green-600"
          />
        ),
        bg: "bg-green-50",
        text: "text-green-700",
      };

    case "worsening":
      return {
        icon: (
          <TrendingDown
            size={20}
            className="text-red-600"
          />
        ),
        bg: "bg-red-50",
        text: "text-red-700",
      };

    case "stable":
      return {
        icon: (
          <Minus
            size={20}
            className="text-blue-600"
          />
        ),
        bg: "bg-blue-50",
        text: "text-blue-700",
      };

    case "mixed":
      return {
        icon: (
          <Activity
            size={20}
            className="text-orange-600"
          />
        ),
        bg: "bg-orange-50",
        text: "text-orange-700",
      };

    default:
      return {
        icon: (
          <Minus
            size={20}
            className="text-gray-500"
          />
        ),
        bg: "bg-gray-50",
        text: "text-gray-600",
      };
  }
}

// ======================================================
// TEXT VALIDATION
// ======================================================

function isMeaningfulText(value) {
  if (
    value === null ||
    value === undefined ||
    typeof value !== "string"
  ) {
    return false;
  }

  const text = value.trim();

  if (!text) {
    return false;
  }

  const invalidValues = [
    "n/a",
    "na",
    "none",
    "null",
    "undefined",
    "unknown",
    "not available",
    "not recorded",
    "test",
    "testing",
    "asdf",
    "qwerty",
    "xxx",
    "placeholder",
  ];

  if (invalidValues.includes(text.toLowerCase())) {
    return false;
  }

  return text.length >= 3;
}

// ======================================================
// CLINICAL RECORD VALIDATION
// ======================================================
//
// Used only for determining which record should be used
// as the "latest clinically usable record" for the health
// overview.
//
// Invalid/corrupted records are NOT removed from the
// Medical History section.
// ======================================================

function isClinicallyUsableRecord(record) {
  if (!record) {
    return false;
  }

  const riskScore = normalizeRiskScore(
    record.ai_risk_score
  );

  if (riskScore !== null) {
    return true;
  }

  const clinicalTextFields = [
    record.chief_complaint,
    record.symptoms,
    record.diagnosis,
    record.treatment_plan,
    record.doctor_notes,
    record.ai_summary,
    record.ai_recommendation,
  ];

  return clinicalTextFields.some(isMeaningfulText);
}

// ======================================================
// HEALTH STAT CARD
// ======================================================

function HealthStatCard({
  icon,
  title,
  value,
  unit,
  description,
  className = "",
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">
          {icon}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-slate-800">
          {value !== null &&
          value !== undefined &&
          value !== ""
            ? value
            : "-"}
        </span>

        {unit && (
          <span className="text-sm text-gray-500">
            {unit}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-gray-500 mt-2">
          {description}
        </p>
      )}
    </div>
  );
}

// ======================================================
// MEDICAL HISTORY CARD
// ======================================================

function MedicalHistoryCard({ record, onView }) {
  const riskScore = normalizeRiskScore(
    record.ai_risk_score
  );

  return (
    <div className="border rounded-2xl p-5 bg-white shadow-sm">

      {/* Visit Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">

            <Stethoscope
              size={20}
              className="text-blue-600"
            />

          </div>

          <div>

            <h4 className="font-bold text-slate-800">

              {record.visit_type
                ? record.visit_type.replaceAll("_", " ")
                : "Medical Visit"}

            </h4>

            <p className="text-sm text-gray-500">

              {record.visit_date
                ? new Date(
                    record.visit_date
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "-"}

            </p>

          </div>

        </div>

        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold w-fit ${getRiskStyle(
            riskScore
          )}`}
        >

          {riskScore !== null
            ? `${riskScore}% Risk`
            : "Risk N/A"}

        </span>

      </div>

      {/* Chief Complaint */}

      <div className="mb-4">

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Chief Complaint
        </p>

        <p className="text-slate-700">
          {record.chief_complaint ||
            "Not recorded"}
        </p>

      </div>

      {/* Diagnosis */}

      <div className="mb-4">

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
          Diagnosis
        </p>

        <p className="text-slate-700">
          {record.diagnosis ||
            "Not recorded"}
        </p>

      </div>

      {/* Symptoms */}

      {record.symptoms && (
        <div className="mb-4">

          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Symptoms
          </p>

          <p className="text-slate-600 text-sm">
            {record.symptoms}
          </p>

        </div>
      )}

      {/* Vitals */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">

        <div className="bg-slate-50 rounded-lg p-3">

          <p className="text-xs text-gray-500">
            Temperature
          </p>

          <p className="font-semibold text-slate-700">

            {record.temperature !== null &&
            record.temperature !== undefined
              ? `${record.temperature} °F`
              : "-"}

          </p>

        </div>

        <div className="bg-slate-50 rounded-lg p-3">

          <p className="text-xs text-gray-500">
            Blood Pressure
          </p>

          <p className="font-semibold text-slate-700">
            {record.blood_pressure || "-"}
          </p>

        </div>

        <div className="bg-slate-50 rounded-lg p-3">

          <p className="text-xs text-gray-500">
            Heart Rate
          </p>

          <p className="font-semibold text-slate-700">

            {record.heart_rate !== null &&
            record.heart_rate !== undefined
              ? `${record.heart_rate} bpm`
              : "-"}

          </p>

        </div>

        <div className="bg-slate-50 rounded-lg p-3">

          <p className="text-xs text-gray-500">
            SpO₂
          </p>

          <p className="font-semibold text-slate-700">

            {record.oxygen_saturation !== null &&
            record.oxygen_saturation !== undefined
              ? `${record.oxygen_saturation}%`
              : "-"}

          </p>

        </div>

      </div>

      {/* AI Summary */}

      {record.ai_summary && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">

          <div className="flex items-center gap-2 mb-2">

            <Activity
              size={18}
              className="text-blue-600"
            />

            <h5 className="font-semibold text-blue-800">
              AI Clinical Summary
            </h5>

          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            {record.ai_summary}
          </p>

        </div>
      )}

      {/* AI Recommendation */}

      {record.ai_recommendation && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">

          <div className="flex items-center gap-2 mb-2">

            <AlertTriangle
              size={18}
              className="text-amber-600"
            />

            <h5 className="font-semibold text-amber-800">
              AI Recommendation
            </h5>

          </div>

          <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
            {record.ai_recommendation}
          </p>

        </div>
      )}

      {/* View Full Record */}

      <div className="flex justify-end mt-5 pt-4 border-t">

        <button
          type="button"
          onClick={() => onView(record)}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-sm"
        >
          View Full Record
        </button>

      </div>

    </div>
  );
}

// ======================================================
// PATIENT DETAILS MODAL
// ======================================================

function PatientDetailsModal({
  patient,
  isOpen,
  onClose,
}) {

  const [medicalRecords, setMedicalRecords] =
    useState([]);

  const [historyLoading, setHistoryLoading] =
    useState(false);

  const [historyError, setHistoryError] =
    useState("");

  const [longitudinalAnalysis, setLongitudinalAnalysis] =
    useState(null);

  const [longitudinalLoading, setLongitudinalLoading] =
    useState(false);

  const [longitudinalError, setLongitudinalError] =
    useState("");

  const [selectedMedicalRecord, setSelectedMedicalRecord] =
    useState(null);

  // ======================================================
  // LOAD MEDICAL HISTORY
  // ======================================================

  useEffect(() => {

    if (!isOpen || !patient?.id) {
      return;
    }

    const loadMedicalHistory = async () => {

      try {

        setHistoryLoading(true);
        setHistoryError("");

        const data =
          await getPatientMedicalRecords(
            patient.id
          );

        const sortedRecords =
          (data || []).sort(
            (a, b) =>
              new Date(b.visit_date) -
              new Date(a.visit_date)
          );

        setMedicalRecords(sortedRecords);

      } catch (error) {

        console.error(
          "Failed to load patient medical history:",
          error
        );

        setHistoryError(
          "Failed to load medical history."
        );

        setMedicalRecords([]);

      } finally {

        setHistoryLoading(false);

      }

    };

    loadMedicalHistory();

  }, [isOpen, patient?.id]);

  // ======================================================
  // LOAD LONGITUDINAL AI ANALYSIS
  // ======================================================

  useEffect(() => {

    if (!isOpen || !patient?.id) {
      return;
    }

    const loadLongitudinalAnalysis = async () => {

      try {

        setLongitudinalLoading(true);
        setLongitudinalError("");
        setLongitudinalAnalysis(null);

        const data =
          await getPatientLongitudinalAnalysis(
            patient.id
          );

        setLongitudinalAnalysis(data);

      } catch (error) {

        console.error(
          "Failed to load longitudinal AI analysis:",
          error
        );

        setLongitudinalError(
          "Failed to generate longitudinal AI insights."
        );

        setLongitudinalAnalysis(null);

      } finally {

        setLongitudinalLoading(false);

      }

    };

    loadLongitudinalAnalysis();

  }, [isOpen, patient?.id]);

  // ======================================================
  // LATEST MEDICAL RECORD
  // ======================================================

  const latestRecord = useMemo(() => {

    if (!medicalRecords.length) {
      return null;
    }

    return medicalRecords[0];

  }, [medicalRecords]);

  // ======================================================
  // LATEST CLINICALLY USABLE RECORD
  // ======================================================
  //
  // This is intentionally different from latestRecord.
  //
  // A patient may have a newer record containing corrupted
  // or uninterpretable clinical documentation.
  //
  // Such a record remains visible in Medical History, but
  // is not blindly presented as the latest reliable clinical
  // assessment.
  // ======================================================

  const latestClinicalRecord = useMemo(() => {

    if (!medicalRecords.length) {
      return null;
    }

    return (
      medicalRecords.find(
        isClinicallyUsableRecord
      ) || null
    );

  }, [medicalRecords]);

  // ======================================================
  // HEALTH STATISTICS
  // ======================================================

  const healthStats = useMemo(() => {

    const totalVisits =
      medicalRecords.length;

    const highRiskVisits =
      medicalRecords.filter((record) => {

        const score =
          normalizeRiskScore(
            record.ai_risk_score
          );

        return (
          score !== null &&
          score >= 70
        );

      }).length;

    const latestRisk =
      latestClinicalRecord
        ? normalizeRiskScore(
            latestClinicalRecord.ai_risk_score
          )
        : null;

    return {
      totalVisits,
      highRiskVisits,
      latestRisk,
      lastVisit:
        latestRecord?.visit_date || null,
      latestClinicalRecord,
    };

  }, [
    medicalRecords,
    latestRecord,
    latestClinicalRecord,
  ]);

  // ======================================================
  // DATE FORMATTER
  // ======================================================

  const formatDate = (date) => {

    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );

  };

  // ======================================================
  // LONGITUDINAL DISPLAY VALUES
  // ======================================================

  const trendDisplay = useMemo(() => {

    return getTrendDisplay(
      longitudinalAnalysis?.overall_health_trend
    );

  }, [longitudinalAnalysis]);

  const riskDisplay = useMemo(() => {

    return getOverallRiskDisplay(
      longitudinalAnalysis?.overall_risk_level
    );

  }, [longitudinalAnalysis]);

  // ======================================================
  // NO PATIENT
  // ======================================================

  if (!patient) {
    return null;
  }

  return (
    <>
      <AnimatedModal
        isOpen={isOpen}
        onClose={onClose}
        title="👤 Patient Details"
        maxWidth="max-w-6xl"
      >

        {/* ================================================== */}
        {/* PATIENT HEADER */}
        {/* ================================================== */}

        <div className="flex items-center gap-5 mb-8">

          <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">

            {patient.first_name?.charAt(0)}
            {patient.last_name?.charAt(0)}

          </div>

          <div>

            <h2 className="text-3xl font-bold text-slate-800">

              {patient.first_name}{" "}
              {patient.last_name}

            </h2>

            <p className="text-gray-500">

              {patient.city}
              {patient.city && patient.state
                ? ", "
                : ""}
              {patient.state}

            </p>

          </div>

        </div>

        {/* ================================================== */}
        {/* PERSONAL INFORMATION */}
        {/* ================================================== */}

        <h3 className="text-xl font-bold mb-4">
          Personal Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

          <InfoCard
            icon={<User size={18} />}
            title="Gender"
            value={patient.gender}
          />

          <InfoCard
            icon={<Droplets size={18} />}
            title="Blood Group"
            value={patient.blood_group}
          />

          <InfoCard
            icon={<Calendar size={18} />}
            title="Date of Birth"
            value={patient.date_of_birth}
          />

          <InfoCard
            icon={<Phone size={18} />}
            title="Phone"
            value={patient.phone}
          />

          <InfoCard
            icon={<Mail size={18} />}
            title="Email"
            value={patient.email}
          />

          <InfoCard
            icon={<MapPin size={18} />}
            title="Address"
            value={`${patient.address || ""}${
              patient.address ? ", " : ""
            }${patient.city || ""}${
              patient.city ? ", " : ""
            }${patient.state || ""}${
              patient.state ? ", " : ""
            }${patient.country || ""}`}
          />

        </div>

        {/* ================================================== */}
        {/* EMERGENCY CONTACT */}
        {/* ================================================== */}

        <h3 className="text-xl font-bold mb-4">
          Emergency Contact
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

          <InfoCard
            icon={<ShieldPlus size={18} />}
            title="Name"
            value={
              patient.emergency_contact_name
            }
          />

          <InfoCard
            icon={<User size={18} />}
            title="Relationship"
            value={
              patient.emergency_contact_relationship
            }
          />

          <InfoCard
            icon={<Phone size={18} />}
            title="Phone"
            value={
              patient.emergency_contact_phone
            }
          />

        </div>

        {/* ================================================== */}
        {/* MEDICAL INFORMATION */}
        {/* ================================================== */}

        <h3 className="text-xl font-bold mb-4">
          Medical Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">

          <InfoCard
            icon={<Ruler size={18} />}
            title="Height"
            value={
              patient.height_cm !== null &&
              patient.height_cm !== undefined &&
              patient.height_cm !== ""
                ? `${patient.height_cm} cm`
                : "-"
            }
          />

          <InfoCard
            icon={<Weight size={18} />}
            title="Weight"
            value={
              patient.weight_kg !== null &&
              patient.weight_kg !== undefined &&
              patient.weight_kg !== ""
                ? `${patient.weight_kg} kg`
                : "-"
            }
          />

          <InfoCard
            icon={<HeartPulse size={18} />}
            title="Allergies"
            value={patient.allergies}
          />

          <InfoCard
            icon={<HeartPulse size={18} />}
            title="Medical Conditions"
            value={
              patient.medical_conditions
            }
          />

          <div className="lg:col-span-2">

            <InfoCard
              icon={<Pill size={18} />}
              title="Current Medications"
              value={
                patient.current_medications
              }
            />

          </div>

        </div>

        {/* ================================================== */}
        {/* PATIENT HEALTH OVERVIEW */}
        {/* ================================================== */}

        <div className="border-t pt-8 mb-10">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">

                  <HeartPulse
                    size={22}
                    className="text-emerald-600"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-800">
                    Patient Health Overview
                  </h3>

                  <p className="text-sm text-gray-500">
                    Latest clinically usable health indicators
                  </p>

                </div>

              </div>

            </div>

            {latestRecord && (
              <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium">
                Last Visit:{" "}
                {formatDate(
                  latestRecord.visit_date
                )}
              </span>
            )}

          </div>

          {historyLoading ? (

            <div className="bg-slate-50 rounded-2xl p-8 flex items-center justify-center">

              <Loader2
                size={28}
                className="text-blue-600 animate-spin"
              />

              <span className="ml-3 text-gray-500">
                Loading health overview...
              </span>

            </div>

          ) : latestClinicalRecord ? (

            <>

              {/* Latest Vital Signs */}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">

                <HealthStatCard
                  icon={
                    <Thermometer
                      size={22}
                      className="text-blue-600"
                    />
                  }
                  title="Temperature"
                  value={
                    latestClinicalRecord.temperature !==
                      null &&
                    latestClinicalRecord.temperature !==
                      undefined
                      ? latestClinicalRecord.temperature
                      : "-"
                  }
                  unit="°F"
                  description="Latest clinically usable temperature"
                />

                <HealthStatCard
                  icon={
                    <Heart
                      size={22}
                      className="text-red-500"
                    />
                  }
                  title="Heart Rate"
                  value={
                    latestClinicalRecord.heart_rate !==
                      null &&
                    latestClinicalRecord.heart_rate !==
                      undefined
                      ? latestClinicalRecord.heart_rate
                      : "-"
                  }
                  unit="bpm"
                  description="Latest clinically usable heart rate"
                />

                <HealthStatCard
                  icon={
                    <Wind
                      size={22}
                      className="text-cyan-600"
                    />
                  }
                  title="Oxygen Saturation"
                  value={
                    latestClinicalRecord.oxygen_saturation !==
                      null &&
                    latestClinicalRecord.oxygen_saturation !==
                      undefined
                      ? latestClinicalRecord.oxygen_saturation
                      : "-"
                  }
                  unit="%"
                  description="Latest SpO₂ reading"
                />

                <HealthStatCard
                  icon={
                    <Gauge
                      size={22}
                      className="text-purple-600"
                    />
                  }
                  title="Blood Pressure"
                  value={
                    latestClinicalRecord.blood_pressure ||
                    "-"
                  }
                  description="Latest clinically usable BP"
                />

              </div>

              {/* Clinical Overview */}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Risk */}

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">

                      <TrendingUp
                        size={22}
                        className="text-red-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Latest AI Risk
                      </p>

                      <p className="text-xl font-bold text-slate-800">

                        {healthStats.latestRisk !==
                        null
                          ? `${healthStats.latestRisk}%`
                          : "N/A"}

                      </p>

                    </div>

                  </div>

                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-semibold ${getRiskStyle(
                      healthStats.latestRisk
                    )}`}
                  >
                    {getRiskLabel(
                      healthStats.latestRisk
                    )}
                  </span>

                </div>

                {/* Total Visits */}

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">

                      <ClipboardList
                        size={22}
                        className="text-blue-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Total Visits
                      </p>

                      <p className="text-xl font-bold text-slate-800">
                        {healthStats.totalVisits}
                      </p>

                    </div>

                  </div>

                  <p className="text-sm text-gray-500">
                    Recorded clinical visits
                  </p>

                </div>

                {/* Last Visit */}

                <div className="rounded-2xl border bg-white p-5 shadow-sm">

                  <div className="flex items-center gap-3 mb-4">

                    <div className="w-11 h-11 rounded-xl bg-green-50 flex items-center justify-center">

                      <CalendarDays
                        size={22}
                        className="text-green-600"
                      />

                    </div>

                    <div>

                      <p className="text-sm text-gray-500">
                        Last Visit
                      </p>

                      <p className="text-xl font-bold text-slate-800">
                        {formatDate(
                          healthStats.lastVisit
                        )}
                      </p>

                    </div>

                  </div>

                  <p className="text-sm text-gray-500">
                    Most recent recorded visit
                  </p>

                </div>

              </div>

              {/* Latest Diagnosis */}

              <div className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-5">

                <div className="flex items-center gap-3 mb-3">

                  <Stethoscope
                    size={20}
                    className="text-blue-600"
                  />

                  <h4 className="font-bold text-blue-800">
                    Latest Clinical Assessment
                  </h4>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Visit Date
                    </p>

                    <p className="text-slate-700">
                      {formatDate(
                        latestClinicalRecord.visit_date
                      )}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Visit Type
                    </p>

                    <p className="text-slate-700">
                      {latestClinicalRecord.visit_type
                        ? latestClinicalRecord.visit_type.replaceAll(
                            "_",
                            " "
                          )
                        : "Medical Visit"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Chief Complaint
                    </p>

                    <p className="text-slate-700">
                      {latestClinicalRecord.chief_complaint ||
                        "Not recorded"}
                    </p>

                  </div>

                  <div>

                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Diagnosis
                    </p>

                    <p className="text-slate-700">
                      {latestClinicalRecord.diagnosis ||
                        "Not recorded"}
                    </p>

                  </div>

                </div>

              </div>

              {/* Data Quality Notice */}

              {latestRecord &&
                latestClinicalRecord &&
                latestRecord.id !==
                  latestClinicalRecord.id && (

                  <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4">

                    <div className="flex items-start gap-3">

                      <AlertTriangle
                        size={20}
                        className="text-amber-600 mt-0.5 flex-shrink-0"
                      />

                      <div>

                        <p className="font-semibold text-amber-800">
                          Latest Visit Requires Data Review
                        </p>

                        <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                          The most recent recorded visit
                          contains insufficient or
                          uninterpretable clinical
                          information for the health
                          overview. The overview above
                          therefore uses the most recent
                          clinically usable record instead.
                          The original visit remains
                          available in Medical History.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

            </>

          ) : (

            <div className="bg-slate-50 rounded-2xl p-8 text-center">

              <HeartPulse
                size={36}
                className="text-gray-400 mx-auto mb-3"
              />

              <h4 className="font-semibold text-slate-700 mb-1">
                No Clinically Usable Health Data
              </h4>

              <p className="text-sm text-gray-500">
                Medical records exist, but there is
                currently insufficient valid clinical
                information to generate the health
                overview.
              </p>

            </div>

          )}

        </div>

        {/* ================================================== */}
        {/* LONGITUDINAL AI INSIGHTS */}
        {/* ================================================== */}

        <div className="border-t pt-8 mb-10">

          {/* Header */}

          <div className="flex items-center gap-3 mb-5">

            <div className="w-11 h-11 rounded-xl bg-purple-100 flex items-center justify-center">

              <Brain
                size={22}
                className="text-purple-600"
              />

            </div>

            <div>

              <h3 className="text-xl font-bold text-slate-800">
                Longitudinal AI Insights
              </h3>

              <p className="text-sm text-gray-500">
                AI-powered analysis of the patient's complete clinical history
              </p>

            </div>

          </div>

          {/* Loading */}

          {longitudinalLoading && (

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-10 flex flex-col items-center justify-center">

              <Loader2
                size={32}
                className="text-purple-600 animate-spin mb-3"
              />

              <p className="text-gray-600 font-medium">
                Gemini is analyzing the patient's medical history...
              </p>

              <p className="text-sm text-gray-500 mt-1">
                This may take a few seconds.
              </p>

            </div>

          )}

          {/* Error */}

          {!longitudinalLoading &&
            longitudinalError && (

              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">

                <AlertTriangle
                  size={28}
                  className="text-red-500 mx-auto mb-2"
                />

                <p className="text-red-700 font-medium">
                  {longitudinalError}
                </p>

                <p className="text-sm text-red-500 mt-1">
                  Please try opening the patient details again.
                </p>

              </div>

            )}

          {/* AI Analysis */}

          {!longitudinalLoading &&
            !longitudinalError &&
            longitudinalAnalysis && (

              <div className="space-y-5">

                {/* ========================================== */}
                {/* OVERALL SUMMARY CARDS */}
                {/* ========================================== */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  {/* Overall Health Trend */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${trendDisplay.bg}`}
                      >
                        {trendDisplay.icon}
                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Overall Health Trend
                        </p>

                        <p
                          className={`font-bold ${trendDisplay.text}`}
                        >
                          {longitudinalAnalysis.overall_health_trend ||
                            "Insufficient Data"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Overall Risk Level */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3 mb-3">

                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${riskDisplay.bg}`}
                      >

                        <AlertTriangle
                          size={20}
                          className={
                            riskDisplay.icon
                          }
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Overall Risk Level
                        </p>

                        <p
                          className={`font-bold ${riskDisplay.text}`}
                        >
                          {longitudinalAnalysis.overall_risk_level ||
                            "Insufficient Data"}
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Average Risk Score */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3 mb-3">

                      <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">

                        <Gauge
                          size={20}
                          className="text-purple-600"
                        />

                      </div>

                      <div>

                        <p className="text-sm text-gray-500">
                          Average Risk Score
                        </p>

                        <p className="font-bold text-slate-800">

                          {typeof longitudinalAnalysis.average_risk_score ===
                            "number" &&
                          Number.isFinite(
                            longitudinalAnalysis.average_risk_score
                          )
                            ? `${longitudinalAnalysis.average_risk_score.toFixed(
                                1
                              )}%`
                            : "Insufficient Data"}

                        </p>

                      </div>

                    </div>

                  </div>

                </div>

                {/* ========================================== */}
                {/* RISK EVOLUTION */}
                {/* ========================================== */}

                <div className="bg-purple-50 border border-purple-100 rounded-2xl p-5">

                  <div className="flex items-center gap-3 mb-3">

                    <Brain
                      size={21}
                      className="text-purple-600"
                    />

                    <h4 className="font-bold text-purple-800">
                      Risk Evolution
                    </h4>

                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {longitudinalAnalysis.risk_evolution ||
                      "No risk evolution information is available because the available clinical data is insufficient."}
                  </p>

                </div>

                {/* ========================================== */}
                {/* KEY OBSERVATIONS */}
                {/* ========================================== */}

                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <History
                      size={21}
                      className="text-blue-600"
                    />

                    <h4 className="font-bold text-blue-800">
                      Key Observations
                    </h4>

                  </div>

                  {Array.isArray(
                    longitudinalAnalysis.key_observations
                  ) &&
                  longitudinalAnalysis.key_observations.length >
                    0 ? (

                    <ul className="space-y-3">

                      {longitudinalAnalysis.key_observations.map(
                        (
                          observation,
                          index
                        ) => (

                          <li
                            key={index}
                            className="flex gap-3 text-sm text-slate-700"
                          >

                            <span className="text-blue-600 font-bold">
                              •
                            </span>

                            <span>
                              {observation}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-sm text-gray-500">
                      No key observations available.
                    </p>

                  )}

                </div>

                {/* ========================================== */}
                {/* RECURRING PATTERNS */}
                {/* ========================================== */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Recurring Conditions */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3 mb-4">

                      <Stethoscope
                        size={21}
                        className="text-blue-600"
                      />

                      <h4 className="font-bold text-slate-800">
                        Recurring Conditions
                      </h4>

                    </div>

                    {Array.isArray(
                      longitudinalAnalysis.recurring_conditions
                    ) &&
                    longitudinalAnalysis.recurring_conditions
                      .length > 0 ? (

                      <div className="flex flex-wrap gap-2">

                        {longitudinalAnalysis.recurring_conditions.map(
                          (
                            condition,
                            index
                          ) => (

                            <span
                              key={`${condition}-${index}`}
                              className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800"
                            >
                              {condition}
                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="text-sm text-gray-500">
                        No recurring conditions identified.
                      </p>

                    )}

                  </div>

                  {/* Recurring Complaints */}

                  <div className="bg-white border rounded-2xl p-5 shadow-sm">

                    <div className="flex items-center gap-3 mb-4">

                      <History
                        size={21}
                        className="text-orange-600"
                      />

                      <h4 className="font-bold text-slate-800">
                        Recurring Complaints
                      </h4>

                    </div>

                    {Array.isArray(
                      longitudinalAnalysis.recurring_complaints
                    ) &&
                    longitudinalAnalysis.recurring_complaints
                      .length > 0 ? (

                      <div className="flex flex-wrap gap-2">

                        {longitudinalAnalysis.recurring_complaints.map(
                          (
                            complaint,
                            index
                          ) => (

                            <span
                              key={`${complaint}-${index}`}
                              className="px-3 py-2 rounded-lg bg-orange-50 border border-orange-100 text-sm text-orange-800"
                            >
                              {complaint}
                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="text-sm text-gray-500">
                        No recurring complaints identified.
                      </p>

                    )}

                  </div>

                </div>

                {/* ========================================== */}
                {/* IMPORTANT CHANGES */}
                {/* ========================================== */}

                <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <ArrowUpRight
                      size={21}
                      className="text-amber-600"
                    />

                    <h4 className="font-bold text-amber-800">
                      Important Changes
                    </h4>

                  </div>

                  {Array.isArray(
                    longitudinalAnalysis.important_changes
                  ) &&
                  longitudinalAnalysis.important_changes
                    .length > 0 ? (

                    <ul className="space-y-3">

                      {longitudinalAnalysis.important_changes.map(
                        (
                          change,
                          index
                        ) => (

                          <li
                            key={index}
                            className="flex gap-3 text-sm text-slate-700"
                          >

                            <span className="text-amber-600 font-bold">
                              •
                            </span>

                            <span>
                              {change}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-sm text-gray-500">
                      No significant changes identified.
                    </p>

                  )}

                </div>

                {/* ========================================== */}
                {/* FOLLOW-UP RECOMMENDATIONS */}
                {/* ========================================== */}

                <div className="bg-green-50 border border-green-100 rounded-2xl p-5">

                  <div className="flex items-center gap-3 mb-4">

                    <ClipboardList
                      size={21}
                      className="text-green-600"
                    />

                    <h4 className="font-bold text-green-800">
                      Follow-up Recommendations
                    </h4>

                  </div>

                  {Array.isArray(
                    longitudinalAnalysis.follow_up_recommendations
                  ) &&
                  longitudinalAnalysis.follow_up_recommendations
                    .length > 0 ? (

                    <ul className="space-y-3">

                      {longitudinalAnalysis.follow_up_recommendations.map(
                        (
                          recommendation,
                          index
                        ) => (

                          <li
                            key={index}
                            className="flex gap-3 text-sm text-slate-700"
                          >

                            <span className="text-green-600 font-bold">
                              •
                            </span>

                            <span>
                              {recommendation}
                            </span>

                          </li>

                        )
                      )}

                    </ul>

                  ) : (

                    <p className="text-sm text-gray-500">
                      No follow-up recommendations available.
                    </p>

                  )}

                </div>

                {/* ========================================== */}
                {/* AI DISCLAIMER */}
                {/* ========================================== */}

                <div className="bg-slate-50 border rounded-xl p-4">

                  <p className="text-xs text-gray-500 leading-relaxed">

                    <strong className="text-slate-700">
                      AI Insight Notice:
                    </strong>{" "}

                    These longitudinal insights are generated
                    by AI from the patient's available clinical
                    records. They are intended to assist
                    healthcare professionals in reviewing
                    patient history and should not replace
                    professional medical judgment.

                  </p>

                </div>

              </div>

            )}

          {/* No analysis */}

          {!longitudinalLoading &&
            !longitudinalError &&
            !longitudinalAnalysis && (

              <div className="bg-slate-50 rounded-2xl p-8 text-center">

                <Brain
                  size={36}
                  className="text-gray-400 mx-auto mb-3"
                />

                <p className="text-sm text-gray-500">
                  No longitudinal analysis is currently available.
                </p>

              </div>

            )}

        </div>

        {/* ================================================== */}
        {/* MEDICAL HISTORY */}
        {/* ================================================== */}

        <div className="border-t pt-8">

          <div className="flex items-center justify-between mb-5">

            <div>

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center">

                  <ClipboardList
                    size={22}
                    className="text-blue-600"
                  />

                </div>

                <div>

                  <h3 className="text-xl font-bold text-slate-800">
                    Medical History
                  </h3>

                  <p className="text-sm text-gray-500">
                    Previous clinical visits and records
                  </p>

                </div>

              </div>

            </div>

            {!historyLoading && (

              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">

                {medicalRecords.length}{" "}

                {medicalRecords.length === 1
                  ? "Visit"
                  : "Visits"}

              </span>

            )}

          </div>

          {/* Loading */}

          {historyLoading && (

            <div className="bg-slate-50 rounded-2xl p-10 flex flex-col items-center justify-center">

              <Loader2
                size={32}
                className="text-blue-600 animate-spin mb-3"
              />

              <p className="text-gray-500">
                Loading medical history...
              </p>

            </div>

          )}

          {/* Error */}

          {!historyLoading &&
            historyError && (

              <div className="bg-red-50 border border-red-100 rounded-2xl p-6 text-center">

                <AlertTriangle
                  size={28}
                  className="text-red-500 mx-auto mb-2"
                />

                <p className="text-red-700 font-medium">
                  {historyError}
                </p>

              </div>

            )}

          {/* Empty */}

          {!historyLoading &&
            !historyError &&
            medicalRecords.length === 0 && (

              <div className="bg-slate-50 rounded-2xl p-10 text-center">

                <ClipboardList
                  size={40}
                  className="text-gray-400 mx-auto mb-3"
                />

                <h4 className="font-semibold text-slate-700 mb-1">
                  No Medical History
                </h4>

                <p className="text-sm text-gray-500">
                  No medical records have been added
                  for this patient yet.
                </p>

              </div>

            )}

          {/* Medical Records Timeline */}

          {!historyLoading &&
            !historyError &&
            medicalRecords.length > 0 && (

              <div className="relative">

                {/* Timeline vertical line */}

                <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-blue-100" />

                <div className="space-y-6">

                  {medicalRecords.map(
                    (record) => (

                      <div
                        key={record.id}
                        className="relative pl-14"
                      >

                        {/* Timeline dot */}

                        <div className="absolute left-2.5 top-5 w-5 h-5 rounded-full bg-blue-600 border-4 border-white shadow z-10" />

                        <MedicalHistoryCard
                          record={record}
                          onView={
                            setSelectedMedicalRecord
                          }
                        />

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

        </div>

      </AnimatedModal>

      {/* ================================================== */}
      {/* FULL MEDICAL RECORD */}
      {/* ================================================== */}

      <MedicalRecordDetailsModal
        record={selectedMedicalRecord}
        patient={patient}
        isOpen={!!selectedMedicalRecord}
        onClose={() =>
          setSelectedMedicalRecord(null)
        }
      />

    </>
  );
}

export default PatientDetailsModal;