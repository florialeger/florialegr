import axios from 'axios';

// Allow overriding the API base URL via Vite env (VITE_API_BASE_URL).
// If not provided, fall back to "/api" so local development and Firebase Hosting rewrites continue to work.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// When building/running the frontend in static-only mode, set VITE_USE_BACKEND=false
// (default). If false, we avoid making network requests and read from `data.json`.
const USE_BACKEND = import.meta.env.VITE_USE_BACKEND === 'true';

// Create an Axios instance with default configuration
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch all projects
export const fetchProjects = async () => {
  if (!USE_BACKEND) {
    try {
      const dataModule = await import('../../data.json');
      return dataModule.projects || dataModule.default?.projects || [];
    } catch {
      return [];
    }
  }
  try {
    const response = await api.get('/projects');
    // Support both direct array responses and wrapped responses { projects: [...] }
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.projects)) return response.data.projects;
    return [];
  } catch (err) {
    // If backend is not available, fall back to the local `data.json` file
    try {
      // dynamic import so bundlers can tree-shake when not used
      // path: project root `data.json`
      const dataModule = await import('../../data.json');
      return dataModule.projects || dataModule.default?.projects || [];
    } catch {
      throw err; // rethrow original error if fallback also fails
    }
  }
};

// Fetch a single project by ID
export const fetchProjectById = async (id) => {
  if (!USE_BACKEND) {
    try {
      const dataModule = await import('../../data.json');
      const projects = dataModule.projects || dataModule.default?.projects || [];
      return projects.find((p) => p.slug === id || p.id === id) || null;
    } catch {
      return null;
    }
  }
  try {
    const response = await api.get(`/projects/${id}`);
    // If the backend returns the project directly
    return response.data || null;
  } catch {
    try {
      const dataModule = await import('../../data.json');
      const projects = dataModule.projects || dataModule.default?.projects || [];
      return projects.find((p) => p.slug === id || p.id === id) || null;
    } catch {
      return null;
    }
  }
};

// Fetch all playgrounds
export const fetchPlaygrounds = async () => {
  if (!USE_BACKEND) {
    try {
      const dataModule = await import('../../data.json');
      return dataModule.playgrounds || dataModule.default?.playgrounds || [];
    } catch {
      return [];
    }
  }
  try {
    const response = await api.get('/playgrounds');
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.playgrounds)) return response.data.playgrounds;
    return [];
  } catch {
    try {
      const dataModule = await import('../../data.json');
      return dataModule.playgrounds || dataModule.default?.playgrounds || [];
    } catch {
      return [];
    }
  }
};

// Fetch all work experiences
export const fetchWork = async () => {
  if (!USE_BACKEND) {
    try {
      const dataModule = await import('../../data.json');
      return dataModule.work || dataModule.default?.work || [];
    } catch {
      return [];
    }
  }
  try {
    const response = await api.get('/work');
    if (Array.isArray(response.data)) return response.data;
    if (response.data && Array.isArray(response.data.work)) return response.data.work;
    return [];
  } catch {
    try {
      const dataModule = await import('../../data.json');
      return dataModule.work || dataModule.default?.work || [];
    } catch {
      return [];
    }
  }
};

// Fetch a single playground by ID
export const fetchPlaygroundById = async (id) => {
  if (!USE_BACKEND) {
    try {
      const dataModule = await import('../../data.json');
      const playgrounds = dataModule.playgrounds || dataModule.default?.playgrounds || [];
      return playgrounds.find((p) => p.slug === id || p.id === id) || null;
    } catch {
      return null;
    }
  }
  try {
    const response = await api.get(`/playgrounds/${id}`);
    return response.data;
  } catch {
    try {
      const dataModule = await import('../../data.json');
      const playgrounds = dataModule.playgrounds || dataModule.default?.playgrounds || [];
      return playgrounds.find((p) => p.slug === id || p.id === id) || null;
    } catch {
      return null;
    }
  }
};

// Send a message via the contact form
export const sendMessage = async (messageData) => {
  const response = await api.post('/messages', messageData);
  return response.data;
};

export default api;
