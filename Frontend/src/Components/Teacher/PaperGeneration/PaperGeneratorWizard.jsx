import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConfigurationStep from "./Steps/ConfigurationStep";
import PollingStep from "./Steps/PollingStep";
import DownloadStep from "./Steps/DownloadStep";
import useStartJob from "./Hooks/useStartJob";

const fadeSlide = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export default function PaperGeneratorWizard() {
  const [step, setStep] = useState("config");
  const [jobId, setJobId] = useState(null);
  const [generatedPaper, setGeneratedPaper] = useState(null);
  const { startJob, isLoading, error } = useStartJob();

  const handleGenerate = async (config) => {
    try {
      const newJobId = await startJob(config);
      setJobId(newJobId);
      setStep("polling");
    } catch (err) {
      console.error("Failed to start job:", err);
    }
  };

  const handleGenerationComplete = (paper) => {
    setGeneratedPaper(paper);
    setStep("download");
  };

  const handleRegenerate = () => {
    setStep("config");
    setGeneratedPaper(null);
    setJobId(null);
  };

  return (
    <div className="relative z-10 w-full max-w-3xl mx-auto bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
      {/* Header with gradient line */}
      <div className="relative px-8 py-6 border-b border-gray-100">
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-purple-500 via-teal-400 to-purple-500 animate-[pulse_3s_ease-in-out_infinite]"
        />
        <h2 className="text-2xl font-semibold text-gray-900 text-center">
          AI-Powered Question Paper Generator
        </h2>
        <p className="text-sm text-gray-500 text-center mt-1">
          Configure, generate, and download exam papers easily.
        </p>
      </div>

      {/* Animated Step Container */}
      <div className="relative px-6 sm:px-10 py-8 bg-white/80 backdrop-blur-md">
        <AnimatePresence mode="wait">
          {step === "config" && (
            <motion.div key="config" {...fadeSlide}>
              <ConfigurationStep
                onGenerate={handleGenerate}
                isGenerating={isLoading}
                formError={error?.message}
              />
            </motion.div>
          )}

          {step === "polling" && (
            <motion.div key="polling" {...fadeSlide}>
              <PollingStep
                jobId={jobId}
                onComplete={handleGenerationComplete}
                onCancel={handleRegenerate}
              />
            </motion.div>
          )}

          {step === "download" && (
            <motion.div key="download" {...fadeSlide}>
              <DownloadStep
                fileUrl={generatedPaper?.downloadUrl} // ✅ updated to match new DownloadStep
                onRegenerate={handleRegenerate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom gradient glow */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-2/3 h-12 rounded-full blur-3xl opacity-40"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,92,246,0.3), rgba(45,212,191,0.3), rgba(99,102,241,0.3))",
        }}
      />
    </div>
  );
}
