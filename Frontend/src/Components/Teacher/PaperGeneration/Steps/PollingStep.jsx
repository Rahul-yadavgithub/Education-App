import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, XCircle, Download } from "lucide-react";
import Button from "../UI/Button";
import useJobPolling from "../Hooks/useJobPolling";
import useDownloadFile from "../Hooks/useDownloadFile";
import axiosInstance from "../../../../Utils/axiosInstance";
import { API_PATHS } from "../../../../Utils/apiPaths";

export default function PollingStep({ jobId, onCancel }) {
  const [isCancelled, setIsCancelled] = useState(false);

  // Use the polling hook directly — no manual fileUrl management
  const { status, progress, message, fileUrl, stopPolling } = useJobPolling(jobId, {
    interval: 10000,
    onError: (err) => console.error("Paper generation failed:", err),
  });

  const isError = status === "failed";
  const isComplete = status === "completed" || status === "complete";

  // Construct full base URL if necessary
  const base = axiosInstance.defaults.baseURL || "";
  const verifiedFileUrl = fileUrl
    ? `${base}${fileUrl.startsWith("/") ? fileUrl : `/${fileUrl}`}`
    : null;

  const filename = useMemo(() => `QuestionPaper-${jobId}.pdf`, [jobId]);

  // Integrate unified download hook
  const {
    status: downloadStatus,
    progress: downloadProgress,
    error: downloadError,
    startDownload,
  } = useDownloadFile(verifiedFileUrl, filename);

  const isDownloading = downloadStatus === "downloading";

  const handleCancel = () => {
    stopPolling?.();
    setIsCancelled(true);
    onCancel?.();
  };

  const handleDownload = () => {
    if (!verifiedFileUrl || isDownloading) return;
    startDownload();
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-gray-100"
      >
        {isCancelled ? (
          <StatusMessage
            Icon={XCircle}
            color="text-red-500"
            title="Generation Cancelled"
            message="You stopped the paper generation process."
          />
        ) : isError ? (
          <StatusMessage
            Icon={AlertCircle}
            color="text-red-500"
            title="Error Occurred"
            message={message || "Something went wrong during generation."}
          />
        ) : isComplete ? (
          <StatusMessage
            Icon={CheckCircle2}
            color="text-green-500"
            title="Paper Generated!"
            message={downloadError ? downloadError.message : "Your document is ready to download."}
          >
            <Button
              onClick={handleDownload}
              variant="primary"
              className="mt-4 flex items-center gap-2 justify-center"
              disabled={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading... {downloadProgress}%
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </Button>
          </StatusMessage>
        ) : (
          <>
            {/* Spinner */}
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="mb-6"
            >
              <Loader2 className="w-16 h-16 text-blue-500 mx-auto drop-shadow-lg" />
            </motion.div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generating Paper...</h2>
            <p className="text-gray-600 mb-6">{message || "Initializing..."}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4 shadow-inner">
              <motion.div
                className="h-4 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress ?? 0}%` }}
                transition={{ ease: "easeInOut", duration: 0.8 }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-6">{Math.floor(progress ?? 0)}% completed</p>

            {/* Cancel Button */}
            <Button
              onClick={handleCancel}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200"
              disabled={isComplete || isError}
            >
              Cancel
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}

function StatusMessage({ Icon, color, title, message, children }) {
  return (
    <div className={`flex flex-col items-center ${color}`}>
      <Icon className="w-12 h-12 mb-3" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500">{message}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
