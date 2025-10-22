import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import ForgotPassword from "../../Components/AuthForms/ForgotPassword";
import { useUserAuth } from "../../Hooks/useUserAuth.jsx";

const ForgotPasswordPage = () => {
  useUserAuth();
  const { role } = useParams(); // role: "student", "teacher", etc.

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Forgot Password`;
  const redirectTo = `/${role}/login`; // redirect to role-specific login

  return (
    <AuthLayOut>
      <ForgotPassword
        title={title}
        redirectTo={redirectTo}
        domain={formattedRole}
      />
    </AuthLayOut>
  );
};

export default ForgotPasswordPage;
