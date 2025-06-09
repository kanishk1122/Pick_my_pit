const CryptoJS = require("crypto-js");
require("dotenv").config();
const User = require("../model/User");

const decrepter = (data) => {
  return CryptoJS.AES.decrypt(data, process.env.CRYPTO_KEY).toString(
    CryptoJS.enc.Utf8
  );
};

const checkSessionId = async (req, userId) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No bearer token provided');
    }

    // Extract the token
    const token = authHeader.split(' ')[1];
    
    // Get user's stored session token
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Compare tokens
    if (token !== user.sessionToken) {
      throw new Error('Invalid session token');
    }

    return true;
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

const getUserSessionToken = async (id) => {
  const user = await User.findById(id);
  try {
    if (!user) {
      return null;
    }
    return user.sessionToken;
  } catch (error) {
    console.log("User", user);
    console.error("Error fetching session token:", error);
    throw error;
  }
};

module.exports = {
  decrepter,
  checkSessionId,
};
