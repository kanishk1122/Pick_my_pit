const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post.js");
const { post_validation } = require("../helper/validation_schema.js");
require("dotenv").config();
const { decrepter } = require("../helper/Functions.js");

router.get("/get_post/:id", (req, res) => {
  try {
    const post = Post.find(req.params.id).populate(
      "Owner firtname lastname gender email userpic"
    );

    console.log(post);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create_post/:id/:sessionid", async (req, res) => {
  try {
    try {
      await post_validation.validateAsync(req.body);
    } catch (validtionError) {
      res.status(400).json({
        msg: validtionError.details[0].message,
      });
    }

    const sessionid = req.params.sessionid;

    const { title, discription } = req.body;

    const user = await User.find(req.params.id);

    if (user) {
      return res.status(404).json({
        msg: "No user found",
      });
    }

    //decript the session id for check the user is authories or not

    const $decryptedsession_token = decrepter(sessionid);

    if ($decryptedsession_token != user.sessionToken) {
      return res.status(401).json({
        msg: "Unauthorised user",
      });
    }

    const post = new Post({
      owner: user._id,
      title,
      discription,
    });

    const savepost = await post.save();
    const postId = savepost._id;

    user.posts.push({ id: postId, index: user.posts.length });

    await user.save();

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




