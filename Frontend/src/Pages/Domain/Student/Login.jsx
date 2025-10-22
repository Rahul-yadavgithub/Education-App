import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import LoginForm from "../../../Components/AuthForms/LoginForm";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const StudentLogin = () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <LoginForm
        domain="Student"
        title="Student Login"
        redirectTo="/student/home"
      />
    </AuthLayOut>
  );
};

export default StudentLogin;
