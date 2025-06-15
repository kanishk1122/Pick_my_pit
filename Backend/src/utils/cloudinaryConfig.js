const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// Check if Cloudinary credentials are available
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
};

// Configure Cloudinary with environment variables
const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    console.warn("⚠️ Cloudinary environment variables are not set properly.");
    console.warn(
      "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file"
    );
    return false;
  }

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    return true;
  } catch (error) {
    console.error("Error configuring Cloudinary:", error);
    return false;
  }
};

// Initialize configuration
const isConfigured = configureCloudinary();

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
  isConfigured,
};
