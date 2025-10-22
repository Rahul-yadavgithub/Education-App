import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance.js";
import InputField from "../Inputs/InputField.jsx";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import { uploadImage } from "../../Utils/uploadImage.js";
import { useUser } from "../../Context/UserContext.jsx";

const HeadOfDistrictForm = ({ apiPath, domain, title, redirectTo }) => {
  const { updateUser } = useUser();
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ---------- Form state ----------
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    districtName: "",
    officeId: "",
    designation: "Head of District",
  });

  // ---------- Handle Input ----------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // ---------- Handle Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.districtName.trim()) {
      setError("District Name is required");
      return;
    }
    if (!formData.officeId.trim()) {
      setError("Office ID is required");
      return;
    }

    setLoading(true);
    try {
      // Upload profile image if selected
      let profileImageUrl = "";
      if (profilePic) {
        const uploadRes = await uploadImage(profilePic, domain);
        profileImageUrl = uploadRes?.imageUrl || "";
      }

      // Prepare payload
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        districtName: formData.districtName,
        officeId: formData.officeId,
        designation: formData.designation,
        profileImageUrl,
        userType: domain,
      };

      const res = await axiosInstance.post(apiPath, payload);

      if (res?.data?.user) {
        updateUser(res.data.user);
      }

      setMessage(res?.data?.message || "Signup successful!");
      setTimeout(() => navigate(redirectTo || `/${domain.toLowerCase()}/login`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------- JSX ----------
  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white/70 backdrop-blur-md rounded-2xl shadow-lg">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {title}
        </h2>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Profile photo */}
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <InputField
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
        />

        <InputField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
        />

        <InputField
          label="District Name"
          name="districtName"
          value={formData.districtName}
          onChange={handleChange}
        />

        <InputField
          label="Office ID"
          name="officeId"
          value={formData.officeId}
          onChange={handleChange}
        />

        <InputField
          label="Designation"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className={`py-3 bg-blue-500 text-white rounded-md font-semibold hover:bg-blue-600 transition-all ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-500 text-center">{message}</p>}
      </form>

      <div className="text-center mt-6 text-gray-600">
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

export default HeadOfDistrictForm;
