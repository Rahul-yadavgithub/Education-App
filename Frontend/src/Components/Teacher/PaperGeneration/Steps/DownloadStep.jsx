import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle2, RefreshCw, Share2, FileText } from "lucide-react";
import Button from "../UI/Button";
import useJobPolling from "../Hooks/useJobPolling";
import useDownloadFile from "../Hooks/useDownloadFile";

export default function DownloadStep({ jobId, onRegenerate }) {
  // Poll backend until job completes
  const { status: jobStatus, progress: jobProgress, message, fileUrl } = useJobPolling(jobId, {
    interval: 5000,
  });

  // Prepare filename based on jobId
  const filename = useMemo(() => `QuestionPaper-${jobId}.pdf`, [jobId]);

  // Initialize download hook — it will use fileUrl when available
  const {
    status: downloadStatus,
    progress: downloadProgress,
    error: downloadError,
    startDownload,
  } = useDownloadFile(fileUrl, filename);

  const [isShared, setIsShared] = useState(false);

  const isReady = ["completed", "complete"].includes(jobStatus) && !!fileUrl;
  const isDownloading = downloadStatus === "downloading";
  const isDownloaded = downloadStatus === "completed";

  const handleDownloadClick = () => {
    if (!isReady || isDownloading) return;
    startDownload(); // now uses the verified fileUrl automatically
  };

  const handleShare = async () => {
    if (!isReady) return;
    try {
      await navigator.share({
        title: "AI-Generated Question Paper",
        text: "Here’s my generated question paper — created with AI!",
        url: fileUrl, // use verified URL
      });
      setIsShared(true);
    } catch {
      setIsShared(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-gray-100"
      >
        {/* Icon */}
        <motion.div
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="flex justify-center mb-6"
        >
          <div className="bg-gradient-to-tr from-blue-500 to-indigo-500 p-4 rounded-full shadow-lg">
            <FileText className="w-10 h-10 text-white" />
          </div>
        </motion.div>

        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          {isReady ? "Your Paper is Ready!" : "Preparing your paper..."}
        </h2>

        <p className="text-gray-600 mb-4">{message}</p>

        {/* Error display (only for download errors) */}
        {downloadError && (
          <p className="text-red-500 mb-4 text-sm">
            ⚠️ {downloadError.message || "Download failed. Please try again."}
          </p>
        )}

        {/* Download + Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadClick}
            disabled={!isReady || isDownloading}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5" />
                Downloading... {downloadProgress}%
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                {isDownloaded ? "Download Completed" : "Download Paper"}
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            disabled={!isReady}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            {isShared ? "Shared!" : "Share Paper"}
          </Button>
        </div>

        {/* Job Progress Bar */}
        {jobStatus !== "completed" && (
          <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden mt-4 mx-auto">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-teal-400 h-full"
              animate={{ width: `${jobProgress}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>
        )}

        {/* Regenerate */}
        {isReady && (
          <div className="mt-10 border-t border-gray-200 pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="cursor-pointer inline-flex items-center gap-2 text-gray-600 hover:text-blue-600"
              onClick={onRegenerate}
            >
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <span>Generate Another Paper</span>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
