// src/pages/domains/student/auth/Signup.jsx
import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import AuthForm from "../../../Components/AuthFroms/AuthFrom.jsx";
import { API_PATHS } from "../../../Utils/apiPaths.js";

const StudentSignup = () => (
  <AuthLayOut>
    <AuthForm
      domain="student"
      type="signup"
      apiPath={API_PATHS.STUDENT.REGISTER}
      title="Student Sign Up"
      redirectTo="/student/home"
    />
  </AuthLayOut>
);

export default StudentSignup;
