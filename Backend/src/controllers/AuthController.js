const { OAuth2Client } = require("google-auth-library");
const CryptoJS = require("crypto-js");
const uuidv4 = require("uuid").v4;
const User = require("../model/User.js");
const axios = require("axios");
require("dotenv").config();

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Utility function to encrypt data
 */
function encrypter(data) {
  const cryptoKey = process.env.CRYPTO_KEY;
  return CryptoJS.AES.encrypt(data, cryptoKey).toString();
}

/**
 * Handle Google Authentication
 */
exports.googleAuth = async (req, res) => {
  try {
    const { token, referralCode } = req.body;

    console.log(
      `Processing Google Auth - Token segments: ${token.split(".").length}`
    );

    // Verify the Google Token
    const googleResponse = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { email, name, picture, given_name, family_name } =
      googleResponse.data;

    console.log(
      `Google Auth for: ${email}, Name: ${given_name} ${family_name}`
    );

    // Check if user exists in the database
    let user = await User.findOne({ email });
    let isNewUser = false;

    if (!user) {
      console.log(`Creating new user for: ${email}`);
      // Create new user (sign-up flow)
      user = new User({
        firstname: given_name,
        lastname: family_name || "",
        email,
        userpic: picture,
        emailConfirm: true,
        referralCode: uuidv4(), // Generate a unique referral code
      });

      // Process referral if provided
      if (referralCode) {
        await handleReferral(user, referralCode);
      }

      await user.save();
      isNewUser = true;
    } else if (referralCode && !user.referredBy) {
      // Handle referral for existing Google Auth users
      await handleReferral(user, referralCode);
      await user.save();
    }

    // Generate and encrypt session token
    const sessionToken = uuidv4();
    const encryptedSessionToken = encrypter(sessionToken);

    // Save the updated session token
    await User.findByIdAndUpdate(
      user._id,
      { sessionToken: encryptedSessionToken },
      { new: true }
    );

    // Prepare user details for the response
    const userDetails = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userpic: user.userpic,
      gender: user.gender,
      status: user.status || "active",
      sessionToken: encryptedSessionToken,
      coins: user.coins || 0,
    };

    // Send response
    res.status(isNewUser ? 201 : 200).json({
      userdata: userDetails,
      msg: isNewUser
        ? "User signed up successfully"
        : "User logged in successfully",
    });
  } catch (err) {
    console.error("Error during Google authentication:", err);

    // Provide a more detailed error response
    let errorMessage = "Internal server error";
    let statusCode = 500;

    if (err.response) {
      // Google API error
      statusCode = err.response.status;
      errorMessage = `Google API error: ${
        err.response.data?.error || err.message
      }`;
    } else if (err.request) {
      // Network error
      errorMessage = "Network error while contacting Google";
    }

    res.status(statusCode).json({
      success: false,
      msg: errorMessage,
    });
  }
};

/**
 * Handle referral processing
 */
async function handleReferral(user, referralCode) {
  try {
    const referrer = await User.findOne({ referralCode });
    if (referrer && referrer._id.toString() !== user._id.toString()) {
      user.referredBy = referrer._id;
      referrer.coins = (referrer.coins || 0) + 50; // Add 50 coins to referrer
      await referrer.save();
      console.log(
        `Referral processed: User ${user.email} referred by ${referrer.email}`
      );
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error processing referral:", error);
    return false;
  }
}

/**
 * Verify session token
 */
exports.verifySession = async (req, res) => {
  try {
    const { userId, sessionToken } = req.body;

    if (!userId || !sessionToken) {
      return res.status(400).json({
        success: false,
        message: "User ID and session token required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the session token matches
    if (user.sessionToken !== sessionToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid session",
      });
    }

    res.status(200).json({
      success: true,
      message: "Session valid",
    });
  } catch (error) {
    console.error("Session verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
