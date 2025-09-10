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

// Variable to track if we're currently refreshing
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If we're already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Create a new axios instance to avoid interceptor recursion
          const refreshApi = axios.create({
            baseURL: "http://localhost:5000/api/v1",
            headers: { "Content-Type": "application/json" },
          });

          const response = await refreshApi.post("/auth/refresh", { refreshToken });

          if (response.data.token) {
            const newToken = response.data.token;
            const newRefreshToken = response.data.refreshToken;

            // Update tokens in localStorage
            localStorage.setItem("token", newToken);
            localStorage.setItem("refreshToken", newRefreshToken);

            // Update the authorization header
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
            originalRequest.headers.Authorization = `Bearer ${newToken}`;

            processQueue(null, newToken);

            // Retry the original request
            return api(originalRequest);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Refresh failed, remove tokens and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");

          // You can dispatch a logout action here if using Redux
          // window.location.href = '/login';

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token available
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        // window.location.href = '/login';
      }
    }

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
