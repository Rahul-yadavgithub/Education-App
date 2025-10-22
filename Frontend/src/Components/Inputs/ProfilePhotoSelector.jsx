import React, { useRef, useState, useEffect } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

const ProfilePhotoSelector = ({ image, setImage }) => {
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

  const handleRemoveImage = () => setImage(null);

  const onChooseFile = () => inputRef.current.click();

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />

      {!previewUrl ? (
        // Placeholder for no image
        <div
          onClick={onChooseFile}
          className="w-20 h-20 flex items-center justify-center bg-purple-100 rounded-full cursor-pointer relative hover:bg-purple-200 transition-colors duration-300"
        >
          <LuUser className="text-4xl text-primary" />
          <div className="absolute -bottom-1 -right-1 w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full shadow-md transition-transform duration-300">
            <LuUpload />
          </div>
        </div>
      ) : (
        // Existing image with hover effect
        <div
          className="relative w-20 h-20 rounded-full overflow-hidden cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border border-gray-300"
            onClick={onChooseFile} // Click to change photo
          />

          {/* Trash button with fade + scale + delayed color fill */}
          <button
            type="button"
            onClick={handleRemoveImage}
            className={`absolute bottom-1 right-1 w-8 h-8 flex items-center justify-center rounded-full shadow-md
                        transform transition-all duration-500
                        ${hovered ? "opacity-100 scale-100 bg-red-500" : "opacity-0 scale-75 bg-red-300"}
                        hover:bg-red-600`}
            style={{ transitionProperty: "opacity, transform, background-color" }}
          >
            <LuTrash size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
