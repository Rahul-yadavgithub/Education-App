import React, { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import Button from "../UI/Button";
import useJobPolling from "../Hooks/useJobPolling";

export default function PollingStep({ jobId, onComplete, onCancel, mock = false }) {
  const [isCancelled, setIsCancelled] = useState(false);

  // Hook for polling job status
  const { status, progress, message, stopPolling, isPolling } = useJobPolling(jobId, {
    interval: 2500,
    onComplete: (data) => {
      onComplete?.(data);
    },
    onError: (err) => {
      console.error("Paper generation failed:", err);
    },
    mock,
  });

  // Cancel generation
  const handleCancel = () => {
    stopPolling?.();
    setIsCancelled(true);
    onCancel?.();
  };

  const isError = status === "failed";
  const isComplete = status === "completed" || status === "COMPLETE";

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
            message="Your document is ready to download."
          />
        ) : (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="mb-6"
            >
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto" />
            </motion.div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Generating Paper...</h2>
            <p className="text-gray-600 mb-6">{message || "Initializing..."}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-4">
              <motion.div
                className="h-4 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress ?? 0}%` }}
                transition={{ ease: "easeOut", duration: 0.5 }}
              />
            </div>
            <p className="text-sm text-gray-500 mb-6">{Math.floor(progress ?? 0)}% completed</p>

            <Button
              onClick={handleCancel}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200"
              disabled={!isPolling}
            >
              Cancel
            </Button>
          </>
        )}
      </motion.div>
    </div>
  );
}

function StatusMessage({ Icon, color, title, message }) {
  return (
    <div className={`flex flex-col items-center ${color}`}>
      <Icon className="w-12 h-12 mb-3" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
