// frontend/src/api/adminApi.js
import axios from "axios";

const adminApi = axios.create({
  baseURL: "http://localhost:5000/api/admin",
});

// Add token automatically to all requests if it exists
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
