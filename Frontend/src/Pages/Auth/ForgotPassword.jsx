import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import ForgotPassword from "../../Components/AuthForms/ForgotPassword.jsx";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ use centralized context

const ForgotPasswordPage = () => {
  const { user } = useUser();
  const { role } = useParams();
  const navigate = useNavigate();

  // ✅ Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Forgot Password`;
  const redirectTo = `/${role}/login`;

  // ✅ If user already logged in, skip forgot password and redirect
  useEffect(() => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}/home`);
    }
  }, [user, navigate]);

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
