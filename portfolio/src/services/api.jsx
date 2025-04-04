import axios from "axios";

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: "/api", // Proxy to your backend (configured in vite.config.js)
  headers: {
    "Content-Type": "application/json",
  },
});

// Fetch all projects
export const fetchProjects = async () => {
  const response = await api.get("/projects");
  return response.data;
};

// Fetch a single project by ID
export const fetchProjectById = async (id) => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Fetch all playgrounds
export const fetchPlaygrounds = async () => {
  const response = await api.get("/playgrounds");
  return response.data;
};

// Fetch a single playground by ID
export const fetchPlaygroundById = async (id) => {
  const response = await api.get(`/playgrounds/${id}`);
  return response.data;
};

// Send a message via the contact form
export const sendMessage = async (messageData) => {
  const response = await api.post("/messages", messageData);
  return response.data;
};

export default api;