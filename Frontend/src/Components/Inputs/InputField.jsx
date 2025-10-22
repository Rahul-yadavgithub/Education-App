import React, { useState, useEffect } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = true,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [filled, setFilled] = useState(Boolean(value));

  useEffect(() => setFilled(Boolean(value)), [value]);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const inputId = name || label?.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className={`relative w-full ${className}`}>
      <input
        id={inputId}
        name={name}
        type={inputType}
        value={value}
        required={required}
        onChange={(e) => {
          onChange?.(e);
          setFilled(Boolean(e.target.value));
        }}
        className={`
          peer w-full border border-gray-300 rounded-lg py-4 px-4 pr-12
          text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 
          focus:border-blue-400 transition-all duration-200
          bg-white
        `}
        aria-label={label}
        placeholder=" " 
      />

      {/* Floating Label */}
      <label
        htmlFor={inputId}
        className={`
          absolute left-4 px-1 bg-white transition-all duration-200
          ${filled ? "-top-2.5 text-xs text-blue-600" : "top-4 text-gray-400 text-sm"}
          peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-600
          pointer-events-none
        `}
      >
        {label}
      </label>

      {/* Eye toggle for password */}
      {type === "password" && (
        <button
          type="button"
          onClick={toggleShowPassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <FaRegEye size={20} /> : <FaRegEyeSlash size={20} />}
        </button>
      )}
    </div>
  );
};

export default InputField;
