// frontend/src/Utils/axiosInstance.js
import axios from "axios";
import { BASE_URL, API_PATHS } from "./apiPaths";

/**
 * Axios instance with automatic refresh token handling
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // 20s timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ include cookies for refresh token
});

// -----------------------------
// Request Interceptor
// -----------------------------
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // Attach Bearer token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Axios Request] ${config.method?.toUpperCase()} ${config.url}`,
        token ? "→ Auth header attached" : "→ No token found"
      );
    }
    

    return config;
  },
  (error) =>{
    console.error("Request Error:", error.message);
    Promise.reject(error)
  }
);

// -----------------------------
// Refresh token queue mechanism
// -----------------------------
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

/**
 * Helper function: Request a new access token using refresh token
 */
const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${BASE_URL}${API_PATHS.REFRESH.REFRESH_TOKEN}`, 
      {}, 
      { withCredentials: true }
    );

    const { accessToken } = response.data;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      return accessToken;
    } else {
      throw new Error("No access token returned from refresh");
    }
  } catch (err) {
    console.error("Refresh token failed:", err.message);
    throw err;
  }
};

// -----------------------------
// Response Interceptor
// -----------------------------
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 Unauthorized errors (access token expired)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request if a refresh is already in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const newAccessToken = await refreshAccessToken();

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Resolve queued requests
        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Reject queued requests if refresh fails
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // -----------------------------
    // Handle other errors globally
    // -----------------------------
    if (error.response) {
      const { status, data } = error.response;

      if (process.env.NODE_ENV === "development") {
        console.groupCollapsed(`Axios Error (${status})`);
        console.error("Message:", data?.message || "No message provided");
        console.error("Details:", data);
        console.groupEnd();
      }

      switch (status) {
        case 403:
          console.warn("Forbidden: Access denied for this user.");
          break;
        case 500:
          console.error("Internal Server Error. Try again later.");
          break;
        default:
          console.error(`Unexpected Error: ${status}`);
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request Timeout (20s). Please retry.");
    } else {
      console.error("Network Error or Server Down:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
