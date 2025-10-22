// routers/loginTypeRouter.js
import express from "express";

const loginTypeRouter = express.Router();

// List of roles
const roles = [
  { name: "Student", path: "/student/login" },
  { name: "Teacher", path: "/teacher/login" },
  { name: "Principle", path: "/principle/login" },
  { name: "District", path: "/district/login" },
];

loginTypeRouter.get("/", (req, res) => {
  res.json({ roles });
});

export default loginTypeRouter;
