import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance.js";
import InputField from "../Inputs/InputField.jsx";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import  uploadImage  from "../../Utils/uploadImage.js";
import { useUser } from "../../Context/UserContext.jsx";

const TeacherForm = ({
  apiPath,
  domain,
  title,
  redirectTo,
  updateUser,
  profilePic,
  setProfilePic,
}) => {
  const { updateUser: contextUpdateUser } = useUser(); // fallback if updateUser not passed
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    domain: "",
    otherDomain: "",
    dateOfJoining: "",
    employeeId: "",
    userType: domain,
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      let profileImageUrl = "";
      if (profilePic) {
        const uploadRes = await uploadImage(profilePic);
        profileImageUrl = uploadRes?.imageUrl || "";
      }

      const payload = { ...formData, profileImageUrl };
      delete payload.confirmPassword;

      if (payload.domain === "Other") {
        payload.domain = payload.otherDomain;
        delete payload.otherDomain;
      }

      payload.userType = domain;

      const res = await axiosInstance.post(apiPath, payload);

      const userData = res?.data?.user;
      if (userData) {
        if (updateUser) updateUser(userData);
        else contextUpdateUser(userData);
      }

      setMessage(res?.data?.message || "Signup successful!");
      setTimeout(() => navigate(redirectTo || `/${domain}/home`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg">
      {title && (
        <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Profile photo picker */}
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <InputField
          label="Full Name"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Confirm password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        {/* Domain selector */}
        <div className="flex flex-col gap-1">
          <label htmlFor="domain" className="text-gray-700 font-medium">
            Domain
          </label>
          <select
            id="domain"
            name="domain"
            required
            value={formData.domain}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select Domain</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="Computer">Computer</option>
            <option value="History">History</option>
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Art">Art</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.domain === "Other" && (
          <InputField
            label="Other Domain"
            name="otherDomain"
            placeholder="Specify other domain"
            value={formData.otherDomain}
            onChange={handleChange}
          />
        )}

        <InputField
          label="Date of Joining"
          name="dateOfJoining"
          type="date"
          value={formData.dateOfJoining}
          onChange={handleChange}
        />

        <InputField
          label="Employee ID"
          name="employeeId"
          placeholder="Enter Employee ID"
          value={formData.employeeId}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
      </form>

      <div className="text-center mt-4 text-gray-600">
        <Link
          to={redirectTo.replace("signup", "login")}
          className="text-blue-500 hover:underline"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default TeacherForm;
