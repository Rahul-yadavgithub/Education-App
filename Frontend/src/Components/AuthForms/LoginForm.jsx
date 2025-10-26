import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance";
import InputField from "../Inputs/InputField.jsx";
import { API_PATHS } from "../../Utils/apiPaths";
import { useUser } from "../../Context/UserContext.jsx"; // ✅ import context

const LoginForm = ({ domain, title, redirectTo }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { updateUser } = useUser(); // ✅ update global context

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const storedDomain = localStorage.getItem("domain") || domain;

      // console.log("token:", storedDomain);

      const res = await axiosInstance.post(API_PATHS.AUTH.LOGIN(storedDomain), {
        email,
        password,
        userType: storedDomain,
      });

      // console.log("This is Fronted Recived Response:", res);

      if (res?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.removeItem("domain");

        // console.log("our Token:", res.data.accessToken);

        // ✅ Update global user context
        if (res.data.user) {
          updateUser(res.data.user);
        }

        // console.log("Our Fronted router: ", redirectTo);

        navigate(redirectTo || `/${domain.toLowerCase()}/home`);
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
      {title && (
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <InputField
          label="Email Address"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <InputField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex justify-end">
          <Link
            to={`/${domain}/forgot-password`}
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`py-3 rounded-md font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Please wait..." : title}
        </button>

        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>

      <div className="text-center mt-6 text-gray-600">
        <Link
          to={`/${domain}/signup`}
          className="text-blue-500 hover:underline"
        >
          Don't have an account? Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
