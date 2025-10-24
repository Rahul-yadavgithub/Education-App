// src/components/UI/PdfPicker.jsx
import React, { useRef, useState } from "react";
import { FileText } from "lucide-react";
import axios from "axios";
import { API_PATHS } from "../../../../Utils/apiPaths.js"; // adjust the import as per your project

import axiosInstance from "../../../../Utils/axiosInstance";

export default function PdfPicker({ id, label, file, onChange, error, setReferenceId }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      onChange(selectedFile);
      setUploaded(false); // reset uploaded state
    } else {
      onChange(null);
      alert("Please select a valid PDF file.");
    }
  };

const handleUpload = async () => {
  // 🧠 Prevent duplicate uploads or invalid calls
  if (uploading) {
    console.warn("Upload already in progress — skipping duplicate call.");
    return;
  }

  if (!file) {
    alert("Please select a PDF first.");
    return;
  }

  try {
    setUploading(true);

    // 🗂️ Prepare FormData
    const formData = new FormData();
    formData.append("file", file);

    console.log("📦 Uploading formData:", file.name, file.size);

    // 📤 Send request
    const response = await axiosInstance.post(
        API_PATHS.PAPER.UPLOAD_PDF,
        formData,
        {
            headers: {
            "Content-Type": "multipart/form-data",
            },
        }
    );

    const { refreshId } = response.data;
    console.log("✅ Upload success, refreshId:", refreshId);

    if (refreshId) {
      setReferenceId(refreshId);
      setUploaded(true);
    } else {
      alert("Upload failed: No refreshId returned.");
    }
  } catch (err) {
    console.error("❌ PDF upload error:", err.response?.data || err.message);
    alert(`Failed to upload PDF. ${err.response?.data?.msg || "Try again."}`);
  } finally {
    setUploading(false);
  }
};


  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor={id} className="flex items-center gap-2 text-gray-700 font-medium mb-1">
        <FileText className="w-5 h-5 text-indigo-500" />
        {label}
      </label>
      <div
        onClick={() => inputRef.current.click()}
        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-indigo-400 transition-all duration-200 bg-gray-50"
      >
        <span className="text-gray-600 truncate">
          {file ? file.name : "Select a PDF from your computer"}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Browse
        </button>
      </div>

      {/* Hidden file input */}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button appears only if file is selected */}
      {file && !uploaded && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="self-start px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      )}

      {/* Show uploaded confirmation */}
      {uploaded && (
        <span className="text-green-600 text-sm font-medium">PDF uploaded successfully ✅</span>
      )}

      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
