import React from "react";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import SignUpForm from "../../../Components/AuthForms/SignUpForm.jsx";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const StudentSignup = () => {
  useUserAuth();

  return (
    <AuthLayOut>
      <SignUpForm
        domain="Student"
        title="Student Sign Up"
        redirectTo="/student/login"
      />
    </AuthLayOut>
  );
};

export default StudentSignup;
