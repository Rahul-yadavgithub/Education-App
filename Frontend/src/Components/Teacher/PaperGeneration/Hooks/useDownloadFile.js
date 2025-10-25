import { useState, useCallback, useRef } from "react";
import axiosInstance from "../../../../Utils/axiosInstance";

/**
 * useDownloadFile Hook
 * ------------------------------------------
 * Handles downloading binary files (PDFs) with progress tracking.
 */
export default function useDownloadFile(fileUrl, fileName = "file.pdf") {
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const abortController = useRef(null);

  const startDownload = useCallback(async () => {
    if (!fileUrl) {
      setError(new Error("No file URL provided"));
      setStatus("failed");
      return;
    }

    try {
      setStatus("downloading");
      setProgress(0);
      setError(null);

      // Abort previous download if any
      if (abortController.current) abortController.current.abort();
      abortController.current = new AbortController();

      const response = await axiosInstance.get(fileUrl, {
        responseType: "blob", // required for binary files
        onDownloadProgress: (event) => {
          if (event.total) {
            const percent = Math.round((event.loaded * 100) / event.total);
            setProgress(percent);
          }
        },
        signal: abortController.current.signal,
      });

      // Create temporary download link
      const blob = new Blob([response.data], { type: "application/pdf" });
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);

      setProgress(100);
      setStatus("completed");
    } catch (err) {
      console.error("Download error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setStatus("failed");
    }
  }, [fileUrl, fileName]);

  return { status, progress, error, startDownload };
}
