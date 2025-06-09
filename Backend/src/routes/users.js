const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  sendConfimationEmail,
  wellcomeEmail,
} = require("../../mailer/mailer.js");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const {
  signup_auth,
  login_auth,
} = require("../helper/validation_schema.js");
const axios = require("axios");
const { checkSessionId } = require("../helper/Functions.js");
const Joi = require("joi");
const cloudinary = require("cloudinary").v2;
const path = require("path");

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Route to get all users
router.get("/getuser/?:username/?:email", async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ name: req.params.username }, { email: req.params.email }],
    });

    const lemituserdetails = {
      name: users[0].name,
      email: users[0].email,
      userpic: users[0].userpic,
      post: users[0].post,
    };
    res.json(lemituserdetails);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

//login route
router.post("/login", async (req, res) => {
  try {
    try {
      await login_auth.validateAsync(req.body);
    } catch (validationError) {
      return res.status(400).json({ msg: validationError.details[0].message });
    }

    const { email, password } = req.body;

    // Fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    console.log(`Email: ${email} | Login attempt`);

    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    // Compare input password with the hashed password stored
    const passwordMatch = await bcrypt.compare(
      decryptedPassword,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send({ msg: "Invalid credentials" });
    }

    // Check if user is banned
    if (user.status === "banned") {
      return res.status(403).send({ msg: "Account has been banned" });
    }

    const sessionToken = uuidv4();
    const encryptsessionid = encrypter(sessionToken);

    // Update user session token
    await User.findByIdAndUpdate(
      user._id,
      { sessionToken: encryptsessionid },
      { new: true }
    );

    const userDetails = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userpic: user.userpic,
      gender: user.gender,
      status: user.status,
      role: user.role,
      sessionToken: encryptsessionid,
    };

    res.status(200).json({
      userdata: userDetails,
      msg: "Login successful",
      isAdmin: user.role === "admin",
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send({ msg: "Internal server error" });
  }
});

function encrypter(data) {
  const cryptoKey = process.env.CRYPTO_KEY;
  return CryptoJS.AES.encrypt(data, cryptoKey).toString();
}

router.post("/", async (req, res) => {
  try {
    try {
      await signup_auth.validateAsync(req.body);
    } catch (validtionError) {
      return res.status(400).json({ msg: validtionError.details[0].message });
    }

    const { firstname, lastname, email, password, gender, role, referralCode } =
      req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      firstname,
      lastname,
      email,
      password,
      gender,
      role,
      referralCode: uuidv4(), // Generate a unique referral code
    });

    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        referrer.coins += 50; // Add 50 coins to referrer
        await referrer.save();
      }
    }

    // proccing data before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    const sessionToken = uuidv4();
    const emailConfirmToken = uuidv4();
    user.emailConfirmToken = emailConfirmToken;
    user.sessionToken = sessionToken;
    const encryptsessionid = encrypter(sessionToken);
    const token = crypto.randomBytes(20).toString("hex");
    user.emailConfirmToken = token;
    user.emailConfirmExpires = Date.now() + 36000000000000;

    await user.save();

    let userdata = await User.findOne({ email });

    const userDetails = {
      firstname: userdata.firstname,
      lastname: userdata.lastname,
      email: userdata.email,
      userpic: userdata.userpic,
      sessionToken: encryptsessionid,
      status: userdata.status,
      gender: userdata.gender,
      post: userdata.post,
      address: userdata.address,
      phone: userdata.phone,
      about: userdata.about,
    };

    sendConfimationEmail(
      userdata.firstname + " " + userdata.lastname,
      email,
      `${process.env.SERVER_URL}/api/users/confirmation/${userdata._id}/${token}`
    );

    res.status(201).json({
      userdata: userDetails,
      msg: "User created successfully",
    });
  } catch (err) {
    res.status(500).send("Server Error");
    console.log(err);
  }
});

router.get("/resetpassowrd-email/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
    console.log(user);
    res.render("reset-email-template", {
      userName: "kanishk soni",
      resetLink: "https://petshop.example.com/reset?token=123456",
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.patch("/resetpassword/:id", async (req, res) => {
  const { password } = req.body;

  try {
    let user;
    user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.patch("/:id", async (req, res) => {
  const { name, email, password, userpic, address, phone, about } = req.body;

  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (password) userFields.password = password;
  if (userpic) userFields.userpic = userpic;
  if (address) userFields.address = address;
  if (phone) userFields.phone = phone;
  if (about) userFields.about = about;

  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    user
      .set(userFields)
      .save()
      .then(() => res.json(user));
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.get("/confirmationgenrate/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (new Date(user.emailConfirmExpires) < new Date()) {
      console.log("Email confirmation token has expired");
    }

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    //check for already confirm
    user.emailConfirm &&
      res.status(200).json({ msg: "Your Email is already confirm" });

    //check if email confirmation token is already genrated or not and if genrated then check the expire date of token if it expire then genrate a new one

    if (
      user.emailConfirmToken &&
      new Date(user.emailConfirmExpires) > new Date()
    ) {
      return res
        .status(200)
        .json({ msg: "A Confirmation email is already send to your email" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.emailConfirmToken = token;
    //set token expire of one year
    user.emailConfirmExpires = Date.now() + 365 * 24 * 60 * 60 * 1000;

    await user.save().then((user) => {
      sendConfimationEmail(
        user.firstname + " " + user.lastname,
        user.email,
        `${process.env.SERVER_URL}/api/users/confirmation/${user._id}/${token}`
      );
    });

    res.json({ msg: "Confirmation token generated", token });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

router.get("/confirmation/:id/:token", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.emailConfirmToken !== req.params.token) {
      return res.status(400).json({ msg: "Invalid token" });
    }

    const currentTime = new Date().toISOString();
    console.log(currentTime);
    if (user.emailConfirmExpires > currentTime) {
      return res.status(400).json({ msg: "Your link is expire " });
    }

    user.emailConfirm = true;
    user.emailConfirmToken = null;
    if (user.phone != null || user.phone != undefined) {
      user.status = "active";
    } else {
      user.status = "email_confirm";
    }

    await user.save().then((user) => {
      wellcomeEmail(user.firstname + " " + user.lastname, user.email);
    });

    res.json({ msg: "Email confirmed Succesfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

router.delete("/:email", async (req, res) => {
  const email = req.params.email;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    await user.deleteOne();
    res.json({ msg: "User removed" });
  } catch (err) {
    res.status(500).send("Server Error");
    console.log(err);
  }
});

// Update user schema
const updateUserSchema = Joi.object({
  firstname: Joi.string().min(2).max(30),
  lastname: Joi.string().min(2).max(30),
  password: Joi.string().min(6),
  gender: Joi.string().valid("male", "female", "other"),
  phone: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .allow("")
    .optional(),
  about: Joi.string().max(500).allow(""),
}).min(1); // Ensure at least one field is provided for update

// Update user route
router.put("/update", async (req, res) => {
  try {
    const { userId, profilePic, ...updateFields } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    try {
      await checkSessionId(req, userId);
    } catch (authError) {
      return res
        .status(401)
        .json({ success: false, message: authError.message });
    }

    const { error, value } = updateUserSchema.validate(updateFields, {
      stripUnknown: true,
    });
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    // Remove empty fields
    Object.keys(value).forEach((key) => {
      if (value[key] === "") {
        delete value[key];
      }
    });

    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }

    // Handle profile picture upload
    if (profilePic) {
      try {
        const result = await cloudinary.uploader.upload(profilePic, {
          folder: "profile_pictures",
          use_filename: true,
        });
        updateFields.userpic = result.secure_url;
      } catch (uploadError) {
        console.error("Error uploading profile picture:", uploadError);
        return res
          .status(500)
          .json({ success: false, message: "Error uploading profile picture" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: value },
      { new: true, select: "-password -emailConfirmToken -emailConfirmExpires" }
    ).populate("addresses");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userResponse = {
      ...updatedUser.toObject(),
      id: updatedUser._id,
    };
    delete userResponse._id;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/fetch-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId)
      .select("-password -emailConfirmToken -emailConfirmExpires")
      .populate("addresses"); // Populate the addresses field

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userResponse = {
      ...user.toObject(),
      id: user._id,
    };
    delete userResponse._id;

    res.status(200).json({
      success: true,
      user: userResponse,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// Get user profile
router.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("ownedPets", "title images species category")
      .populate("purchasedPets", "title images species category");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        userpic: user.userpic,
        ownedPets: user.ownedPets,
        purchasedPets: user.purchasedPets,
        // ...other fields you want to include
      },
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch user profile",
      error: error.message,
    });
  }
});

// Endpoint to generate referral link
router.get("/generate-referral-link/:userId", async (req, res) => {
  try {
    console.log("Generating referral link for user:", req.params.userId);

    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if user already has a referral code, if not generate one
    if (!user.referralCode) {
      user.referralCode = uuidv4();
      await user.save();
      console.log(
        `Generated new referral code for user ${user._id}: ${user.referralCode}`
      );
    }

    const referralLink = `${process.env.FRONTEND_URL}/signup?referralCode=${user.referralCode}`;
    console.log(referralLink);
    res.status(200).json({ referralLink });
  } catch (err) {
    console.error("Error generating referral link:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Endpoint to fetch referral analytics
router.get("/referral-analytics/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate("referredBy");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const referrals = await User.find({ referredBy: user._id });
    const analytics = await Promise.all(
      referrals.map(async (referral) => {
        const coinsSpent = referral.coins;
        const earnings = coinsSpent * 0.1; // 10% of coins spent
        return {
          userId: referral._id,
          userEmail: referral.email,
          coinsSpent,
          earnings,
        };
      })
    );

    res.status(200).json({ analytics });
  } catch (err) {
    console.error("Error fetching referral analytics:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
