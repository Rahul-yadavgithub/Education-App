// routes/uploadRoutes.js

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { isAuth } = require("../middleware/isAuth.js");
const { handleUpload } = require("../controllers/uploadController.js");

const uploadRoutes = express.Router();

// -----------------------------
// ✅ Ensure uploads folder exists
// -----------------------------
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("✅ Created uploads folder at:", uploadDir);
}

// -----------------------------
// ✅ Multer configuration for PDFs
// -----------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() + "-" + Math.random().toString(36).substring(2, 8);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Only PDF files are allowed"), false);
    } else {
      cb(null, true);
    }
  },
});

// -----------------------------
// ✅ Route
// -----------------------------
uploadRoutes.post("/", isAuth, upload.single("file"), handleUpload);

module.exports = { uploadRoutes };
