// routers/authRouter.js
import express from "express";
import {
  signUp,
  login,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
  refreshToken,
} from "../controllers/authController.js";

import { verifyAccessToken } from "../middleware/Token.js";

const authRoute = express.Router();

/**
 * Signup: /api/auth/:role/signUp
 * Login: /api/auth/:role/login
 * Forgot Password: /api/auth/:role/forgot-password
 * Reset Password: /api/auth/:role/reset-password/:token
 */

authRoute.post("/:role/signUp", signUp);
authRoute.post("/:role/login", login);

authRoute.get("/:role/verify/:token", verifyEmail);
authRoute.post("/:role/forgot-password", forgotPassword);
authRoute.post("/:role/reset-password/:token", resetPassword);

authRoute.post("/refresh-token", refreshToken);

authRoute.post("/logout", verifyAccessToken, logout);

export default authRoute;

