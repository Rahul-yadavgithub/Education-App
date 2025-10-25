// src/components/UI/PdfPicker.jsx
import React, { useRef, useState, useEffect } from "react";
import { FileText } from "lucide-react";
import axiosInstance from "../../../../Utils/axiosInstance";
import { API_PATHS } from "../../../../Utils/apiPaths.js";

export default function PdfPicker({ id, label, file, onChange, error, setReferenceId }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Mock progress simulation
  useEffect(() => {
    let interval;
    if (uploading && progress < 80) {
      interval = setInterval(() => {
        setProgress((p) => (p < 80 ? p + 5 : p));
      }, 300);
    }
    return () => clearInterval(interval);
  }, [uploading, progress]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      onChange(selectedFile);
      setUploaded(false);
      setProgress(0);
    } else {
      onChange(null);
      alert("Please select a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (uploading) return;

    if (!file) {
      alert("No PDF selected. You can still generate the paper without a PDF.");
      return;
    }

    try {
      setUploading(true);
      setProgress(5);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post(API_PATHS.PAPER.UPLOAD_PDF, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 120000,
      });

      // Sync progress with backend
      setProgress(100);
      setTimeout(() => setProgress(0), 1500);

      const { refreshId } = response.data;
      if (refreshId) {
        setReferenceId(refreshId); // only set if upload succeeded
        setUploaded(true);
      } else {
        alert("Upload failed: No refreshId returned.");
      }
    } catch (err) {
      console.error("❌ PDF upload error:", err.response?.data || err.message);
      alert(`Failed to upload PDF. ${err.response?.data?.msg || err.message}`);
      setProgress(0);
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
          {file ? file.name : "Select a PDF (optional)"}
        </span>
        <button
          type="button"
          onClick={() => inputRef.current.click()}
          className="text-indigo-600 hover:text-indigo-800 font-semibold"
        >
          Browse
        </button>
      </div>

      {/* Hidden input */}
      <input
        id={id}
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload button */}
      {file && !uploaded && (
        <button
          type="button"
          onClick={handleUpload}
          disabled={uploading}
          className="self-start px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
        >
          {uploading ? "Uploading..." : "Upload PDF (Optional)"}
        </button>
      )}

      {/* Uploaded confirmation */}
      {uploaded && (
        <span className="text-green-600 text-sm font-medium">
          PDF uploaded successfully ✅
        </span>
      )}

      {/* Progress bar */}
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
          <div
            className="bg-indigo-500 h-2.5 rounded-full transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {error && <span className="text-red-600 text-sm">{error}</span>}
    </div>
  );
}
