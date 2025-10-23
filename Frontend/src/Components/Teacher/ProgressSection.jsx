// frontend/src/Components/Teacher/ProgressSection.jsx
import React from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function ProgressSection() {
  const data = [
    { name: "Alice", score: 78 },
    { name: "Bob", score: 85 },
    { name: "Charlie", score: 92 },
    { name: "David", score: 64 },
    { name: "Eve", score: 88 },
  ];

  return (
    <div className="mt-4 grid gap-6 grid-cols-1 lg:grid-cols-2">
      <motion.div
        className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Student Performance
          </h2>
          <div className="text-sm text-gray-500">Last 30 days</div>
        </div>

        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.06} />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="score"
                radius={[6, 6, 0, 0]}
                barSize={28}
                fill="url(#colorGradient)"
              />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="space-y-4">
        <motion.div className="p-4 rounded-2xl bg-white/60 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">Top Performers</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>Charlie — 92%</li>
            <li>Alice — 92%</li>
            <li>Eve — 88%</li>
          </ul>
        </motion.div>

        <motion.div className="p-4 rounded-2xl bg-white/60 border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-2">At-Risk Students</h3>
          <p className="text-sm text-gray-500">
            David — 64% (Needs attention)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
