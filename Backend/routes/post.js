const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const { post_validation } = require("../helper/validation_schema.js");
require("dotenv").config();
const { decrepter  } = require("../helper/Functions.js");
const Route = require("express/lib/router/route.js");
const mongoose = require("mongoose");
const { checkSessionId } = require("../helper/Functions.js");

// Add middleware to check session for all routes
router.use(async (req, res, next) => {
  try {
    const userId = req.params.userId || req.body.userId;
    if (userId) {
      await checkSessionId(req, userId);
    }
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
});


router.get("/get_post/:id", async (req, res) => {
  try {
    console.log("hi")
    const post = await Post.findById(req.params.id).populate(
      "Owner firtname lastname gender email userpic"
    );

    console.log(post);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create_post", async (req, res) => {
  try {
    try {
      await post_validation.validateAsync(req.body);
    } catch (validtionError) {
      return res.status(400).json({
        msg: validtionError.details[0].message,
      });
    }

    const { title, discription, amount, type, category, species ,sessionid , userid } = req.body;

    const userId = userid;
    console.log(userId)
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        msg: "Invalid user ID",
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        msg: "No user found",
      });
    }

    // //decript the session id for check the user is authories or not

    // const $decryptedsession_token = decrepter(sessionid);


    // //send decryted  session token on first params and on secound send user for session id

   const post = new Post({ 
      owner: user._id,
      title,
      discription,
      amount,
      type,
      category,
      species,
    });

    const savepost = await post.save();
    const postId = savepost._id;
    user.post.push({ id: postId, index: user.post.length });

    await user.save();

    console.log(post)
    await post.save();

    res.status(201).json({
        msg : "post created successfully"
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg : "unable to process",
      error : error
    })
  }
});


module.exports = router;


