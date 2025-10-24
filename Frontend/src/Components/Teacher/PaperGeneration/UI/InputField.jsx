import React from "react";

export default function InputField({ id, label, icon, children, error }) {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1"
      >
        {icon && <span className="text-gray-400">{icon}</span>}
        {label}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
