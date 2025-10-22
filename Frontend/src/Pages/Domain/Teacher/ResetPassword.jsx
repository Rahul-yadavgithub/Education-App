import React from "react";
import { useParams } from "react-router-dom";
import AuthLayOut from "../../../Components/LayOuts/AuthLayOut";
import ResetPassword from "../../../Components/AuthForms/ResetPassword";
import { useUserAuth } from "../../../Hooks/useUserAuth.jsx";

const TeacherResetPassword = ({ domain }) => {
  useUserAuth();
  const { token } = useParams();

  return (
    <AuthLayOut>
      <ResetPassword
        token={token}
        domain={domain}
        title="Reset Teacher Password"
        redirectTo="/teacher/login"
      />
    </AuthLayOut>
  );
};

export default TeacherResetPassword;
