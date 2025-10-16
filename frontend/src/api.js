import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({ baseURL: API_URL });

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

const token = localStorage.getItem("token");
if (token) setAuthToken(token);

export const login = (data) => api.post("/auth/login", data);
export const addAgent = (data) => api.post("/admin/add-agent", data);

export default api;
