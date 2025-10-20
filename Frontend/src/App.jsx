import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Pages/AuthPage/Login";
import Signup from "./Pages/AuthPage/SignUp";
import Dashboard from "./Pages/HomePage/DashBoard";

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
      </Routes>
    </Router>
  );
}

export default App;
