import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import ForgotPassword from "../../../Components/AuthForms/ForgotPassword";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const TeacherForgotPassword = () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <ForgotPassword
        title="Teacher Forgot Password"
        redirectTo="/teacher/login"
        domain="Teacher"
      />
    </AuthLayOut>
  );
};

export default TeacherForgotPassword;
