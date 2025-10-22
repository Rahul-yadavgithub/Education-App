import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import SignUpForm from "../../Components/AuthForms/SignUpForm.jsx";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ use from context

const SignUpPage = () => {
  const { user } = useUser(); // ✅ access global user
  const { role } = useParams();
  const navigate = useNavigate();

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Sign Up`;
  const redirectTo = `/${role}/login`; // After signup, redirect to login page

  // Optional: if user already exists, redirect them to home
  React.useEffect(() => {
    if (user) {
      navigate(`/${role}/home`);
    }
  }, [user, navigate, role]);

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
