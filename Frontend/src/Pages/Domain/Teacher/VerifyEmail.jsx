import React from "react";
import VerifyEmailForm from "../../../Components/AuthForms/VerifyEmailForm";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const TeacherVerifyEmail = () => {
  useUserAuth();

  return (
    <VerifyEmailForm
      title="Teacher Email Verification"
      domain="Teacher"
      redirectTo="/teacher/login"
    />
  );
};

export default TeacherVerifyEmail;
