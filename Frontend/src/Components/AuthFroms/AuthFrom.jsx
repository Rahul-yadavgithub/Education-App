// src/components/auth/AuthForm.jsx
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";

const AuthForm = ({ domain, type, apiPath, title, redirectTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // signup or reset
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useParams(); // for reset password

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if ((type === "signup" || type === "resetPassword") && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      let payload;
      if (type === "login") payload = { email, password };
      else if (type === "signup") payload = { email, password, name: confirmPassword };
      else if (type === "forgotPassword") payload = { email };
      else if (type === "resetPassword") payload = { password };

      const url = type === "resetPassword" ? apiPath(token) : apiPath;
      const res = await axiosInstance.post(url, payload);

      if (type === "login" && res?.data?.accessToken) {
        localStorage.setItem("token", res.data.accessToken);
        navigate(redirectTo || `/${domain}/home`);
      } else if (res?.data?.message) {
        setMessage(res.data.message);
        if (type === "resetPassword") {
          setTimeout(() => navigate(`/${domain}/login`), 2000);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      {title && <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {type === "signup" && (
          <input
            type="text"
            placeholder="Full Name"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}

        {(type === "login" || type === "signup" || type === "forgotPassword") && (
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}

        {(type === "login" || type === "signup" || type === "resetPassword") && (
          <>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {(type === "signup" || type === "resetPassword") && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            )}
          </>
        )}

        {type === "login" && (
          <div className="flex justify-end">
            <Link
              to={`/${domain}/forgot-password`}
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-md font-semibold transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Please wait..." : title}
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        {message && <p className="text-green-500 text-center mt-2">{message}</p>}
      </form>

      <div className="text-center mt-4 text-gray-600">
        {type === "login" ? (
          <Link to={`/${domain}/signup`} className="text-blue-500 hover:underline">
            Don't have an account? Sign up
          </Link>
        ) : type === "signup" ? (
          <Link to={`/${domain}/login`} className="text-blue-500 hover:underline">
            Already have an account? Login
          </Link>
        ) : (
          <Link to={`/${domain}/login`} className="text-blue-500 hover:underline">
            Back to Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
