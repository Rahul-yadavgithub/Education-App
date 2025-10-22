import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import ForgotPassword from "../../../Components/AuthForms/ForgotPassword";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const StudentForgotPassword = () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <ForgotPassword
        title="Student Forgot Password"
        redirectTo="/student/login"
        domain="Student"
      />
    </AuthLayOut>
  );
};

export default StudentForgotPassword;
