import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart2, CheckCircle2 } from "lucide-react";

export default function QuestionBreakdownSelector({ breakdowns, selected, onSelect, error }) {
  if (!breakdowns || breakdowns.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-yellow-700 flex items-center">
        <BarChart2 className="w-5 h-5 mr-2 text-yellow-600" />
        <span>No breakdowns available for this question count.</span>
      </div>
    );
  }

  const getBarWidth = (value, total) => `${(value / total) * 100}%`;

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-blue-600" />
        Choose Question Breakdown
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AnimatePresence>
          {breakdowns.map((b, i) => {
            const total = b.easy + b.medium + b.hard;
            const isSelected = selected === b;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => onSelect(b)}
                className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? "border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg"
                    : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50/30"
                }`}
              >
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-gray-800">{b.label}</h4>
                  {isSelected && (
                    <CheckCircle2 className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Difficulty bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2 flex">
                  <div
                    className="bg-green-400 h-full"
                    style={{ width: getBarWidth(b.easy, total) }}
                    title={`${b.easy} Easy`}
                  ></div>
                  <div
                    className="bg-yellow-400 h-full"
                    style={{ width: getBarWidth(b.medium, total) }}
                    title={`${b.medium} Medium`}
                  ></div>
                  <div
                    className="bg-red-400 h-full"
                    style={{ width: getBarWidth(b.hard, total) }}
                    title={`${b.hard} Hard`}
                  ></div>
                </div>

                {/* Numbers summary */}
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="text-green-600 font-medium">Easy: {b.easy}</span>
                  <span className="text-yellow-600 font-medium">Medium: {b.medium}</span>
                  <span className="text-red-600 font-medium">Hard: {b.hard}</span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {error && (
        <div className="mt-3 text-red-600 text-sm flex items-center gap-1">
          <span className="font-medium">⚠</span> {error}
        </div>
      )}
    </div>
  );
}
