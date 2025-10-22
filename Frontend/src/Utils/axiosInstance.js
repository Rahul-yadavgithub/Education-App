// frontend/src/Utils/axiosInstance.js
import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 20000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ include cookies for refresh token
});

// ✅ Request interceptor: attach token + log request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    // ✅ Attach bearer token to every request
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[Axios Request] ${config.method?.toUpperCase()} ${config.url}`,
      token ? "→ Auth header attached" : "→ No token found"
    );

    return config;
  },
  (error) => {
    console.error("Request Error:", error.message);
    return Promise.reject(error);
  }
);

// ✅ Response interceptor: handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      console.groupCollapsed(`Axios Error (${status})`);
      console.error("Message:", data?.message || "No message provided");
      console.error("Details:", data);
      console.groupEnd();

      switch (status) {
        case 401:
          console.warn("Unauthorized → Redirecting to role selection...");
          localStorage.removeItem("accessToken");
          window.location.href = "/role-selection";
          break;

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
      console.error("Request Timeout (10s). Please retry.");
    } else {
      console.error("Network Error or Server Down:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
