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

api.interceptors.response.use(response => response, error => {
  if (error.response && error.response.status === 401) {
    localStorage.removeItem("agent_token");
    localStorage.removeItem("agent_info");
    localStorage.removeItem("token");
    localStorage.removeItem("adminToken");
    // Handle unauthorized access, e.g., redirect to login page
    window.location.href = "/signin";
  }
  return Promise.reject(error);
});

export default api;
