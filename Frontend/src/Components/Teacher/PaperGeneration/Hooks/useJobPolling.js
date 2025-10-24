import { useState, useEffect, useRef, useCallback } from "react";
import { API_PATHS } from "../../../../Utils/apiPaths";
import axiosInstance from "../../../../Utils/axiosInstance";

/**
 * useJobPolling
 * Polls the backend for job status periodically.
 *
 * @param {string} jobId - ID of the generation job
 * @param {object} options - { interval, onComplete, onError, mock }
 * @returns {object} { status, progress, message, stopPolling, isPolling }
 */
export default function useJobPolling(
  jobId,
  { interval = 3000, onComplete, onError, mock = false } = {}
) {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [isPolling, setIsPolling] = useState(false);
  const pollingRef = useRef(null);
  const isMounted = useRef(true);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      setIsPolling(false);
    }
  }, []);

  const pollStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      if (mock) {
        // Mock polling for local development
        setProgress((prev) => Math.min(prev + Math.random() * 15, 95));
        setMessage("Mock generating paper...");
        if (progress >= 95) {
          stopPolling();
          setProgress(100);
          setStatus("completed");
          setMessage("✅ Paper generated (mock)!");
          onComplete?.({ jobId, status: "completed", progress: 100, result: null });
        }
        return;
      }

      const { data } = await axiosInstance.get(API_PATHS.PAPER.STATUS(jobId));

      if (!isMounted.current) return;

      setProgress(data.progress ?? progress);
      setStatus(data.status ?? "running");
      setMessage(data.statusMessage ?? "Generating...");

      if (data.status === "COMPLETE" || data.status === "completed") {
        stopPolling();
        setProgress(100);
        setMessage("✅ Paper generated successfully!");
        onComplete?.(data);
      } else if (data.status === "FAILED" || data.status === "failed") {
        stopPolling();
        setStatus("failed");
        setMessage("❌ Paper generation failed.");
        onError?.(data);
      }
    } catch (err) {
      console.error("Polling error:", err);
      stopPolling();
      setStatus("failed");
      setMessage("⚠️ Unable to connect to the server.");
      onError?.(err);
    }
  }, [jobId, mock, onComplete, onError, progress, stopPolling]);

  useEffect(() => {
    isMounted.current = true;

    if (!jobId) return;

    setStatus("running");
    setProgress(0);
    setMessage(mock ? "Mock paper generation..." : "Paper generation started...");
    setIsPolling(true);

    // Initial poll immediately
    pollStatus();
    pollingRef.current = setInterval(pollStatus, interval);

    return () => {
      isMounted.current = false;
      stopPolling();
    };
  }, [jobId, interval, pollStatus, mock, stopPolling]);

  return { status, progress, message, stopPolling, isPolling };
}
