import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../../Utils/axiosInstance.js";
import InputField from "../Inputs/InputField.jsx";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import  { uploadImage }  from "../../Utils/uploadImage.js";
import { useUser } from "../../Context/UserContext.jsx";

const HeadOfCollegeForm = ({
  apiPath,
  domain,
  title,
  redirectTo,
  updateUser,
  profilePic,
  setProfilePic,
}) => {
  const { updateUser: contextUpdateUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    collegeName: "",
    otherCollege: "",
    designation: "Head of College",
    userType: domain,
  });

  const [colleges, setColleges] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch college list from API
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axiosInstance.get("/api/college/list");
        setColleges(res.data.colleges || []);
      } catch (err) {
        console.error("Error fetching college list:", err);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

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
        const uploadRes = await uploadImage(profilePic, domain);
        profileImageUrl = uploadRes?.imageUrl || "";
      }

      const payload = { ...formData, profileImageUrl };
      delete payload.confirmPassword;

      if (payload.collegeName === "Other") {
        payload.collegeName = payload.otherCollege;
        delete payload.otherCollege;
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

        {/* College dropdown */}
        <div className="flex flex-col gap-1">
          <label htmlFor="collegeName" className="text-gray-700 font-medium">
            College Name
          </label>
          <select
            id="collegeName"
            name="collegeName"
            required
            value={formData.collegeName}
            onChange={handleChange}
            className="p-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Select College</option>
            {colleges.map((college, idx) => (
              <option key={idx} value={college}>
                {college}
              </option>
            ))}
            <option value="Other">Other</option>
          </select>
        </div>

        {formData.collegeName === "Other" && (
          <InputField
            label="Other College Name"
            name="otherCollege"
            placeholder="Enter your college name"
            value={formData.otherCollege}
            onChange={handleChange}
          />
        )}

        <InputField
          label="Designation"
          name="designation"
          placeholder="Enter designation"
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

export default HeadOfCollegeForm;
