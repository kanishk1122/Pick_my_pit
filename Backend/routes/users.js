const express = require("express");
const router = express.Router();
const User = require("../model/User");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendConfimationEmail , wellcomeEmail } = require("../mailer/mailer");
const CryptoJS = require("crypto-js");
require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

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
    const { email, password } = req.body;

    // Fetch user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ msg: "User not found" });
    }

    console.log(`Email: ${email} | Login attempt`);
    const isMatch = await bcrypt.compare(
      "TestPassword456!",
      "$2b$10$QKme3WbEnE7uoOcipvq1juhWucOx5padzJVHWT61Gl6Ve9yJnES7K"
    );
    console.log("Password Match:", isMatch);

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
      msg: "User created successfully",
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
  const { firstname, lastname, email, password, gender, userpic } = req.body;
  try {
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
      userpic,
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

    const newuser = await user.save();


    let userdata = await User.findOne({ email });
    userDetails = {
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
      status: userdata.status,
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

// router.get("verification-email/:id" , async (req, res) => {
//     try {
//         let user = await User.findById(req.params.id);
//         if (!user) {
//             return res.status(404).json({ msg: "User not found" });
//         }
//         res.json(user);
//         res.render('verification-email-template', {
//             userName: 'kanishk soni',
//             verificationLink: 'https://petshop.example.com/verify?token=123456',
//         });
//     } catch (err) {
//         res.status(500).send("Server Error");
//     }
// }

// );

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


router.patch("/confirmationgenrate/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    console.log("hi i run");
    // console.log(user);
    // console.log(req.params.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if (
      user.emailConfirmToken !== null ||
      user.emailConfirmToken !== undefined
    ) {
      return res
        .status(200)
        .json({ msg: "A Confirmation email is already send to your email" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.emailConfirmToken = token;
    user.emailConfirmExpires = Date.now() + 3600000;
    await user.save().then((user) => {
      sendConfimationEmail(
        firstname + " " + lastname,
        email,
        `${process.env.SERVER_URL}/api/users/confirmation/${user._id}/${token}`
      );
    });

    res.json({ msg: "Confirmation token generated", token });
  } catch (err) {
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

    res.json({ msg: "Email confirmed" });
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

module.exports = router;