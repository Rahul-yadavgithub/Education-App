// src/pages/domains/student/auth/ForgotPassword.jsx
import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import AuthForm from "../../../Components/AuthFroms/AuthFrom.jsx";
import { API_PATHS } from "../../../Utils/apiPaths.js";

const StudentForgotPassword = () => (
  <AuthLayOut>
    <AuthForm
      domain="student"
      type="forgotPassword"
      apiPath={API_PATHS.STUDENT.FORGOTPASSWORD}
      title="Forgot Password"
      redirectTo="/student/login" // optional redirect after success message
    />
  </AuthLayOut>
);

export default StudentForgotPassword;
