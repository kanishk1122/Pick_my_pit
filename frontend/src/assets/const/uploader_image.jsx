import { upload } from '@cloudinary/html';

// Define your Cloudinary cloud name and unsigned upload preset
const cloudName = import.meta.env.VITE_REACT_APP_CLOULDDAIRY_NAME;
const uploadPreset = import.meta.env.VITE_REACT_APP_CLOULDDAIRY_NAME; // Replace with your upload preset

// Function to upload an image
const uploadImageToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      console.log('Image uploaded successfully:', data.secure_url);
      return data.secure_url; // The secure URL of the uploaded image
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export { uploadImageToCloudinary };
