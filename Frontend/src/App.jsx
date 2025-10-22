import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---------- Context ----------
import UserProvider, { UserDataContext } from "./Context/UserContext.jsx";
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
    <UserProvider>
      <Router>
        <Routes>
          {/* Root route */}
          <Route path="/" element={<Root />} />

          {/* Public routes */}
          <Route path="/:role/login" element={<LoginPage />} />
          <Route path="/:role/signup" element={<SignUpPage />} />
          <Route path="/:role/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/:role/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/:role/verify/:token" element={<VerifyEmailPage />} />

          {/* Protected dashboard */}
          <Route path="/:role/home" element={<ProtectedDashboard />} />

          {/* Role selection */}
          <Route path="/role-selection" element={<RoleSelectionLayout />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster toastOptions={{ className: "", style: { fontSize: "13px" } }} />
    </UserProvider>
  );
};

export default App;

// ---------- Root component ----------
const Root = () => {
  const { user } = React.useContext(UserDataContext);

  if (!user) return <Navigate to="/role-selection" replace />;

  const role = user.role.toLowerCase();
  return <Navigate to={`/${role}/home`} replace />;
};

// ---------- Protected dashboard wrapper ----------
const ProtectedDashboard = () => {
  const { user } = React.useContext(UserDataContext);
  const { role } = useParams(); // ✅ get role from URL

  if (!user) return <Navigate to="/role-selection" replace />;

  if (user.role.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to={`/${user.role.toLowerCase()}/home`} replace />;
  }

  return (
    <ProtectedRoute role={user.role}>
      <Dashboard />
    </ProtectedRoute>
  );
};
