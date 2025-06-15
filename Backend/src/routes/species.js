const express = require("express");
const router = express.Router();
const speciesController = require("../controllers/SpeciesController");
const Post = require("../model/Post");

// Get all species
router.get("/", speciesController.getAllSpecies);

// Get species hierarchy (with breeds)
router.get("/hierarchy", speciesController.getSpeciesHierarchy);

// Get species by ID
router.get("/:id", speciesController.getSpeciesById);

// Get posts by species (keeping this from the original)
router.get("/:species/posts", async (req, res) => {
  try {
    const { species } = req.params;
    const { limit = 10, page = 1, sort = "createdAt" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find({
      species: new RegExp("^" + species + "$", "i"),
    })
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      species: new RegExp("^" + species + "$", "i"),
    });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Species posts error:", error);
    res.status(500).json({
      success: false,
      message: `Unable to fetch posts for species: ${req.params.species}`,
      error: error.message,
    });
  }
});


// Get posts by species
router.get("/:species/posts", async (req, res) => {
  try {
    const { species } = req.params;
    const { limit = 10, page = 1, sort = "createdAt" } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const posts = await Post.find({
      species: new RegExp("^" + species + "$", "i"),
    })
      .sort({ [sort]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Post.countDocuments({
      species: new RegExp("^" + species + "$", "i"),
    });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Species posts error:", error);
    res.status(500).json({
      success: false,
      message: `Unable to fetch posts for species: ${req.params.species}`,
      error: error.message,
    });
  }
});

module.exports = router;
