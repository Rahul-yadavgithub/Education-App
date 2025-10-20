import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/AuthPage/Login";
import Signup from "./Pages/AuthPage/SignUp";
import Dashboard from "./Pages/HomePage/DashBoard";
import VerifyEmail from "./Pages/AuthPage/VerifyEmail";

import ForgotPassword from "./Pages/AuthPage/ForgotPassword";
import ResetPassword from "./Pages/AuthPage/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected/Home Route */}
        <Route path="/home" element={<Dashboard />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset/:token" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
