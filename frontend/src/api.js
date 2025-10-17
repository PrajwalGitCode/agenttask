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
export const getAgents = () => api.get("/admin/agents");
export const updateAgent = (id, data) => api.put(`/admin/agents/${id}`, data);
export const deleteAgent = (id) => api.delete(`/admin/agents/${id}`);
export const getMySheet = () => api.get("/sheets/mysheet");
export const uploadSheet = (formData) =>
  api.post("/sheets/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
// Get all agents
export const getAllAgents = async (token) => {
  const res = await axios.get(`${API_URL}/all`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const getAllSheets = async (token) => {
  const res = await axios.get(`${API_URL}/sheets/allsheet`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export default api;
