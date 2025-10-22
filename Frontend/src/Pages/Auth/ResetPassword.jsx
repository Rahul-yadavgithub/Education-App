import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import ResetPassword from "../../Components/AuthForms/ResetPassword.jsx";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ use global context

const ResetPasswordPage = () => {
  const { user } = useUser(); // ✅ access user context
  const { role, token } = useParams();
  const navigate = useNavigate();

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `Reset ${formattedRole} Password`;
  const redirectTo = `/${role}/login`;

  // ✅ If user is already logged in, redirect to their home
  React.useEffect(() => {
    if (user) {
      navigate(`/${user.role.toLowerCase()}/home`);
    }
  }, [user, navigate]);

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
