const express = require("express");
const router = express.Router();
const Post = require("../model/Post");

// Get breeds by species from existing posts
router.get("/:species", async (req, res) => {
  try {
    const { species } = req.params;
    
    if (!species) {
      return res.status(400).json({
        success: false,
        message: "Species parameter is required"
      });
    }

    // Get unique breeds from category field where species matches
    const breeds = await Post.distinct("category", { 
      species: new RegExp('^' + species + '$', 'i'),
      category: { $exists: true, $ne: "" } 
    });
    
    // Sort and clean up breeds
    const sortedBreeds = [...new Set(breeds)]
      .filter(breed => breed && breed.trim())
      .sort((a, b) => a.localeCompare(b));

    console.log(`Found ${sortedBreeds.length} breeds for species: ${species}`);

    res.status(200).json({
      success: true,
      breeds: sortedBreeds
    });
  } catch (error) {
    console.error('Breeds fetch error:', error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch breeds",
      error: error.message
    });
  }
});

const speciesRoutes = require('./routes/species');
app.use('/api/species', speciesRoutes);

module.exports = router;