// src/pages/domains/student/auth/ResetPassword.jsx
import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import AuthForm from "../../../Components/AuthFroms/AuthFrom.jsx";
import { API_PATHS } from "../../../Utils/apiPaths.js";

const StudentResetPassword = () => {
  const { token } = useParams(); // token from URL

  return (
    <AuthLayOut>
      <AuthForm
        domain="student"
        type="resetPassword"
        apiPath={API_PATHS.STUDENT.RESETPASSWORD(token)}
        title="Reset Password"
        redirectTo="/student/login"
      />
    </AuthLayOut>
  );
};

export default StudentResetPassword;
