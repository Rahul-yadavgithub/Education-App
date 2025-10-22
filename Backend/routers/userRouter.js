import express from "express";
import isAuth from "../middleware/isAuth.js";
import authorizeRole from "../middleware/authorizeRole.js";

import getCurrentUser from "../controllers/userController.js";

const Userrouter = express.Router();

// Any authenticated user
Userrouter.get("/currentUser",isAuth, getCurrentUser); 

// Only students
Userrouter.get("/studentDashboard", isAuth, authorizeRole("student"), (req, res) => {
  res.json({ success: true, message: "Welcome Student!", user: req.user });
});

// Only teachers
Userrouter.get("/teacherDashboard", isAuth, authorizeRole("teacher"), (req, res) => {
  res.json({ success: true, message: "Welcome Teacher!", user: req.user });
});

// Head roles
Userrouter.get(
  "/headOfCollegeDashboard",
  isAuth,
  authorizeRole("headOfCollege"),
  (req, res) => res.json({ success: true, message: "Welcome Head of College!", user: req.user })
);

Userrouter.get(
  "/headOfDistrictDashboard",
  isAuth,
  authorizeRole("headOfDistrict"),
  (req, res) => res.json({ success: true, message: "Welcome Head of District!", user: req.user })
);

export default Userrouter;
