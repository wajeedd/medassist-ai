import axios from "axios";
import { toast } from "react-toastify";
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  (error) => {

    if (error.response?.status === 401) {

  localStorage.removeItem("access_token");

  toast.warning(
    "Session expired. Please login again."
  );

  setTimeout(() => {
    window.location.href = "/login";
  }, 1500);
}

    return Promise.reject(error);
  }
);

export default api;