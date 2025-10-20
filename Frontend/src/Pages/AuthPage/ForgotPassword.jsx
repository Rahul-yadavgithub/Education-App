import React, { useState } from "react";
import axiosInstance from "../../Utils/axiosInstance"; // your centralized axios
import { API_PATHS } from "../../Utils/apiPaths";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await axiosInstance.post(API_PATHS.AUTH.FORGOTPASSWORD, { email });

      if (res?.data?.message) {
        setMessage(res.data.message);
        setTimeout(() => setMessage(""), 5000); // auto-clear after 5s
      }
    } catch (err) {
      // Handle server errors
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Something went wrong. Please try again.");
      setTimeout(() => setError(""), 5000); // auto-clear after 5s
      console.error("Forgot password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`py-3 rounded-md font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <p className="text-green-500 text-center mt-2">{message}</p>}
          {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
