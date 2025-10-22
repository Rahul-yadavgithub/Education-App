import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import LoginForm from "../../../Components/AuthForms/LoginForm";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const TeacherLogin= () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <LoginForm
        domain="Teacher"
        title="Teacher Login"
        redirectTo="/teacher/home"
      />
    </AuthLayOut>
  );
};

export default TeacherLogin;
