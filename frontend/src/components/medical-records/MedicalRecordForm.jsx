function MedicalRecordForm({
  formData,
  handleChange,
  handleSubmit,
  loading,
  submitText = "Save Record",
  patients = [],
}) {
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ========================= */}
      {/* Patient & Visit Information */}
      {/* ========================= */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Patient & Visit Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Patient */}

<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Patient *
  </label>

  <select
    name="patient_id"
    value={formData.patient_id}
    onChange={handleChange}
    required
    className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="">
      Select patient
    </option>

    {patients.map((patient) => (
      <option
        key={patient.id}
        value={patient.id}
      >
        {patient.first_name} {patient.last_name}
        {patient.phone ? ` - ${patient.phone}` : ""}
      </option>
    ))}
  </select>
</div>

          

          {/* Visit Date */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visit Date *
            </label>

            <input
              type="date"
              name="visit_date"
              value={formData.visit_date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Visit Type */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visit Type *
            </label>

            <select
              name="visit_type"
              value={formData.visit_type}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">
                Select visit type
              </option>

              <option value="consultation">
                Consultation
              </option>

              <option value="follow_up">
                Follow Up
              </option>

              <option value="emergency">
                Emergency
              </option>

              <option value="telemedicine">
                Telemedicine
              </option>

              <option value="annual_checkup">
                Annual Checkup
              </option>
            </select>
          </div>

          {/* Chief Complaint */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chief Complaint *
            </label>

            <input
              type="text"
              name="chief_complaint"
              value={formData.chief_complaint}
              onChange={handleChange}
              required
              placeholder="e.g. High fever and cough"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>


      {/* ========================= */}
      {/* Clinical Information */}
      {/* ========================= */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Clinical Information
        </h3>

        <div className="space-y-4">

          {/* Symptoms */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Symptoms
            </label>

            <textarea
              name="symptoms"
              value={formData.symptoms}
              onChange={handleChange}
              rows="3"
              placeholder="Describe patient symptoms..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Diagnosis */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>

            <textarea
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows="3"
              placeholder="Enter diagnosis..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Treatment Plan */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Treatment Plan
            </label>

            <textarea
              name="treatment_plan"
              value={formData.treatment_plan}
              onChange={handleChange}
              rows="3"
              placeholder="Enter treatment plan..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Doctor Notes */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor Notes
            </label>

            <textarea
              name="doctor_notes"
              value={formData.doctor_notes}
              onChange={handleChange}
              rows="3"
              placeholder="Enter clinical notes..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>


      {/* ========================= */}
      {/* Vital Signs */}
      {/* ========================= */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Vital Signs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

          {/* Temperature */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Temperature
            </label>

            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleChange}
              placeholder="e.g. 98.6"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Blood Pressure */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Blood Pressure
            </label>

            <input
              type="text"
              name="blood_pressure"
              value={formData.blood_pressure}
              onChange={handleChange}
              placeholder="e.g. 120/80"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Heart Rate */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heart Rate
            </label>

            <input
              type="number"
              name="heart_rate"
              value={formData.heart_rate}
              onChange={handleChange}
              placeholder="e.g. 72"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Respiratory Rate */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Respiratory Rate
            </label>

            <input
              type="number"
              name="respiratory_rate"
              value={formData.respiratory_rate}
              onChange={handleChange}
              placeholder="e.g. 16"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Oxygen Saturation */}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Oxygen Saturation
            </label>

            <input
              type="number"
              step="0.1"
              name="oxygen_saturation"
              value={formData.oxygen_saturation}
              onChange={handleChange}
              placeholder="e.g. 98"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>
      </div>


      {/* ========================= */}
      {/* Prescription & Follow-up */}
      {/* ========================= */}

      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">
          Prescription & Follow-up
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Prescription */}

          <div className="md:col-span-2">

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prescription
            </label>

            <textarea
              name="prescription"
              value={formData.prescription}
              onChange={handleChange}
              rows="3"
              placeholder="Enter prescription..."
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* Follow Up Date */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Follow-up Date
            </label>

            <input
              type="date"
              name="follow_up_date"
              value={formData.follow_up_date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>
      </div>


      {/* ========================= */}
      {/* Submit */}
      {/* ========================= */}

      <div className="flex justify-end pt-4 border-t">

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          {loading ? "Saving..." : submitText}
        </button>

      </div>

    </form>
  );
}

export default MedicalRecordForm;