import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../Context/UserContext";

/**
 * ProtectedRoute Component
 * Wrap pages that require authentication
 */
const ProtectedRoute = ({ children, role }) => {
  const { user } = useUser();

  console.log("user:", user);

  // User is not logged in → redirect to role selection
  if (!user) return <Navigate to="/role-selection" replace />;

  // Role check (if role prop is provided)
  if (role && user.role !== role) return <Navigate to="/role-selection" replace />;

  return children;
};

export default ProtectedRoute;
