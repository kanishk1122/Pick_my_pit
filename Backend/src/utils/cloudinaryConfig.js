const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Cloudinary credentials - using values from frontend env
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "drqnhnref";
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "295777375369772";
const CLOUDINARY_API_SECRET =
  process.env.CLOUDINARY_API_SECRET || "yxIcb68RMTLXESOhiAOx5NJFVOQ";

// Configure Cloudinary with the retrieved credentials
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true,
});

console.log(`Cloudinary configured with cloud name: ${CLOUDINARY_CLOUD_NAME}`);

/**
 * Uploads an image to Cloudinary with proper error handling
 * @param {String} imageData - Base64 image data
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} - Upload result or null if failed
 */
const uploadImage = async (imageData, options = {}) => {
  try {
    console.log("Uploading image to Cloudinary...");

    const defaultOptions = {
      folder: "pet_posts",
      resource_type: "auto",
      timeout: 60000, // 60 seconds timeout
    };

    const result = await cloudinary.uploader.upload(imageData, {
      ...defaultOptions,
      ...options,
    });

    console.log(`Image uploaded successfully. Public ID: ${result.public_id}`);
    return result;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    return null;
  }
};

module.exports = {
  cloudinary,
  uploadImage,
};
