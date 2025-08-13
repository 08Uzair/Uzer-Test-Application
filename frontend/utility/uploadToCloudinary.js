import { toast } from "react-toastify";
import { TOAST } from "./constantToast";

const cloudName = "dyphiefiy";
const uploadPreset = "uzer-ecomm";

export const uploadImageToCloudinary = async (file) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    toast.success(TOAST.CLOUD.SUCCESS_UPLOAD);
    return data.secure_url;
  } catch (error) {
    toast.error(TOAST.CLOUD.ERROR_UPLOAD);
    console.error("Error uploading image:", error);
    return null;
  }
};
