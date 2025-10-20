export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  // -------- Authentication Routes --------
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/signUp",
    GET_USER_INFO: "/api/user/currentUser",
    LOGOUT: "/api/auth/logout",
    FORGOTPASSWORD: "/api/auth/forgot-password",
    RESETPASSWORD: (token) => `/api/auth/reset-password/${token}`,
    VERIFYEMAIL: (token) => `/api/auth/verify/${token}`,
  },

  // -------- Student Routes --------
  STUDENT: {
    LOGIN: "/api/student/login",
    REGISTER: "/api/student/signup",
    GET_PROFILE: "/api/student/profile",
  },

  // -------- Image Routes --------
  IMAGE: {
    UPLOAD_IMAGE: "/api/image/upload",
  },

  // -------- Dashboard Routes --------
  DASHBOARD: {
    GET_DATA: "/api/home",
  },
};
