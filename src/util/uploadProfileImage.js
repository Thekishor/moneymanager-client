import {API_ENDPOINT} from "./apiEndpoints.js";

const CLOUDINARY_UPLOAD_PRESET = "money-manager";

const uploadProfileImage = async (image) => {
    const formData = new FormData();
    formData.append("image", image);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
        const response = await fetch(API_ENDPOINT.UPLOAD_IMAGE, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorData = response.json();
            throw new Error(`Cloud upload failed: ${errorData.error.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("Image uploaded successfully.");
        return data.secure_url;
    } catch (error) {
        console.error("Error in upload profile image", error);
        throw error;
    }
}

export default uploadProfileImage;