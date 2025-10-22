import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// ---------- Context ----------
import UserProvider, { UserDataContext } from "./Context/UserContext.jsx";
import ProtectedRoute from "./Components/ProtectRouter/ProtectedRoute.jsx";

// ---------- Role Selection ----------
import RoleSelectionLayout from "./Components/LayOuts/RoleSelectionLayout.jsx";

// ---------- Student Auth Pages ----------
import StudentLogin from "./Pages/Domain/Student/Login.jsx";
import StudentSignup from "./Pages/Domain/Student/SignUp.jsx";
import StudentForgotPassword from "./Pages/Domain/Student/ForgotPassword.jsx";
import StudentResetPassword from "./Pages/Domain/Student/ResetPassword.jsx";
import StudentVerifyEmail from "./Pages/Domain/Student/VerifyEmail.jsx";

// ---------- Student Dashboard ----------
import Dashboard from "./Pages/HomePage/DashBoard.jsx";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Root route: redirect based on user context */}
          <Route path="/" element={<Root />} />

          {/* Public routes */}
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/student/signup" element={<StudentSignup />} />
          <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
          <Route
            path="/student/reset-password/:token"
            element={<StudentResetPassword domain="Student" />}
          />
          <Route path="/student/verify/:token" element={<StudentVerifyEmail />} />

          {/* Protected student dashboard */}
          <Route
            path="/student/home"
            element={
              <ProtectedRoute role="Student">
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Default role selection */}
          <Route path="/role-selection" element={<RoleSelectionLayout />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      <Toaster
        toastOptions={{
          className: "",
          style: { fontSize: "13px" },
        }}
      />
    </UserProvider>
  );
};

export default App;

// ---------- Root component ----------
const Root = () => {
  const { user } = React.useContext(UserDataContext);

  if (!user) {
    // No user → show role selection page
    return <Navigate to="/role-selection" replace />;
  }

  // Logged-in users → redirect to their dashboard
  switch (user.role) {
    case "student":
      return <Navigate to="/student/home" replace />;
    case "teacher":
      return <Navigate to="/teacher/home" replace />;
    case "principal":
      return <Navigate to="/principal/home" replace />;
    case "district":
      return <Navigate to="/district-head/home" replace />;
    default:
      return <Navigate to="/role-selection" replace />;
  }
};

