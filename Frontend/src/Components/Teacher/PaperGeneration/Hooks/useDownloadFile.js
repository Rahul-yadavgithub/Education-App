import { useState, useEffect } from "react";

/**
 * useDownloadFile Hook
 * ------------------------------------------
 * Handles downloading the generated question paper.
 *
 * @param {string|null} fileUrl - The URL to download.
 * @param {object} options - Optional config:
 *   {
 *     onComplete: function(blob) { ... } called when download completes
 *     onError: function(err) { ... } called when download fails
 *   }
 */
export default function useDownloadFile(fileUrl, { onComplete, onError } = {}) {
  const [progress, setProgress] = useState(0); // 0 - 100
  const [status, setStatus] = useState("idle"); // idle | downloading | completed | failed
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileUrl) return;

    let abortController = new AbortController();

    const downloadFile = async () => {
      try {
        setStatus("downloading");
        setProgress(0);
        setError(null);

        const response = await fetch(fileUrl, { signal: abortController.signal });
        if (!response.ok) throw new Error("Failed to download file");

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : null;

        if (!total) {
          // If no content-length, fallback
          const blob = await response.blob();
          setProgress(100);
          setStatus("completed");
          if (onComplete) onComplete(blob);
          return;
        }

        // Stream download with progress
        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          setProgress(Math.floor((received / total) * 100));
        }

        const blob = new Blob(chunks, { type: "application/pdf" });
        setProgress(100);
        setStatus("completed");

        if (onComplete) onComplete(blob);
      } catch (err) {
        if (err.name === "AbortError") return; // User canceled
        console.error("Download error:", err);
        setError(err.message || "Download failed");
        setStatus("failed");
        if (onError) onError(err);
      }
    };

    downloadFile();

    return () => {
      abortController.abort();
    };
  }, [fileUrl]);

  return { status, progress, error };
}
