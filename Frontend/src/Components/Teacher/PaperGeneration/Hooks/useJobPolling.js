import { useState, useEffect, useRef, useCallback } from "react";
import axiosInstance from "../../../../Utils/axiosInstance";
import { API_PATHS } from "../../../../Utils/apiPaths";

export default function useJobPolling(
  jobId,
  { interval = 5000, onComplete, onError } = {}
) {
  const [status, setStatus] = useState("pending");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("Initializing...");
  const [fileUrl, setFileUrl] = useState(null);
  const [isPolling, setIsPolling] = useState(false);

  const pollingRef = useRef(null);
  const requestInProgress = useRef(false);
  const retryCount = useRef(0);
  const isUnmounted = useRef(false);

  /** ✅ clear any pending timeouts */
  const clearPollingTimeout = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  /** ✅ stop polling safely */
  const stopPolling = useCallback(() => {
    clearPollingTimeout();
    setIsPolling(false);
   requestInProgress.current = false;
  }, [clearPollingTimeout]);

  /** ✅ verify PDF existence */
  const verifyPdfExists = useCallback(async (url) => {
    try {
      const fullUrl = url.startsWith("http")
        ? url
        : `${axiosInstance.defaults.baseURL}${url}`;

      const res = await fetch(fullUrl, { method: "GET" });
      const contentType = res.headers.get("content-type") || "";
      return res.ok && contentType.includes("pdf");
    } catch {
      return false;
    }
  }, []);

  /** ✅ main polling logic */
  const pollJob = useCallback(async () => {
    if (!jobId || requestInProgress.current || !isPolling) return; 
    requestInProgress.current = true;

    try {
      const { data } = await axiosInstance.get(API_PATHS.PAPER.STATUS(jobId));
      const jobStatus = (data.status || "pending").toLowerCase();

      if (isUnmounted.current) return;

      setStatus(jobStatus);
      setProgress(data.progress ?? 0);
      setMessage(data.statusMessage || "Generating paper...");

      // ✅ clear any previous timeout before deciding next step
      clearPollingTimeout();

      if (jobStatus === "completed" || jobStatus === "complete") {
        const url = API_PATHS.DOWNLOAD.PAPER(jobId);

        const exists = await verifyPdfExists(url);

        if (exists) {
          setFileUrl(url);
          setProgress(100);
          setMessage("✅ Paper generated successfully!");
          stopPolling();
          onComplete?.({ data, fileUrl: url });
        } else if (retryCount.current < 5) {
          retryCount.current += 1;
          pollingRef.current = setTimeout(pollJob, interval + 2000);
        } else {
          setStatus("failed");
          setMessage("❌ File not found after completion.");
          stopPolling();
          onError?.(new Error("File not available after job completion"));
        }
      } else if (jobStatus === "failed") {
        setStatus("failed");
        setMessage("❌ Paper generation failed.");
        stopPolling();
        onError?.(data);
      } else {
        // ✅ only poll again if not done or failed
        pollingRef.current = setTimeout(pollJob, interval);
      }
    } catch (err) {
      console.error("Polling error:", err);
      setStatus("failed");
      setMessage("⚠️ Network error or server down.");
      stopPolling();
      onError?.(err);
    } finally {
      requestInProgress.current = false;
    }
  }, [jobId, interval, stopPolling, clearPollingTimeout, verifyPdfExists, onComplete, onError]);

  /** ✅ setup and teardown */
  useEffect(() => {
    if (!jobId) return;

    isUnmounted.current = false;
    retryCount.current = 0;
    setIsPolling(true);
    clearPollingTimeout(); // clear stale timers if any
    pollJob();

    return () => {
      isUnmounted.current = true;
      stopPolling();
    };
  }, [jobId, pollJob, stopPolling, clearPollingTimeout]);

  return { status, progress, message, fileUrl, isPolling, stopPolling };
}
