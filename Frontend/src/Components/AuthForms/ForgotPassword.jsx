// src/Components/AuthForms/ForgotPassword.jsx
import React, { useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import InputField from "../Inputs/InputField";
import { API_PATHS } from "../../Utils/apiPaths";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ import context

/**
 * ✉️ Universal Forgot Password Form
 * - Works for all domains (student, teacher, headofschool, headofcollege)
 * - Sends reset link to user's email
 */
const ForgotPassword = ({
  title = "Forgot Password",
  redirectTo = "/",
  domain = "user",
}) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { updateUser } = useUser(); // ✅ get updateUser from context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.FORGOTPASSWORD(domain), {
        email,
        userType: domain,
      });

      if (res?.data?.message) {
        setMessage(res.data.message);
        setEmail("");

        // ✅ optional: update global user state if API returns user info
        if (res.data.user) updateUser(res.data.user);

        setTimeout(() => setMessage(""), 5000);
      } else {
        setError("Unexpected response from server");
        setTimeout(() => setError(""), 5000);
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Something went wrong. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{title}</h2>

      {message && (
        <p className="text-green-600 bg-green-100 p-2 rounded mb-3 text-center text-sm">
          {message}
        </p>
      )}
      {error && (
        <p className="text-red-600 bg-red-100 p-2 rounded mb-3 text-center text-sm">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-md font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <p className="text-center text-gray-500 mt-4 text-sm">
        We’ll send a reset link to your registered {domain} email.
      </p>
    </div>
  );
};

export default ForgotPassword;
