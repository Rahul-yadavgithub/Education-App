import { API_PATHS } from "./apiPaths";

import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile, domain) => {
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
      return { imageUrl: response.data.url };
    }

    return response.data; 
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export default uploadImage;
