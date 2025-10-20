import express from "express";
import { signUp, login, logout } from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/signUp", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);

export default authRoute;
