import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

const ProtectedRoute = ({ children, role }) => {
  const { user, loadingUser } = useUser();

  //  Wait until user is loaded
  if (loadingUser) return <div>Loading...</div>;

  //  No user → redirect
  if (!user) return <Navigate to="/role-selection" replace />;

  //  Role check
  if (role && user.role !== role) {
    return <Navigate to="/role-selection" replace />;
  }

  return children;
};

export default ProtectedRoute;
