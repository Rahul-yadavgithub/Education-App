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
  const [isPolling, setIsPolling] = useState(false); // ✅ new state

  const pollingRef = useRef(null);
  const requestInProgress = useRef(false);
  const retryCount = useRef(0);
  const isUnmounted = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearTimeout(pollingRef.current);
      pollingRef.current = null;
      setIsPolling(false); // ✅ update when stopped
    }
  }, []);

  const verifyPdfExists = useCallback(async (url) => {
    try {
      const res = await fetch(url, { method: "GET" });
      const contentType = res.headers.get("content-type") || "";
      return res.ok && contentType.includes("pdf");
    } catch {
      return false;
    }
  }, []);

  const pollJob = useCallback(async () => {
    if (!jobId || requestInProgress.current) return;
    requestInProgress.current = true;

    try {
      const { data } = await axiosInstance.get(API_PATHS.PAPER.STATUS(jobId));
      const jobStatus = (data.status || "pending").toLowerCase();

      if (isUnmounted.current) return;

      setStatus(jobStatus);
      setProgress(data.progress ?? 0);
      setMessage(data.statusMessage || "Generating paper...");

      if (jobStatus === "completed" || jobStatus === "complete") {
        const base = axiosInstance.defaults.baseURL || "";
        const url = `${base}${API_PATHS.DOWNLOAD.PAPER(jobId)}`;

        console.log("This is our Fronted Url: ", url);
        const exists = await verifyPdfExists(url);

        if (exists) {
          setFileUrl(url);
          setProgress(100);
          setMessage("✅ Paper generated successfully!");
          stopPolling();
          onComplete?.({ data, fileUrl: url });
        }
          else if (retryCount.current < 5) {
            retryCount.current += 1;
            pollingRef.current = setTimeout(pollJob, interval + 2000);
          }
 
        else {
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
  }, [jobId, interval, stopPolling, verifyPdfExists, onComplete, onError]);

  useEffect(() => {
    if (!jobId) return;

    isUnmounted.current = false;
    retryCount.current = 0;
    setIsPolling(true); // ✅ set when starting

    pollJob(); // start immediately
    return () => {
      isUnmounted.current = true;
      stopPolling();
    };
  }, [jobId, pollJob, stopPolling]);

  // ✅ Return isPolling for UI
  return { status, progress, message, fileUrl, isPolling, stopPolling };
}
