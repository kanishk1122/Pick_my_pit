const express = require("express");
const router = express.Router();
const Post = require("../model/Post");

// Get all available species from posts
router.get("/", async (req, res) => {
  try {
    const species = await Post.distinct("species", {
      species: { $exists: true, $ne: "" },
    });

    const sortedSpecies = [...new Set(species)]
      .filter((s) => s && s.trim())
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      species: sortedSpecies,
    });
  } catch (error) {
    console.error("Species fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch species",
      error: error.message,
    });
  }
});

// Get species details (including count of breeds and posts)
// THIS IS LIKELY THE PROBLEMATIC ROUTE - Replace object with proper callback
router.get("/details", async (req, res) => {
  try {
    // Get all species
    const speciesList = await Post.distinct("species", {
      species: { $exists: true, $ne: "" },
    });

    // Get counts and details for each species
    const speciesDetails = await Promise.all(
      speciesList.map(async (species) => {
        const postCount = await Post.countDocuments({ species });
        const breeds = await Post.distinct("category", {
          species,
          category: { $exists: true, $ne: "" },
        });

        return {
          name: species,
          postCount,
          breedCount: breeds.length,
          breeds: breeds,
        };
      })
    );

    res.status(200).json({
      success: true,
      speciesDetails,
    });
  } catch (error) {
    console.error("Species details error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch species details",
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
