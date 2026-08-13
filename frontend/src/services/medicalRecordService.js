import api from "./api";

// Get all medical records
export const getMedicalRecords = async () => {
  const response = await api.get("/medical-records");
  return response.data;
};

// Get single medical record
export const getMedicalRecord = async (id) => {
  const response = await api.get(`/medical-records/${id}`);
  return response.data;
};

// Get records for a specific patient
export const getPatientMedicalRecords = async (patientId) => {
  const response = await api.get(
    `/medical-records/patient/${patientId}`
  );
  return response.data;
};

// Create medical record
export const createMedicalRecord = async (data) => {
  const response = await api.post(
    "/medical-records",
    data
  );
  return response.data;
};

// Update medical record
export const updateMedicalRecord = async (id, data) => {
  const response = await api.put(
    `/medical-records/${id}`,
    data
  );
  return response.data;
};

// Delete medical record
export const deleteMedicalRecord = async (id) => {
  const response = await api.delete(
    `/medical-records/${id}`
  );
  return response.data;
};