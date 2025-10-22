import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../Utils/data.js";
import { UserDataContext } from "../../Context/UserContext.jsx";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import { updateProfileImage } from "../../Utils/uploadImage.js";
import axiosInstance from "../../Utils/axiosInstance.js";
import { API_PATHS } from "../../Utils/apiPaths.js";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(user?.profileImageUrl || null);

  if (!user) return null;

  // Update displayedImage whenever selectedFile or user.profileImageUrl changes
  useEffect(() => {
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setDisplayedImage(preview);
      return () => URL.revokeObjectURL(preview);
    } else {
      setDisplayedImage(user?.profileImageUrl || null);
    }
  }, [selectedFile, user?.profileImageUrl]);

  const handleClick = (route) => {
    if (route === "logout") return handleLogout();
    navigate(route);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
    } catch (err) {
      console.error("Logout Error:", err);
    } finally {
      clearUser();
      navigate("/login");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      const uploadRes = await updateProfileImage(selectedFile, user?.role || "user");

      if (uploadRes?.imageUrl) {
        updateUser({ ...user, profileImageUrl: uploadRes.imageUrl });
        setSelectedFile(null); // Immediately hide upload button
      }
    } catch (err) {
      console.error("Profile image upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center gap-3 mt-3 mb-7">
        {/* Profile Photo Selector */}
        <ProfilePhotoSelector image={displayedImage} setImage={setSelectedFile} />

        {/* Upload button with smooth fade in/out */}
        <div
          className={`transition-all duration-500 ${
            selectedFile ? "opacity-100 h-auto mt-2" : "opacity-0 h-0 mt-0 overflow-hidden"
          }`}
        >
          {selectedFile && (
            <button
              onClick={handleUpload}
              className="py-1 px-3 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition-colors"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          )}
        </div>

        {/* User name */}
        <h5 className="text-gray-950 font-medium leading-6 text-center">
          {user?.name || "User"}
        </h5>

        {/* Side menu buttons */}
        {SIDE_MENU_DATA.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 py-3 px-6 rounded-lg mb-3 transition-all ${
              activeMenu === item.label ? "text-white bg-primary" : ""
            }`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
