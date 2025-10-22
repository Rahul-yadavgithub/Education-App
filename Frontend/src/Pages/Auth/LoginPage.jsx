import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import LoginForm from "../../Components/AuthForms/LoginForm";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ import from context

const LoginPage = () => {
  const { user } = useUser(); // ✅ access the current user context
  const { role } = useParams();
  const navigate = useNavigate();

  // If user already logged in, redirect them to their home
  React.useEffect(() => {
    if (user) {
      navigate(`/${role}/home`);
    }
  }, [user, navigate, role]);

  const title = `${role.charAt(0).toUpperCase() + role.slice(1)} Login`;
  const redirectTo = `/${role}/home`;

  return (
    <AuthLayOut>
      <LoginForm
        domain={role.charAt(0).toUpperCase() + role.slice(1)}
        title={title}
        redirectTo={redirectTo}
      />
    </AuthLayOut>
  );
};

export default LoginPage;
