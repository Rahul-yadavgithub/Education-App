// middleware/verifyToken.js
import jwt from "jsonwebtoken";
import { TokenBlacklist } from "../model/Token/TokenBlacklist.js";
import { verifyToken } from "../utils/token.js";

export const verifyAccessToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    // Check if token is blacklisted (for refresh tokens or previous logout)
    const blacklisted = await TokenBlacklist.findOne({ token });
    if (blacklisted)
      return res.status(401).json({ message: "Token is blacklisted, please log in again" });

    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.warn("Access token expired → auto logout triggered");
      return res.status(401).json({ message: "Access token expired" });
    }

    console.error("Token verification failed:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
