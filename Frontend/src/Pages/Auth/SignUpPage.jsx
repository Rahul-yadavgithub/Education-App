import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import SignUpForm from "../../Components/AuthForms/SignUpForm.jsx";
import { useUserAuth } from "../../Hooks/useUserAuth.jsx";

const SignUpPage = () => {
  useUserAuth();
  const { role } = useParams(); // "student", "teacher", etc.

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Sign Up`;
  const redirectTo = `/${role}/login`; // After signup, redirect to login of that role

  return (
    <AuthLayOut>
      <SignUpForm
        domain={formattedRole}
        title={title}
        redirectTo={redirectTo}
      />
    </AuthLayOut>
  );
};

export default SignUpPage;
