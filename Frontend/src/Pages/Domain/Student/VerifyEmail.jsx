import React from "react";
import VerifyEmailForm from "../../../Components/AuthForms/VerifyEmailForm";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const StudentVerifyEmail = () => {
  useUserAuth();

  return (
    <VerifyEmailForm
      title="Student Email Verification"
      domain="Student"
      redirectTo="/student/login"
    />
  );
};

export default StudentVerifyEmail;
