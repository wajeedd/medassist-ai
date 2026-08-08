import api from "./api";

export const getPatients = async () => {
  const response = await api.get("/patients");
  return response.data;
};

export const getPatient = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const createPatient = async (patient) => {
  const response = await api.post("/patients", patient);
  return response.data;
};

export const updatePatient = async (id, data) => {

  const response = await api.put(
    `/patients/${id}`,
    data
  );

  return response.data;

};


export const deletePatient = async (id) => {
  const response = await api.delete(`/patients/${id}`);
  return response.data;
};