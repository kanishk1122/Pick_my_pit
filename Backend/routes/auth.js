const express = require("express");
const { OAuth2Client } = require("google-auth-library");
const CryptoJS = require("crypto-js");
const uuidv4 = require("uuid").v4;
const User = require("../model/User.js"); // Adjust to your actual User model path
const axios = require("axios")

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Google Auth Route
router.post("/google-auth", async (req, res) => {
  try {
    const { token } = req.body;

    console.log(token.split('.').length)

    // Verify the Google Token
    const googleResponse = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


    const { email, name, picture ,given_name , family_name } = googleResponse.data;

    // Check if user exists in the database
    let user = await User.findOne({ email });

    let isNewUser = false;

    console.log(given_name , family_name )

    if (!user) {
      // Create new user (sign-up flow)
      user = new User({
        firstname : given_name,
        lastname: family_name || "",
        email,
        userpic: picture,
        emailConfirm : true,
      });

      await user.save();

      isNewUser = true;
    }



    // Generate session token
    const sessionToken = uuidv4();
    user.sessionToken = sessionToken;

    // Encrypt session token
    const encryptedSessionToken = encrypter(sessionToken);

    // Save or update the user in the database
    await User.findByIdAndUpdate(
      user._id,
      { sessionToken: encryptedSessionToken },
      { new: true, upsert: true }
    );

    // Prepare user details for the response
    const userDetails = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userpic: user.userpic,
      gender: user.gender,
      status: user.status || "active",
      sessionToken: encryptedSessionToken,
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
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Utility function to encrypt data
function encrypter(data) {
  const cryptoKey = process.env.CRYPTO_KEY;
  return CryptoJS.AES.encrypt(data, cryptoKey).toString();
}

module.exports = router;
