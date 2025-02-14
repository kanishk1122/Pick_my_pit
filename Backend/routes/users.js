const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendConfimationEmail , wellcomeEmail } = require("../mailer/mailer");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const {signup_auth , login_auth} = require('../helper/validation_schema.js')
const axios = require("axios");
const { checkSessionId } = require("../helper/Functions");
const Joi = require("joi");
const cloudinary = require('cloudinary').v2;
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
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
    }catch(validationError){
      return res.status(400).json({msg : validationError.details[0].message})
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

    console.log(decryptedPassword, "on login");

    // Compare input password with the hashed password stored
    const passwordMatch = await bcrypt.compare(
      decryptedPassword,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).send({ msg: "Invalid credentials" });
    }

    // Construct user details for response

    const sessionToken = uuidv4();
    user.sessionToken = sessionToken;
    const encryptsessionid = encrypter(sessionToken);

    // Save user session token

    const userdatatoupdate = {
      sessionToken: encryptsessionid,
    };

    await User.findByIdAndUpdate(user._id, userdatatoupdate, {
      new: true,
    }).then((user) => {
      console.log(user);
    });

    const userDetails = {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userpic: user.userpic,
      gender: user.gender,
      status: user.status,
      sessionToken: encryptsessionid,
    };

    res.status(201).json({
      userdata: userDetails,
      msg: "User Login Successfully",
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
    } catch(validtionError){
      return res.status(400).json({msg : validtionError.details[0].message })
    }

    const { firstname, lastname, email, password, gender ,role } = req.body;


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
    });

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
    user.emailConfirm && res.status(200)
    .json({ msg: "Your Email is already confirm" });


    //check if email confirmation token is already genrated or not and if genrated then check the expire date of token if it expire then genrate a new one

    if (
      user.emailConfirmToken && new Date(user.emailConfirmExpires) > new Date()
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
    console.log(err)
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
  gender: Joi.string().valid('male', 'female', 'other'),
  phone: Joi.string().pattern(/^[0-9]{10}$/).allow('').optional(),
  about: Joi.string().max(500).allow(''),
}).min(1); // Ensure at least one field is provided for update

// Update user route
router.put("/update", async (req, res) => {
  try {
    const { userId, profilePic, ...updateFields } = req.body;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
      await checkSessionId(req, userId);
    } catch (authError) {
      return res.status(401).json({ success: false, message: authError.message });
    }

    const { error, value } = updateUserSchema.validate(updateFields, { stripUnknown: true });
    if (error) {
      return res.status(400).json({ success: false, message: error.details[0].message });
    }

    // Remove empty fields
    Object.keys(value).forEach(key => {
      if (value[key] === '') {
        delete value[key];
      }
    });

    if (value.password) {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
    }

    // Handle profile picture upload
    if (profilePic) {
      const result = await cloudinary.uploader.upload(profilePic, {
        folder: 'profile_pictures',
        use_filename: true
      });
      value.userpic = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: value },
      { new: true, select: '-password -emailConfirmToken -emailConfirmExpires' }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.get("/fetch-user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await User.findById(userId).select('-password -emailConfirmToken -emailConfirmExpires');
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
