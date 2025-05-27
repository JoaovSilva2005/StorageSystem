import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Adiciona o token no header Authorization automaticamente, se tiver
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // pega token do localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
