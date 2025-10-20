// src/pages/domains/student/auth/Login.jsx
import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import AuthForm from "../../../Components/AuthFroms/AuthFrom.jsx";
import { API_PATHS } from "../../../Utils/apiPaths.js";

const StudentLogin = () => (
  <AuthLayOut>
    <AuthForm
      domain="student"
      type="login"
      apiPath={API_PATHS.STUDENT.LOGIN}
      title="Student Login"
      redirectTo="/student/home"
    />
  </AuthLayOut>
);

export default StudentLogin;
