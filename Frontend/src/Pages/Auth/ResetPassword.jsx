import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import ResetPassword from "../../Components/AuthForms/ResetPassword";
import { useUserAuth } from "../../Hooks/useUserAuth.jsx";

const ResetPasswordPage = () => {
  useUserAuth();
  const { role, token } = useParams(); // role: "student", "teacher", etc.

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `Reset ${formattedRole} Password`;
  const redirectTo = `/${role}/login`; // redirect after password reset

  return (
    <AuthLayOut>
      <ResetPassword
        token={token}
        domain={formattedRole}
        title={title}
        redirectTo={redirectTo}
      />
    </AuthLayOut>
  );
};

export default ResetPasswordPage;
