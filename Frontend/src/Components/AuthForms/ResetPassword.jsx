import React, { useState } from "react";
import axiosInstance from "../../Utils/axiosInstance";
import InputField from "../Inputs/InputField";
import { useNavigate } from "react-router-dom";
import { API_PATHS } from "../../Utils/apiPaths";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ import context

const ResetPassword = ({ token, domain, title = "Reset Password", redirectTo = "/" }) => {
  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const { updateUser } = useUser(); // ✅ get updateUser

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        API_PATHS.AUTH.RESETPASSWORD(domain, token),
        { password: formData.password, userType: domain }
      );

      if (res?.data?.message) {
        setMessage(res.data.message);

        // ✅ update global user state if API returns user
        if (res.data.user) updateUser(res.data.user);

        setTimeout(() => navigate(redirectTo), 2500);
      } else {
        setError("Unexpected response from server");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
          label="New Password"
          name="password"
          type="password"
          placeholder="Enter new password"
          value={formData.password}
          onChange={handleChange}
        />
        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-md font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
