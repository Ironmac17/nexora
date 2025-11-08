// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api/nex",
  headers: { "Content-Type": "application/json" },
});

// Automatically attach token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("nexoraToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("Unauthorized. Logging out...");
      localStorage.removeItem("nexoraToken");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
