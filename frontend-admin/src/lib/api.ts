import axios from "axios";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL as string | undefined) || "",
});

// Add JWT token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("agent_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
