export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
  AUTH: {
    LOGIN: (role) => `/api/auth/${role.toLowerCase()}/login`,
    REGISTER: (role) => `/api/auth/${role.toLowerCase()}/signUp`,
    LOGOUT: (role) => `/api/auth/${role.toLowerCase()}/logout`,
    FORGOTPASSWORD: (role) => `/api/auth/${role.toLowerCase()}/forgot-password`,
    RESETPASSWORD: (role, token) => `/api/auth/${role.toLowerCase()}/reset-password/${token}`,
    VERIFYEMAIL: (role, token) => `/api/auth/${role.toLowerCase()}/verify/${token}`,
  },

  USER: {
    CURRENT_USER: "/api/user/currentUser",
    STUDENT_DASHBOARD: "/api/user/studentDashboard",
    TEACHER_DASHBOARD: "/api/user/teacherDashboard",
    HEAD_COLLEGE: "/api/user/headOfCollegeDashboard",
    HEAD_DISTRICT: "/api/user/headOfDistrictDashboard",
  },

  IMAGE: {
    UPLOAD_IMAGE: (domain) => `/api/image/${domain.toLowerCase()}/upload`,
  },

  DASHBOARD: {
    GET_DATA: "/api/home",
  },
};
