import axios from "axios";

// Create instance
const api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token dynamically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error for debugging
    console.error("API Error:", error?.response || error?.message || error);

    // Return a properly structured error response
    return Promise.resolve({
      data: error?.response?.data || { message: error?.message || "Unknown error" },
      status: error?.response?.status || 500,
      statusText: error?.response?.statusText || "Error",
    });
  }
);

export default api;
