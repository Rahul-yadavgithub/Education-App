// frontend/src/Components/Layout/SideMenu.jsx
import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA } from "../../Utils/data.js";
import { UserDataContext } from "../../Context/UserContext.jsx";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector.jsx";
import { updateProfileImage } from "../../Utils/uploadImage.js";
import axiosInstance from "../../Utils/axiosInstance.js";
import { API_PATHS } from "../../Utils/apiPaths.js";
import { LuCamera, LuLogOut } from "react-icons/lu";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [displayedImage, setDisplayedImage] = useState(user?.profileImageUrl || null);

  if (!user) return null;

  // Instant preview of the selected file
  useEffect(() => {
    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setDisplayedImage(preview);
      return () => URL.revokeObjectURL(preview);
    } else {
      setDisplayedImage(user?.profileImageUrl || null);
    }
  }, [selectedFile, user?.profileImageUrl]);

  // Auto-upload when file is selected
  useEffect(() => {
    if (!selectedFile) return;

    const uploadImage = async () => {
      try {
        setUploading(true);
        const uploadRes = await updateProfileImage(selectedFile, user?.role || "user");
        if (uploadRes?.imageUrl) {
          updateUser({ ...user, profileImageUrl: uploadRes.imageUrl });
          setSelectedFile(null);
        }
      } catch (err) {
        console.error("Profile image upload failed:", err);
      } finally {
        setUploading(false);
      }
    };

    uploadImage();
  }, [selectedFile]);

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

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 p-5 sticky top-[61px] z-20">
      <div className="flex flex-col items-center gap-4 mt-3 mb-7">
        {/* Profile Photo Selector */}
        <ProfilePhotoSelector
          image={displayedImage}
          setImage={setSelectedFile}
        />

        {/* User name */}
        <h5 className="text-gray-950 font-semibold leading-6 text-center text-lg">
          {user?.name || "User"}
        </h5>

        {/* Sidebar menu buttons */}
        <div className="w-full mt-6 flex flex-col gap-2">
          {SIDE_MENU_DATA.map((item, index) => (
            <button
              key={`menu_${index}`}
              className={`w-full flex items-center gap-4 py-3 px-5 rounded-lg transition-all duration-300 hover:bg-gray-100 ${
                activeMenu === item.label ? "text-white bg-primary" : "text-gray-700"
              }`}
              onClick={() => handleClick(item.path)}
            >
              <item.icon className="text-xl" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="mt-auto w-full flex items-center gap-3 py-3 px-5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
        >
          <LuLogOut className="text-xl" /> Logout
        </button>
      </div>
    </div>
  );
};

export default SideMenu;
