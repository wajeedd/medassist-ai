import api from "./api";


// =========================================================
// GET ALL MEDICAL RECORDS
// =========================================================

export const getMedicalRecords = async () => {
  const response = await api.get("/medical-records");

  return response.data;
};


// =========================================================
// GET SINGLE MEDICAL RECORD
// =========================================================

export const getMedicalRecord = async (id) => {
  const response = await api.get(
    `/medical-records/${id}`
  );

  return response.data;
};


// =========================================================
// GET RECORDS FOR A SPECIFIC PATIENT
// =========================================================

export const getPatientMedicalRecords = async (
  patientId
) => {
  const response = await api.get(
    `/medical-records/patient/${patientId}`
  );

  return response.data;
};


// =========================================================
// GET AI LONGITUDINAL ANALYSIS
// =========================================================

export const getPatientLongitudinalAnalysis = async (
  patientId
) => {
  const response = await api.get(
    `/medical-records/patient/${patientId}/longitudinal-analysis`
  );

  return response.data;
};


// =========================================================
// CREATE MEDICAL RECORD
// =========================================================

export const createMedicalRecord = async (data) => {
  const response = await api.post(
    "/medical-records",
    data
  );

  return response.data;
};


// =========================================================
// UPDATE MEDICAL RECORD
// =========================================================

export const updateMedicalRecord = async (
  id,
  data
) => {
  const response = await api.put(
    `/medical-records/${id}`,
    data
  );

  return response.data;
};


// =========================================================
// DELETE MEDICAL RECORD
// =========================================================

export const deleteMedicalRecord = async (id) => {
  const response = await api.delete(
    `/medical-records/${id}`
  );

  return response.data;
};


// =========================================================
// ANALYZE SINGLE MEDICAL RECORD WITH AI
// =========================================================

export const analyzeMedicalRecord = async (id) => {
  const response = await api.post(
    `/medical-records/${id}/analyze`
  );

  return response.data;
};