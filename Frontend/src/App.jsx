// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ---------- Role Selection ----------
import RoleSelectionLayout from "./Components/LayOuts/RoleSelectionLayout.jsx";

// ---------- Student Auth Pages ----------
import StudentLogin from "./Pages/Domain/Student/Login.jsx";
import StudentSignup from "./Pages/Domain/Student/SignUp.jsx";
import StudentForgotPassword from "./Pages/Domain/Student/ForgotPassword.jsx";
import StudentResetPassword from "./Pages/Domain/Student/ResetPassword.jsx";

import DashboardLayOut from './Pages/HomePage/DashBoard.jsx';

// // ---------- Teacher Auth Pages ----------
// import TeacherLogin from "./pages/domains/teacher/auth/Login.jsx";
// import TeacherSignup from "./pages/domains/teacher/auth/Signup.jsx";
// import TeacherForgotPassword from "./pages/domains/teacher/auth/ForgotPassword.jsx";
// import TeacherResetPassword from "./pages/domains/teacher/auth/ResetPassword.jsx";

// // ---------- Principal Auth Pages ----------
// import PrincipalLogin from "./pages/domains/headofschool/auth/Login.jsx";
// import PrincipalSignup from "./pages/domains/headofschool/auth/Signup.jsx";
// import PrincipalForgotPassword from "./pages/domains/headofschool/auth/ForgotPassword.jsx";
// import PrincipalResetPassword from "./pages/domains/headofschool/auth/ResetPassword.jsx";

// // ---------- Head of District Auth Pages ----------
// import DistrictLogin from "./pages/domains/headofdistrict/auth/Login.jsx";
// import DistrictSignup from "./pages/domains/headofdistrict/auth/Signup.jsx";
// import DistrictForgotPassword from "./pages/domains/headofdistrict/auth/ForgotPassword.jsx";
// import DistrictResetPassword from "./pages/domains/headofdistrict/auth/ResetPassword.jsx";

// // ---------- Verify Email ----------
// import VerifyEmail from "./pages/AuthPage/VerifyEmail.jsx";

// // ---------- Protected/Home Pages ----------
// import StudentDashboard from "./pages/domains/student/Dashboard.jsx";
// import TeacherDashboard from "./pages/domains/teacher/Dashboard.jsx";
// import PrincipalDashboard from "./pages/domains/headofschool/Dashboard.jsx";
// import DistrictDashboard from "./pages/domains/headofdistrict/Dashboard.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default role selection page */}
        <Route path="/" element={<RoleSelectionLayout />} />

        {/* ---------- Student Routes ---------- */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route path="/student/forgot-password" element={<StudentForgotPassword />} />
        <Route path="/student/reset/:token" element={<StudentResetPassword />} />
        <Route path="/student/home" element={<DashboardLayOut />} />

        {/* Catch all route -> Redirect to default */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
