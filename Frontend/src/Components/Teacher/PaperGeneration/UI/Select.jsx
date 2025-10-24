import React from "react";

export default function Select({ id, value, onChange, children }) {
  return (
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200"
    >
      {children}
    </select>
  );
}
