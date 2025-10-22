// middleware/multer.js
import multer from "multer";

/**
 * Multer configuration using memory storage
 * - Files are temporarily stored in RAM
 * - We later write them to disk manually for Cloudinary upload
 */

// Store files in memory (not saved to disk)
const storage = multer.memoryStorage();

/**
 * Allow only image files (JPEG/JPG/PNG)
 */
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, or PNG images are allowed"), false);
  }
};

// Create the upload middleware
const upload = multer({ storage, fileFilter });

export default upload;
