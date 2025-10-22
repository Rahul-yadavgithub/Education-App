import { API_PATHS } from "./apiPaths";

import axiosInstance from "./axiosInstance";

export const uploadImage = async (imageFile, domain) => {
  const formData = new FormData();

  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post(
      API_PATHS.IMAGE.UPLOAD_IMAGE(domain),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.url) {
      return { 
        imageUrl: response.data.url ,
        userType : response.data.userType
      };
    }

    return response.data; 
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};


export const updateProfileImage = async (imageFile, domain) => {
  if (!imageFile) throw new Error("No image file provided");
  if (!domain) throw new Error("User domain is required");

  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    // PUT request to update existing profile image
    const response = await axiosInstance.put(
      API_PATHS.IMAGE.UPDATE_PROFILE_IMAGE(domain),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      }
    );

    if (response.data?.url) {
      return {
        imageUrl: response.data.url,
        userType: domain,
      };
    }

    throw new Error("Profile image update failed");
  } catch (error) {
    console.error("Error updating profile image:", error);
    throw error;
  }
};

// export default { updateProfileImage, uploadImage };


