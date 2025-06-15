const express = require("express");
const router = express.Router();
const breedsController = require("../controllers/BreedsController");

// Get all breeds
router.get("/", breedsController.getAllBreeds);

// Get breeds by species
router.get("/:species", breedsController.getBreedsBySpecies);

// Get specific breed by ID
router.get("/detail/:id", breedsController.getBreedById);


// The problem is likely around line 49 - remove or fix any invalid route definition
// For example, if you have something like:
// router.get('/something', { handler: function() {} });
// Change it to:
// router.get('/something', function(req, res) { ... });

// Get all breeds (without filtering by species)
router.get("/", async (req, res) => {
  try {
    const breeds = await Post.distinct("category", {
      category: { $exists: true, $ne: "" },
    });

    const sortedBreeds = [...new Set(breeds)]
      .filter((breed) => breed && breed.trim())
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      success: true,
      breeds: sortedBreeds,
    });
  } catch (error) {
    console.error("All breeds fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch breeds",
      error: error.message,
    });
  }
});

module.exports = router;
