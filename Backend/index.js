// index.js
const express = require("express");
const dotenv = require("dotenv");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Needed for reading cookies
const connectDB = require("./configuration/db.js");

const { authRoute } = require("./routers/authRouter.js");
const  { dashRouter} = require("./routers/dashboardRouter.js");
const { loginTypeRouter } = require('./routers/loginTypeRouter.js');
const { uploadRoute } = require('./routers/uploadImageRouter.js');
const { Userrouter } = require("./routers/userRouter.js"); // <-- Import userRouter

const morgan = require("morgan");
const helmet = require("helmet");

const { uploadRoutes} = require("./routers/uploadRoutes.js");
const { paperRoutes} = require("./routers/paperRoutes.js");
const { historyRoutes} = require("./routers/historyRoutes.js");
const { adminRoutes } = require("./routers/adminRoutes.js");

const {downloadRouter} = require("./routers/downlaodRouter.js");

const { errorHandler } = require("./middleware/errorHandler.js");
const path = require("path");

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || "production";
const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";

const isProduction = NODE_ENV === "production";



const app = express();


// Connect to database
connectDB();

app.use(
  cors({
    origin: FRONTEND_URL, // Dynamic frontend URL
    credentials: true, // Needed for cookies
  })
);


app.use(helmet());
app.use(morgan(isProduction ? "combined" : "dev"));
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

// AI related Router
app.use("/api/upload", uploadRoutes);
app.use("/api/paper", paperRoutes); // main generation endpoint
app.use("/api/history", historyRoutes);
app.use("/api/admin", adminRoutes);

app.use("/api/paper",downloadRouter );

// Health check / default route
app.get("/", (req, res) => {
  res.send("Backend API is running...");
});

// Start server
app.listen( PORT, () => {
  console.log(`Server is running on port ${ PORT}`);
});
