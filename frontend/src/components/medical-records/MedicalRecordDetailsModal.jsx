import AnimatedModal from "../common/AnimatedModal";

function MedicalRecordDetailsModal({
  record,
  patient,
  isOpen,
  onClose,
}) {
  if (!record) {
    return null;
  }

  const riskScore = record.ai_risk_score;

  const getRiskStyle = (score) => {
    if (score === null || score === undefined) {
      return "bg-gray-100 text-gray-700";
    }

    if (score >= 70) {
      return "bg-red-100 text-red-700";
    }

    if (score >= 40) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-green-100 text-green-700";
  };

  const getRiskLabel = (score) => {
    if (score === null || score === undefined) {
      return "Not Available";
    }

    if (score >= 70) {
      return "High Risk";
    }

    if (score >= 40) {
      return "Moderate Risk";
    }

    return "Low Risk";
  };

  return (
    <AnimatedModal
      isOpen={isOpen}
      onClose={onClose}
      title="Medical Record Details"
    >
      <div className="space-y-6">

        {/* ========================= */}
        {/* Patient Information */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Patient Information
          </h3>

          <div className="bg-slate-50 rounded-xl p-4">
            {patient ? (
              <>
                <p className="font-semibold text-slate-800">
                  {patient.first_name} {patient.last_name}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {patient.phone || "No phone number"}
                </p>

                {patient.email && (
                  <p className="text-sm text-gray-500">
                    {patient.email}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="font-semibold text-slate-800">
                  Patient
                </p>

                <p className="text-xs text-gray-500 mt-1 break-all">
                  {record.patient_id}
                </p>
              </>
            )}
          </div>
        </section>

        {/* ========================= */}
        {/* Visit Information */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Visit Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <InfoItem
              label="Visit Date"
              value={record.visit_date}
            />

            <InfoItem
              label="Visit Type"
              value={record.visit_type}
            />

            <InfoItem
              label="Chief Complaint"
              value={record.chief_complaint}
            />

            <InfoItem
              label="Follow-up Date"
              value={record.follow_up_date || "Not scheduled"}
            />

          </div>
        </section>

        {/* ========================= */}
        {/* Clinical Information */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Clinical Information
          </h3>

          <div className="space-y-4">

            <TextBlock
              label="Symptoms"
              value={record.symptoms}
            />

            <TextBlock
              label="Diagnosis"
              value={record.diagnosis}
            />

            <TextBlock
              label="Treatment Plan"
              value={record.treatment_plan}
            />

            <TextBlock
              label="Doctor Notes"
              value={record.doctor_notes}
            />

          </div>
        </section>

        {/* ========================= */}
        {/* Vital Signs */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Vital Signs
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

            <InfoItem
              label="Temperature"
              value={
                record.temperature !== null &&
                record.temperature !== undefined
                  ? `${record.temperature} °F`
                  : "N/A"
              }
            />

            <InfoItem
              label="Blood Pressure"
              value={record.blood_pressure || "N/A"}
            />

            <InfoItem
              label="Heart Rate"
              value={
                record.heart_rate !== null &&
                record.heart_rate !== undefined
                  ? `${record.heart_rate} bpm`
                  : "N/A"
              }
            />

            <InfoItem
              label="Respiratory Rate"
              value={
                record.respiratory_rate !== null &&
                record.respiratory_rate !== undefined
                  ? `${record.respiratory_rate} /min`
                  : "N/A"
              }
            />

            <InfoItem
              label="Oxygen Saturation"
              value={
                record.oxygen_saturation !== null &&
                record.oxygen_saturation !== undefined
                  ? `${record.oxygen_saturation}%`
                  : "N/A"
              }
            />

          </div>
        </section>

        {/* ========================= */}
        {/* Prescription */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            Prescription
          </h3>

          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-slate-700 whitespace-pre-line">
              {record.prescription || "No prescription recorded."}
            </p>
          </div>
        </section>

        {/* ========================= */}
        {/* AI Analysis */}
        {/* ========================= */}

        <section>
          <h3 className="text-lg font-semibold text-slate-800 mb-3">
            AI Clinical Analysis
          </h3>

          <div className="space-y-4">

            {/* Risk */}

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    AI Risk Score
                  </p>

                  <p className="text-2xl font-bold text-slate-800 mt-1">
                    {riskScore !== null &&
                    riskScore !== undefined
                      ? `${riskScore}%`
                      : "N/A"}
                  </p>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${getRiskStyle(
                    riskScore
                  )}`}
                >
                  {getRiskLabel(riskScore)}
                </span>

              </div>
            </div>

            {/* Summary */}

            <TextBlock
              label="AI Summary"
              value={
                record.ai_summary ||
                "AI summary is not available."
              }
            />

            {/* Recommendations */}

            <TextBlock
              label="AI Recommendations"
              value={
                record.ai_recommendation ||
                "No AI recommendations available."
              }
            />

          </div>
        </section>

        {/* ========================= */}
        {/* Record Information */}
        {/* ========================= */}

        <section className="border-t pt-4">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <InfoItem
              label="Created At"
              value={formatDateTime(record.created_at)}
            />

            <InfoItem
              label="Last Updated"
              value={formatDateTime(record.updated_at)}
            />

          </div>

        </section>

      </div>
    </AnimatedModal>
  );
}

/* ========================= */
/* Helper Components */
/* ========================= */

function InfoItem({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-xl p-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>

      <p className="text-sm font-medium text-slate-800 mt-1 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}

function TextBlock({ label, value }) {
  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-1">
        {label}
      </p>

      <div className="bg-slate-50 rounded-xl p-4">
        <p className="text-sm text-slate-600 whitespace-pre-line">
          {value || "Not available."}
        </p>
      </div>
    </div>
  );
}

function formatDateTime(value) {
  if (!value) {
    return "N/A";
  }

  return new Date(value).toLocaleString();
}

export default MedicalRecordDetailsModal;