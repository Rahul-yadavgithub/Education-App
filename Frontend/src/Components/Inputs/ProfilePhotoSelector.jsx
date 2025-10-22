import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage, uploading = false }) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [hovered, setHovered] = useState(false);

  // Update previewUrl whenever `image` changes
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
    } else if (typeof image === "string") {
      setPreviewUrl(image);
    } else {
      const preview = URL.createObjectURL(image);
      setPreviewUrl(preview);
      return () => URL.revokeObjectURL(preview);
    }
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  const onChooseFile = () => inputRef.current.click();

  return (
    <div className="relative w-24 h-24">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {/* Avatar */}
      <div
        className="w-24 h-24 rounded-full overflow-hidden shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onChooseFile}
      >
        {!previewUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-purple-100">
            <LuUser className="text-4xl text-primary" />
          </div>
        ) : (
          <img
            src={previewUrl}
            alt="Profile"
            className={`w-full h-full object-cover rounded-full transition-opacity duration-500 ${
              uploading ? "opacity-60" : "opacity-100"
            }`}
          />
        )}

        {/* Camera Overlay */}
        {hovered && !uploading && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full transition-opacity duration-300">
            <LuUpload className="text-white text-2xl animate-bounce" />
          </div>
        )}

        {/* Uploading Spinner */}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
            <div className="w-6 h-6 border-4 border-white border-t-transparent border-b-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePhotoSelector;
