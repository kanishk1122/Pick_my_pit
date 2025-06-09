import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Global error handler for API requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const fetchData = async (endpoint, options = {}) => {
  try {
    console.log(`Making request to: ${API_URL}${endpoint}`); // Add logging
    const method = options.method || "GET";
    const data = options.data || null;

    let response;

    if (method === "GET") {
      response = await api.get(endpoint);
    } else if (method === "POST") {
      response = await api.post(endpoint, data);
    } else if (method === "PUT") {
      response = await api.put(endpoint, data);
    } else if (method === "DELETE") {
      response = await api.delete(endpoint);
    }

    return response.data;
  } catch (error) {
    console.error(`Error with endpoint ${endpoint}:`, error);
    throw error;
  }
};

export default api;
