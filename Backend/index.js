// index.js or app.js
import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import cors from "cors";
import cookieParser from "cookie-parser"; // Needed for reading cookies
import connectDB from "./configuration/db.js";

import authRoute from "./routers/authRouter.js";
import dashRouter from "./routers/dashboardRouter.js";
import loginTypeRouter from './routers/loginTypeRouter.js';
import uploadRoute from './routers/uploadImageRouter.js';
import Userrouter from "./routers/userRouter.js"; // <-- Import userRouter

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Connect to database
await connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // 🔹 Important for isAuth to read token

// Routes
app.use("/api/auth", authRoute);
app.use("/api/home", dashRouter);
app.use("/api/image", uploadRoute);
app.use("/api/login-type", loginTypeRouter);

// 🔹 User routes (role-based + authenticated)
app.use("/api/user", Userrouter);

// Health check / default route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
