import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const res = await axiosInstance.get(API_PATHS.AUTH.VERIFYEMAIL(token));
        if (res?.data?.message) {
          setMessage(res.data.message || "Your email has been successfully verified!");
        } else {
          setError("Invalid or expired verification link");
        }
      } catch (err) {
        const serverMessage = err.response?.data?.message;
        setError(serverMessage || "Something went wrong while verifying email.");
        console.error("Email verification error:", err);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>
        {error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <p className="text-green-600 mb-4">{message}</p>
        )}
        <Link
          to="/login"
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  );
};

export default VerifyEmail;
