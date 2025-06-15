const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const { uploadImage } = require("../utils/cloudinaryConfig");
require("dotenv").config();
const { decrepter } = require("../helper/Functions.js");
const mongoose = require("mongoose");
const { checkSessionId } = require("../helper/Functions.js");

// Add request logging middleware
router.use((req, res, next) => {
  const endpoint = req.originalUrl;
  const userId = req.headers.userid || req.body.userId || "guest";
  const method = req.method;

  console.log(`${method} ${endpoint} | User: ${userId}`);
  next();
});

// Create a new post
router.post("/create", express.json({ limit: "50mb" }), async (req, res) => {
  try {
    console.log("Processing create post request");

    const {
      title,
      discription,
      amount,
      type,
      category,
      species,
      userId,
      addressId,
      images,
      age,
    } = req.body;

    console.log(
      `Creating post for user ID: ${userId}, Address ID: ${addressId}`
    );
    console.log(`Number of images: ${images ? images.length : 0}`);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }

    // Validate required fields
    if (!title || !species || !category) {
      return res.status(400).json({
        success: false,
        message: "Title, species, and category/breed are required",
      });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Process and store images
    let imageUrls = [];

    if (images && images.length > 0) {
      console.log(`Processing ${images.length} images...`);

      try {
        // Process images sequentially to avoid overwhelming Cloudinary
        for (let i = 0; i < Math.min(images.length, 5); i++) {
          const result = await uploadImage(images[i], {
            folder: `pet_posts/${userId}`,
            transformation: [{ width: 1200, height: 800, crop: "limit" }],
          });

          if (result && result.secure_url) {
            imageUrls.push(result.secure_url);
            console.log(
              `✅ Image ${i + 1}/${images.length} uploaded successfully`
            );
          }
        }

        console.log(
          `Uploaded ${imageUrls.length}/${images.length} images successfully`
        );
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        console.warn("Continuing post creation without images");
      }
    }

    // Create the post data
    const postData = {
      owner: user._id,
      title,
      discription,
      amount,
      type,
      category,
      species,
      address: addressId,
      images: imageUrls,
    };

    // Process and normalize the age if provided
    if (age && age.value) {
      postData.age = {
        value: parseInt(age.value),
        unit: age.unit || "months",
      };
    }

    // Create and save the post
    const post = new Post(postData);
    const savedPost = await post.save();

    // Initialize posts array if it doesn't exist
    if (!user.posts) {
      user.posts = [];
    }
    user.posts.push(savedPost._id);
    await user.save();

    console.log(`Post created successfully | Post ID: ${savedPost._id}`);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: savedPost,
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(error.status || 500).json({
      success: false,
      message: "Unable to create post",
      error: error.message,
    });
  }
});

// Get all posts (with pagination)
router.get("/all", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("owner", "firstname lastname userpic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Add formatted ages to the response
    const postsWithFormattedAge = posts.map((post) => {
      const postObj = post.toObject();
      if (post.age && post.age.value) {
        postObj.formattedAge = formatAge(post.age);
      }
      return postObj;
    });

    const total = await Post.countDocuments();

    res.status(200).json({
      success: true,
      posts: postsWithFormattedAge,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch posts",
      error: error.message,
    });
  }
});

// Get all posts with filtering
router.get("/filter", async (req, res) => {
  try {
    console.log("Received filter query:", req.query);
    let {
      species,
      breed,
      type,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    if (species && species !== "undefined" && species !== "") {
      query.species = new RegExp("^" + species.trim() + "$", "i");
    }

    if (breed && breed !== "undefined" && breed !== "") {
      query.category = new RegExp("^" + breed.trim() + "$", "i");
    }

    if (type && type !== "undefined" && type !== "") {
      query.type = type;
    }

    if (type === "paid" || (minPrice && maxPrice)) {
      query.amount = {};
      if (minPrice && minPrice !== "undefined") {
        query.amount.$gte = parseFloat(minPrice);
      }
      if (maxPrice && maxPrice !== "undefined") {
        query.amount.$lte = parseFloat(maxPrice);
      }
    }

    console.log("MongoDB query:", JSON.stringify(query, null, 2));

    const posts = await Post.find(query)
      .populate("owner", "firstname lastname userpic")
      .populate("address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(query);

    console.log(`Found ${posts.length} posts out of ${total} total matches`);

    res.status(200).json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
      filters: { species, breed, type, minPrice, maxPrice },
    });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch posts",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

// Get all free pets
router.get("/free", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ type: "free" })
      .populate("owner", "firstname lastname userpic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ type: "free" });

    res.status(200).json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch free pets",
      error: error.message,
    });
  }
});

// Get all paid pets
router.get("/paid", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ type: "paid" })
      .populate("owner", "firstname lastname userpic")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments({ type: "paid" });

    res.status(200).json({
      success: true,
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch paid pets",
      error: error.message,
    });
  }
});

// Update the breeds route to use the Breed model
router.get("/breeds/:species", async (req, res) => {
  try {
    const { species } = req.params;
    const breeds = await Breed.find({
      species: new RegExp("^" + species + "$", "i"),
    })
      .select("name")
      .sort("name");

    res.status(200).json({
      success: true,
      breeds: breeds.map((breed) => breed.name),
    });
  } catch (error) {
    console.error("Breeds fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch breeds",
      error: error.message,
    });
  }
});

// Get a single post by ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("owner", "firstname lastname userpic")
      .populate("address");

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch post",
      error: error.message,
    });
  }
});

// Get all posts for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("address");

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch user posts",
      error: error.message,
    });
  }
});

// Update a post
router.put("/update/:id", async (req, res) => {
  try {
    const { error, value } = post_update_validation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const { title, discription, amount, type, category, species, userId } =
      value;
    const postId = req.params.id;

    // Verify the session
    try {
      await checkSessionId(req, userId);
    } catch (authError) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        discription,
        amount,
        type,
        category,
        species,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to update post",
      error: error.message,
    });
  }
});

// Delete a post
router.delete("/delete/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.userId; // Get userId from request body

    // Verify the session
    try {
      await checkSessionId(req, userId);
    } catch (authError) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication failed" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Check if the user is the owner of the post
    if (post.owner.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    await Post.findByIdAndDelete(postId);

    // Remove the post reference from the user's posts array
    await User.findByIdAndUpdate(userId, {
      $pull: { posts: postId },
    });

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to delete post",
      error: error.message,
    });
  }
});

// Purchase a pet
router.post("/purchase/:id", async (req, res) => {
  try {
    const { userId } = req.body;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Pet not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Add the pet to user's purchasedPets
    user.purchasedPets.push(postId);
    await user.save();

    // Update the post to mark it as sold
    post.status = "sold";
    await post.save();

    res.status(200).json({
      success: true,
      message: "Pet purchased successfully",
      post: post,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to complete purchase",
      error: error.message,
    });
  }
});

module.exports = router;
