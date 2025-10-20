import express from "express";
import { 
  signUp, 
  login, 
  logout, 
  verifyEmail, 
  forgotPassword, 
  resetPassword 
} from "../controllers/authController.js";

const authRoute = express.Router();

authRoute.post("/signUp", signUp);
authRoute.post("/login", login);
authRoute.post("/logout", logout);
authRoute.get("/verify/:token", verifyEmail);

authRoute.post("/forgot-password", forgotPassword); // send email with reset link
authRoute.post("/reset-password/:token", resetPassword); // actually reset the password


export default authRoute;