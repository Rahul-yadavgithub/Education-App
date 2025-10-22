import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import LoginForm from "../../Components/AuthForms/LoginForm";
import { useUserAuth } from "../../Hooks/useUserAuth.jsx";

const LoginPage = () => {
  useUserAuth();
  const { role } = useParams(); // "student", "teacher", etc.
  const navigate = useNavigate();

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
