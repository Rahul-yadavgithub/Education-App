export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    // First of all we need to define the authentication api 

    AUTH : {
        LOGIN : "/api/auth/login",
        REGISTER : "/api/auth/signUp",
        GET_USER_INFO : "/api/user/currentUser",
        LOGOUT : "/api/auth/logout",
        FORGOTPASSWORD : "/api/auth/forgot-password",
        RESETPASSWORD : (token) => `/api/auth/reset-password/${token}`,
        VERIFYEMAIL : (token) => `/api/auth/verify/${token}`
    },
    IMAGE : {
        UPLOAD_IMAGE : "/api/image/upload"
    },
    DASHBOARD : {
        GET_DATA : "/api/home"
    }
};