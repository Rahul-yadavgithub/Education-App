import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import SignUpForm from "../../../Components/AuthForms/SignUpForm.jsx";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const TeacherSignup = () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <SignUpForm
        domain="Teacher"
        title="Teacher Sign Up"
        redirectTo="/teacher/login"
      />
    </AuthLayOut>
  );
};

export default TeacherSignup;
