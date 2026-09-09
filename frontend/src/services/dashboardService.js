import api from "./api";


export const getDashboardStats = async () => {

  const response = await api.get("/dashboard/stats");

  return response.data;

};


export const getDiabetesModelMetrics = async () => {

  const response = await api.get("/dashboard/ml-metrics");

  return response.data;

};