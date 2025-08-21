import axios from "axios";

// Create a reusable Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api", 
  timeout: 10000, // 10s timeout
});

// Add token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

export const apiRequest = async (method, url, payload = {}) => {
  try {
    const config = { method, url };

    // If GET, send params; otherwise send data
    if (method.toLowerCase() === "get") {
      config.params = payload;
    } else {
      config.data = payload;
    }

    const { data } = await api(config);

    // Optional debug log
    if (process.env.NODE_ENV === "development") {
      console.log("API Response:", data);
    }

    return { success: true, data };
  } catch (error) {
    const message = error.response?.data?.message || error.message || "Unknown error";
    
    // Optional debug log
    if (process.env.NODE_ENV === "development") {
      console.error("API Error:", message);
    }

    return { success: false, message };
  }
};
