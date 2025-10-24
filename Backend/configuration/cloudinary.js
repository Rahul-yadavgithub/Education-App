// configuration/cloudinary.js
const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a local file to Cloudinary
 * @param {string} filepath - Local path to the file
 * @returns {string|null} - Uploaded image URL
 */
const uploadOnCloudinary = async (filepath) => {
  try {
    if (!filepath) return null;

    const result = await cloudinary.uploader.upload(filepath, {
      resource_type: "auto",
    });

    // Delete temporary file after upload
    if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload failed:", err.message);
    return null;
  }
};

/**
 * Delete an existing image from Cloudinary
 * @param {string} imageUrl - Full image URL (secure_url)
 */
const deleteFromCloudinary = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract public_id from the image URL
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1];
    const publicId = fileName.split(".")[0]; // remove extension

    // Delete file from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    if (result.result === "ok") {
      console.log(`Deleted old image: ${publicId}`);
    } else {
      console.warn(`Failed to delete image or not found: ${publicId}`);
    }
  } catch (err) {
    console.error("Cloudinary delete failed:", err.message);
  }
};

module.exports = {
  cloudinary,
  uploadOnCloudinary,
  deleteFromCloudinary
};
