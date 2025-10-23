// frontend/src/Components/Teacher/PaperGeneratorSection.jsx
import React from "react";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function PaperGeneratorSection() {
  return (
    <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <motion.div
        className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.36 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Create a New Question Paper
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Generate randomized papers, configure marks and sections easily.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-teal-400 text-white font-semibold shadow-md hover:scale-[1.01] transition">
            <FileText className="w-4 h-4" /> Generate Paper
          </button>

          <button className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition">
            Manage Templates
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        <CardPlaceholder title="Recent Papers" details="3 papers created this month" />
        <CardPlaceholder title="Saved Templates" details="2 saved templates" />
        <CardPlaceholder title="Auto-grade Settings" details="Configure marking schemes" />
      </div>
    </div>
  );
}

function CardPlaceholder({ title, details }) {
  return (
    <motion.div
      className="p-4 rounded-2xl bg-white/60 border border-gray-100 backdrop-blur-sm"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <h3 className="font-semibold text-gray-800">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{details}</p>
    </motion.div>
  );
}
