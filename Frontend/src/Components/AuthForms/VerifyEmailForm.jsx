import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import { API_PATHS } from "../../Utils/apiPaths";

/**
 * ✉️ Universal Email Verification Component
 * - Works for all domains (student, teacher, principal, headofdistrict, etc.)
 * - Accepts domain and redirectTo for modular use
 */
const VerifyEmailForm = ({
  domain = "User",
  redirectTo = "/",
  title = "Email Verification",
}) => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const [message, setMessage] = useState("Verifying your email...");
  const [error, setError] = useState("");

   const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    if(attempted) return;
    setAttempted(true);

    const verifyEmail = async () => {
      try {
        const apiPath = API_PATHS.AUTH.VERIFYEMAIL( domain, token); // dynamic API path
        const res = await axiosInstance.get(apiPath);

        if (res?.data?.message) {
          setMessage(res.data.message || "Your email has been successfully verified!");
          setVerified(true); // mark as verified
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
  }, [token, domain, setAttempted]);

  const handleRedirect = () => {
    localStorage.setItem("domain", domain);

    // ✅ Redirect to specific login
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!error && (
          <>
            <p className="text-green-600 mb-6">{message}</p>
            {verified && (
              <button
                onClick={handleRedirect}
                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition"
              >
                Go to Login
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailForm;
