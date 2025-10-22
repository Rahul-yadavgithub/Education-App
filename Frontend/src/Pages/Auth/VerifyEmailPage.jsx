import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import VerifyEmailForm from "../../Components/AuthForms/VerifyEmailForm";
import { useUserAuth } from "../../Hooks/useUserAuth.jsx";

const VerifyEmailPage = () => {
  useUserAuth();
  const { role } = useParams(); // "student", "teacher", etc.

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Email Verification`;
  const redirectTo = `/${role}/login`; // After verification, redirect to login

  return (
    <AuthLayOut>
      <VerifyEmailForm
        domain={formattedRole}
        redirectTo={redirectTo}
         title={title}
      />
    </AuthLayOut>
  );
};

export default VerifyEmailPage;
