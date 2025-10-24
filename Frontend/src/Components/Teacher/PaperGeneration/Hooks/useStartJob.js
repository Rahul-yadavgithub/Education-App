// src/components/PaperGeneration/hooks/useStartJob.js
import { useState, useRef, useCallback } from "react";
import axiosInstance from "../../../../Utils/axiosInstance";
import { API_PATHS } from "../../../../Utils/apiPaths";

/**
 * useStartJob
 * Handles starting paper generation jobs with axios + proper API paths.
 */
export default function useStartJob(defaultOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const defaults = {
    retry: { retries: 2, factor: 2, minTimeout: 500 },
    mock: false, // toggle mock for local development
    ...defaultOptions,
  };

  const _sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Cancel currently pending request
  const cancel = useCallback(() => {
    if (abortRef.current) {
      try {
        abortRef.current.abort();
      } catch {}
      abortRef.current = null;
    }
    setIsLoading(false);
  }, []);

  // Client-side validation
  const validateConfig = (config) => {
    if (!config || typeof config !== "object") throw new Error("Missing job configuration.");
    if (!config.subject || !String(config.subject).trim()) throw new Error("Subject is required.");
    const numQ = Number(config.numQuestions);
    if (!Number.isFinite(numQ) || numQ <= 0) throw new Error("numQuestions must be positive.");
    const totalMarks = Number(config.totalMarks);
    if (!Number.isFinite(totalMarks) || totalMarks <= 0) throw new Error("totalMarks must be positive.");
    return true;
  };

  const startJob = useCallback(async (config = {}, opts = {}) => {
    const { retry, mock } = { ...defaults, ...opts };
    setError(null);

    try {
      validateConfig(config);
    } catch (err) {
      setError(err);
      return Promise.reject(err);
    }

    setIsLoading(true);
    abortRef.current = new AbortController();
    const signal = abortRef.current.signal;

    // -------------------
    // MOCK FLOW (for local dev)
    // -------------------
    if (mock) {
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          if (signal.aborted) {
            setIsLoading(false);
            const e = new Error("Mock job aborted");
            setError(e);
            reject(e);
            return;
          }
          const newJobId = `mock_job_${Date.now()}`;
          setIsLoading(false);
          resolve(newJobId);
        }, 1000 + Math.random() * 800);

        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          setIsLoading(false);
          const e = new Error("Mock job aborted");
          setError(e);
          reject(e);
        });
      });
    }

    // -------------------
    // REAL BACKEND FLOW USING AXIOS
    // -------------------
    let attempt = 0;
    const maxAttempts = retry?.retries != null ? retry.retries + 1 : 3;
    const factor = retry?.factor || 2;
    const minTimeout = retry?.minTimeout || 500;

    while (attempt < maxAttempts) {
      try {
        attempt++;

        const response = await axiosInstance.post(
          API_PATHS.PAPER.GENERATE,
          config,
          { signal }
        );

        const data = response.data || {};
        const jobId = data?.jobId || data?.id || data?.job_id;

        if (!jobId) {
          const err = new Error("Server did not return a jobId.");
          setError(err);
          setIsLoading(false);
          return Promise.reject(err);
        }

        setIsLoading(false);
        return jobId;
      } catch (err) {
        if (signal.aborted) {
          const e = new Error("Job start aborted by user.");
          setError(e);
          setIsLoading(false);
          return Promise.reject(e);
        }

        if (attempt >= maxAttempts) {
          const e = err instanceof Error ? err : new Error(String(err));
          setError(e);
          setIsLoading(false);
          return Promise.reject(e);
        }

        // exponential backoff with jitter
        const backoff = Math.round(minTimeout * Math.pow(factor, attempt - 1));
        const jitter = Math.round(Math.random() * Math.min(200, backoff * 0.1));
        await _sleep(backoff + jitter);
      }
    }

    const fallbackErr = new Error("Unable to start job after retries.");
    setError(fallbackErr);
    setIsLoading(false);
    return Promise.reject(fallbackErr);
  }, [defaults]);

  return { startJob, isLoading, error, cancel };
}
