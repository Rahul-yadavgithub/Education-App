import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import ResetPassword from "../../../Components/AuthForms/ResetPassword";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const StudentResetPassword = ({ domain }) => {
  useUserAuth();
  const { token } = useParams();

  return (
    <AuthLayOut>
      <ResetPassword
        token={token}
        domain={domain}
        title="Reset Student Password"
        redirectTo="/student/login"
      />
    </AuthLayOut>
  );
};

export default StudentResetPassword;
