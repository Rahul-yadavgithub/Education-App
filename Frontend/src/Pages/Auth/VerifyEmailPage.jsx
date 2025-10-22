import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayOut from "../../Components/LayOuts/AuthLayOut";
import VerifyEmailForm from "../../Components/AuthForms/VerifyEmailForm.jsx";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ use global context

const VerifyEmailPage = () => {
  const { user } = useUser(); // ✅ get user context
  const { role } = useParams();
  const navigate = useNavigate();

  // Capitalize first letter of role
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  const title = `${formattedRole} Email Verification`;
  const redirectTo = `/${role}/login`; // redirect after verification

  // ✅ If user is already verified & logged in, redirect to dashboard
  useEffect(() => {
    if (user && user.isVerified) {
      navigate(`/${user.role.toLowerCase()}/home`);
    }
  }, [user, navigate]);

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
