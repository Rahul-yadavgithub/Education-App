import React, { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle2, RefreshCw, Share2, FileText } from "lucide-react";
import Button from "../UI/Button";
import useDownloadFile from "../Hooks/useDownloadFile";

export default function DownloadStep({ fileUrl, onRegenerate }) {
  const [isShared, setIsShared] = useState(false);

  const { status, progress, error } = useDownloadFile(fileUrl, {
    onComplete: (blob) => {
      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "QuestionPaper.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    },
  });

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "AI-Generated Question Paper",
        text: "Here’s my generated question paper — created with AI!",
        url: fileUrl || window.location.href,
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

        <h2 className="text-3xl font-semibold text-gray-800 mb-2">Your Paper is Ready!</h2>
        <p className="text-gray-600 mb-8">
          You can now download or share your AI-generated question paper.
        </p>

        {/* Download / Share Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => {}}
            disabled={status !== "completed"}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
          >
            {status === "downloading" ? (
              <>
                <RefreshCw className="animate-spin w-5 h-5" />
                Downloading... {progress}%
              </>
            ) : (
              <>
                <Download className="w-5 h-5" />
                {status === "completed" ? "Download Paper" : "Preparing..."}
              </>
            )}
          </Button>

          <Button
            onClick={handleShare}
            disabled={status !== "completed"}
            className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2"
          >
            <Share2 className="w-5 h-5" />
            {isShared ? "Shared!" : "Share Paper"}
          </Button>
        </div>

        {/* Progress / Status */}
        {status === "downloading" && (
          <div className="w-64 bg-gray-200 rounded-full h-3 overflow-hidden mt-4 mx-auto">
            <motion.div
              className="bg-gradient-to-r from-purple-600 to-teal-400 h-full"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeInOut", duration: 0.3 }}
            />
          </div>
        )}

        {status === "failed" && (
          <p className="text-red-600 font-medium mt-3">❌ {error}</p>
        )}

        {/* Regenerate */}
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
      </motion.div>
    </div>
  );
}
