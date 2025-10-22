// configuration/multer.js
import multer from "multer";

// Store files in memory (not saved to disk)
const storage = multer.memoryStorage();

// File type filter: allow only JPEG and PNG
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg, jpg, or png are allowed"), false);
  }
};

// Create the upload middleware
const upload = multer({ storage, fileFilter });

export default upload;
