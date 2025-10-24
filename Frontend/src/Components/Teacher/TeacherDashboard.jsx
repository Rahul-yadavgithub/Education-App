// frontend/src/Components/Teacher/TeacherDashboard.jsx
import React, { useState, useRef, useEffect } from "react";
import DashboardLayout from "../LayOuts/DashboardLayout.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, BookOpen, BarChart2 } from "lucide-react";

// Section imports
import PaperGeneratorSection from "./PaperGeneratorSection.jsx";
import StudyMaterialSection from "./StudyMaterialSection.jsx";
import ProgressSection from "./ProgressSection.jsx";

const TABS = [
  { id: "paper", label: "PaperGenerator", Icon: FileText },
  { id: "study", label: "StudyMaterial", Icon: BookOpen },
  { id: "progress", label: "Progress", Icon: BarChart2 },
];

const fadeSlide = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.35, ease: "easeOut" },
};

export default function TeacherDashboard() {
  const [active, setActive] = useState("paper");
  const [contentHeight, setContentHeight] = useState(null);
  const contentRef = useRef(null);

  // Dynamically update container height for smooth tab transitions
  useEffect(() => {
    const el = contentRef.current;
    if (el) {
      setContentHeight(el.getBoundingClientRect().height);
    }
  }, [active]);

  return (
    <DashboardLayout activeMenu="Teacher">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-semibold text-gray-900">
              Teacher Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage question papers, study materials, and track student progress.
            </p>
          </div>

          {/* Animated Tabs */}
          <div className="relative mb-6">
            <div
              aria-hidden
              className="absolute -inset-1 rounded-2xl blur-3xl opacity-30 pointer-events-none"
              style={{
                background:
                  "linear-gradient(120deg, rgba(99,102,241,0.22), rgba(45,212,191,0.18), rgba(139,92,246,0.18))",
                animation: "gradientShift 10s ease infinite",
              }}
            />
            <div className="relative z-10 flex justify-center">
              <div className="inline-flex gap-3 p-1 rounded-2xl bg-white/60 shadow-sm">
                {TABS.map((t) => (
                  <TabButton
                    key={t.id}
                    tab={t}
                    active={active === t.id}
                    onClick={() => setActive(t.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div
            ref={contentRef}
            className="relative transition-all duration-300"
            style={{ minHeight: contentHeight || undefined }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {active === "paper" && (
                <motion.div key="paper" {...fadeSlide}>
                  <PaperGeneratorSection />
                </motion.div>
              )}
              {active === "study" && (
                <motion.div key="study" {...fadeSlide}>
                  <StudyMaterialSection />
                </motion.div>
              )}
              {active === "progress" && (
                <motion.div key="progress" {...fadeSlide}>
                  <ProgressSection />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradientShift {
          0% {
            transform: translateX(-10%);
            opacity: 0.25;
          }
          50% {
            transform: translateX(10%);
            opacity: 0.35;
          }
          100% {
            transform: translateX(-10%);
            opacity: 0.25;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}

/* TabButton Subcomponent */
function TabButton({ tab, active, onClick }) {
  const { Icon, label } = tab;
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -3, scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex items-center gap-2 px-4 py-2 rounded-xl font-medium ${
        active
          ? "text-gray-900 bg-gradient-to-r from-purple-500/20 to-teal-400/20 shadow-inner"
          : "text-gray-500 hover:text-gray-800"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="hidden sm:inline">{label}</span>

      {active && (
        <motion.span
          layoutId="activeGlow"
          className="absolute -inset-0.5 rounded-xl border border-purple-400/40 shadow-[0_0_12px_rgba(168,85,247,0.4)]"
          transition={{ duration: 0.25 }}
        />
      )}
    </motion.button>
  );
}
