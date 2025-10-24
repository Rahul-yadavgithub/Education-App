import React from "react";

export default function TextInput({ id, value, onChange, placeholder, type = "text", min }) {
  return (
    <input
      id={id}
      type={type}
      min={min}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition duration-200 placeholder-gray-400"
    />
  );
}
