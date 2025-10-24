import React from "react";

export default function Button({ children, type = "button", onClick, disabled, className, variant }) {
  const base = "px-6 py-2 rounded-xl font-semibold shadow-md transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
  };
  const applied = variant ? variants[variant] : variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${applied} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
