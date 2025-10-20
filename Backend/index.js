import express from "express";
import dotenv from "dotenv";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import cors from "cors";
import connectDB from "./configuration/db.js";

import authRoute from "./routers/authRouter.js";
import dashRouter from "./routers/dashboardRouter.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Connect to database
await connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend URL
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/home", dashRouter);

app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});
