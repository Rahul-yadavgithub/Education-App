// routers/uploadImage.js
import express from "express";
import upload from "../middleware/multer.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../configuration/cloudinary.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getUserModel } from "../utils/getUserModel.js"; // ✅ Dynamic user model resolver

import isAuth from "../middleware/isAuth.js";

// Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRoute = express.Router();

/**
 * 🧠 Helper: Save file buffer to a temporary local file for Cloudinary upload
 */
const saveTempFile = (fileBuffer, originalName) => {
  const tmpDir = path.join(__dirname, "../tmp");
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  const tempFilePath = path.join(tmpDir, `${Date.now()}_${originalName}`);
  fs.writeFileSync(tempFilePath, fileBuffer);
  return tempFilePath;
};

/**
 * 📤 POST /api/upload/:role/upload
 * Upload new image (no existing image)
 */
uploadRoute.post("/:role/upload", upload.single("image"), async (req, res) => {
  try {
    const { role } = req.params;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const tempFilePath = saveTempFile(req.file.buffer, req.file.originalname);
    const url = await uploadOnCloudinary(tempFilePath);

    if (!url) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    return res.status(200).json({
      success: true,
      message: `Image uploaded successfully by ${role}`,
      userType: role,
      url,
    });
  } catch (err) {
    console.error(" Upload error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * 🔄 PUT /api/upload/:role/update-profile
 * Updates a user's profile image:
 *  - Deletes old Cloudinary image (if exists)
 *  - Uploads new image
 *  - Saves the new URL to the corresponding model
 */
uploadRoute.put("/:role/update-profile", isAuth, upload.single("image"), async (req, res) => {
  try {
    const { role } = req.params;

    console.log("user role: ", role);
    const userId = req.user?._id; // Assuming auth middleware sets req.user

    console.log("This is our backend: ", req.user);

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. User not authenticated." });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Dynamically get the correct model for this user role
    const Model = getUserModel(role.charAt(0).toUpperCase() + role.slice(1).toLowerCase());
    if (!Model) {
      return res.status(400).json({ message: "Invalid role or model not found" });
    }

    // Fetch user by ID
    const user = await Model.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete old image if present
    if (user.profileImageUrl) {
      try {
        await deleteFromCloudinary(user.profileImageUrl);
      } catch (deleteErr) {
        console.warn(" Cloudinary delete warning:", deleteErr.message);
      }
    }

    // Upload new image
    const tempFilePath = saveTempFile(req.file.buffer, req.file.originalname);
    const newUrl = await uploadOnCloudinary(tempFilePath);

    if (!newUrl) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    // Update the user record
    user.profileImageUrl = newUrl;
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Profile image updated successfully for ${role}`,
      userType: role,
      url: newUrl,
    });
  } catch (err) {
    console.error(" Update profile error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default uploadRoute;
