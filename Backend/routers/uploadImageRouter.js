// routers/uploadImage.js
import express from "express";
import upload from "../middleware/multer.js"; // multer memory storage
import { uploadOnCloudinary } from "../configuration/cloudinary.js"; // Cloudinary upload function
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname (not available by default in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoute = express.Router();

/**
 * Upload endpoint:
 * POST /api/upload/:role/upload
 * 
 * Example:
 *  POST /api/upload/admin/upload
 *  POST /api/upload/teacher/upload
 *  POST /api/upload/student/upload
 */
uploadRoute.post("/:role/upload", upload.single("image"), async (req, res) => {
  try {
    const { role } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Step 1: Create a temporary directory
    const tmpDir = path.join(__dirname, "../tmp");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    // Step 2: Create a unique temp file path
    const tempFilePath = path.join(tmpDir, `${Date.now()}_${req.file.originalname}`);

    // Step 3: Write the file buffer to disk
    fs.writeFileSync(tempFilePath, req.file.buffer);

    // Step 4: Upload to Cloudinary
    const url = await uploadOnCloudinary(tempFilePath);

    if (!url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    // Step 5: Respond with the uploaded file URL and role info
    return res.json({
      success: true,
      message: `Image uploaded successfully by ${role}`,
      uploadedBy: role,
      url,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default uploadRoute;
