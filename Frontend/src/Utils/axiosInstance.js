import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // ✅ Automatically send cookies
});

// Interceptor for responses
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401) {
        console.error("Unauthorized: redirecting to login...");
        window.location.href = "/login"; // optional: or show modal
      } else if (status === 403) {
        console.error("Forbidden: You don't have access to this resource.");
      } else if (status === 500) {
        console.error("Internal Server Error. Please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout. Please try again later.");
    } else {
      console.error("Network error or server is down:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
