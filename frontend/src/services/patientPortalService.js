import api from "./api";

export const getMyProfile = async () => {
  const response = await api.get("/patient/me");
  return response.data;
};

export const getMyMedicalRecords = async () => {
  const response = await api.get("/patient/records");
  return response.data;
};