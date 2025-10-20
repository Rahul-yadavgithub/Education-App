// routers/loginTypeRouter.js
import express from "express";

const loginTypeRouter = express.Router();

// List of roles
const roles = [
  { name: "Student", path: "/student/login" },
  { name: "Teacher", path: "/teacher/login" },
  { name: "Principal", path: "/principal/login" },
  { name: "District Head", path: "/district-head/login" },
];

loginTypeRouter.get("/", (req, res) => {
  res.json({ roles });
});

export default loginTypeRouter;
