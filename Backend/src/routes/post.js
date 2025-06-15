const express = require("express");
const router = express.Router();
const User = require("../model/User");
const Post = require("../model/Post");
const Breed = require("../model/breed");
const { normalizeAge, formatAge } = require("../utils/ageHelper");
const {
  post_validation,
  post_update_validation,
} = require("../helper/validation_schema.js");
require("dotenv").config();
const { decrepter } = require("../helper/Functions.js");
const Route = require("express/lib/router/route.js");
const mongoose = require("mongoose");
const { checkSessionId } = require("../helper/Functions.js");
const { cloudinary, isConfigured } = require("../utils/cloudinaryConfig");
const fs = require("fs").promises;
const path = require("path");

// Check Cloudinary configuration at startup
if (!isConfigured) {
  console.warn(
    "⚠️ Cloudinary is not properly configured. Image uploads may fail."
  );
}

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
      error: error.message,
    });
  }
});

// Create a new post
router.post("/create", async (req, res) => {
  try {
    const { error, value } = post_validation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

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
      age, // Age object containing value and unit
    } = value;

    console.log(`API requested: ${userId} ${addressId}`);

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Process and store images
    let imageUrls = [];

    if (images && images.length > 0) {
      try {
        // Check if Cloudinary is properly configured
        if (isConfigured) {
          console.log(`Uploading ${images.length} images to Cloudinary...`);
          // Upload images to Cloudinary
          const imageUploadPromises = images.map((image) =>
            cloudinary.uploader.upload(image, {
              folder: "pet_posts",
              resource_type: "auto",
            })
          );

          const uploadedImages = await Promise.all(imageUploadPromises);
          imageUrls = uploadedImages.map((image) => image.secure_url);
          console.log("Images uploaded successfully to Cloudinary");
        } else {
          // Fallback: Use base64 images directly
          console.warn("Cloudinary not configured. Using image data directly.");
          imageUrls = images.slice(0, 5); // Limit to 5 images
        }
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);

        // Fallback: Still create the post without images
        console.warn(
          "Continuing post creation without images due to upload error"
        );
        imageUrls = [];
      }
    }

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
      // Normalize the age to the most appropriate unit
      try {
        const normalizedAge = normalizeAge(age.value, age.unit);
        postData.age = normalizedAge;
      } catch (ageError) {
        console.warn("Error normalizing age:", ageError);
        postData.age = age; // Use original age value
      }
    }

    const post = new Post(postData);
    const savedPost = await post.save();

    // Initialize posts array if it doesn't exist
    if (!user.posts) {
      user.posts = [];
    }
    user.posts.push(savedPost._id);
    await user.save();

    // Get formatted age for response
    let formattedAgeText = "";
    if (savedPost.age && savedPost.age.value) {
      try {
        formattedAgeText = formatAge(savedPost.age);
      } catch (formatError) {
        formattedAgeText = `${savedPost.age.value} ${savedPost.age.unit}`;
      }
    }

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: {
        ...savedPost.toObject(),
        formattedAge: formattedAgeText,
      },
    });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({
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

    page = parseInt(page);
    limit = parseInt(limit);
    const skip = (page - 1) * limit;

    let query = {};

    if (species) query.species = new RegExp("^" + species.trim() + "$", "i");
    if (breed) query.category = new RegExp("^" + breed.trim() + "$", "i");
    if (type) query.type = type;

    if (type === "paid" && (minPrice || maxPrice)) {
      query.amount = {};
      if (minPrice) query.amount.$gte = parseFloat(minPrice);
      if (maxPrice) query.amount.$lte = parseFloat(maxPrice);
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
