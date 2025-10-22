import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---------- Context ----------
import { UserDataContext } from "./Context/UserContext.jsx";
import ProtectedRoute from "./Components/ProtectRouter/ProtectedRoute.jsx";

// ---------- Generic Role Pages ----------
import LoginPage from "./Pages/Auth/LoginPage.jsx";
import SignUpPage from "./Pages/Auth/SignUpPage.jsx";
import ForgotPasswordPage from "./Pages/Auth/ForgotPassword.jsx";
import ResetPasswordPage from "./Pages/Auth/ResetPassword.jsx";
import VerifyEmailPage from "./Pages/Auth/VerifyEmailPage.jsx";

// ---------- Role Selection ----------
import RoleSelectionLayout from "./Components/LayOuts/RoleSelectionLayout.jsx";

// ---------- Dashboard ----------
import Dashboard from "./Pages/HomePage/DashBoard.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Root route */}
        <Route path="/" element={<Root />} />

        {/* Public routes */}
        <Route path="/:role/login" element={<LoginPage />} />
        <Route path="/:role/signup" element={<SignUpPage />} />
        <Route path="/:role/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/:role/reset-password/:token"
          element={<ResetPasswordPage />}
        />
        <Route path="/:role/verify/:token" element={<VerifyEmailPage />} />

        {/* Protected dashboard */}
        <Route path="/:role/home" element={<ProtectedDashboard />} />

        {/* Role selection */}
        <Route path="/role-selection" element={<RoleSelectionLayout />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global toast notifications */}
      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </Router>
  );
};

export default App;

// ---------- Root Component ----------
const Root = () => {
  const { user, loadingUser } = React.useContext(UserDataContext);

  // Wait until user loading is done before deciding navigation
  if (loadingUser)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/role-selection" replace />;

  const role = user.role?.toLowerCase() || "user";
  return <Navigate to={`/${role}/home`} replace />;
};

// ---------- Protected Dashboard Wrapper ----------
const ProtectedDashboard = () => {
  const { user, loadingUser } = React.useContext(UserDataContext);
  const { role } = useParams();

  // Wait until context finishes loading
  if (loadingUser)
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  if (!user) return <Navigate to="/role-selection" replace />;

  const normalizedUserRole = user.role?.toLowerCase();
  const normalizedRouteRole = role?.toLowerCase();

  // If the URL role doesn't match the logged-in role, redirect correctly
  if (normalizedUserRole !== normalizedRouteRole) {
    return <Navigate to={`/${normalizedUserRole}/home`} replace />;
  }

  return (
    <ProtectedRoute role={user.role}>
      <Dashboard />
    </ProtectedRoute>
  );
};
