// frontend/src/Components/Teacher/StudyMaterialSection.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function StudyMaterialSection() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);

  const onFiles = (fileList) => {
    const arr = Array.from(fileList);
    setFiles((prev) => [...arr, ...prev]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files?.length) onFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e) => {
    if (e.target.files?.length) onFiles(e.target.files);
  };

  return (
    <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <motion.div
        className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Upload Study Material
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload PDFs, slides, or notes for your students.
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
          className={`flex flex-col items-center justify-center gap-3 border-2 rounded-lg p-6 cursor-pointer transition ${
            dragActive
              ? "border-teal-400 bg-teal-50/40"
              : "border-gray-200 bg-gray-50"
          }`}
        >
          <input
            id="file_input_hidden"
            type="file"
            multiple
            onChange={handleFileInput}
            className="hidden"
          />
          <label htmlFor="file_input_hidden" className="w-full text-center">
            <div className="py-6">
              <BookOpen className="mx-auto w-8 h-8 text-gray-600" />
              <p className="mt-3 text-sm text-gray-600">
                Drag & drop files here, or{" "}
                <span className="font-semibold text-gray-800 underline">
                  browse
                </span>
              </p>
              <p className="mt-2 text-xs text-gray-400">
                PDF, PPTX, DOCX — max 200MB
              </p>
            </div>
          </label>
        </div>

        <div className="mt-4 flex gap-3">
          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-400 to-purple-600 text-white font-semibold">
            Upload
          </button>
          <button className="px-4 py-2 rounded-lg border border-gray-200">
            Manage Files
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.div className="p-4 rounded-2xl bg-white/60 border border-gray-100 backdrop-blur-sm">
          <h3 className="font-semibold text-gray-800">Uploaded Files</h3>
          {files.length === 0 ? (
            <p className="text-sm text-gray-500 mt-2">No files yet.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {f.name}{" "}
                  <span className="text-xs text-gray-400">
                    ({Math.round(f.size / 1024)} KB)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>
    </div>
  );
}
