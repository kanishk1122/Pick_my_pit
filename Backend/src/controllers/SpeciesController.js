const Species = require("../model/Species");
const Breed = require("../model/breed");
const mongoose = require("mongoose");

/**
 * Get all species with their associated breeds
 */
exports.getAllSpecies = async (req, res) => {
  try {
    // Get all active species
    const species = await Species.find({ active: true }).sort({
      popularity: -1,
      displayName: 1,
    });

    // Enhanced response with counts and structured data
    const result = await Promise.all(
      species.map(async (specie) => {
        // Count associated breeds
        const breedCount = await Breed.countDocuments({
          species: specie._id,
          active: true,
        });

        return {
          _id: specie._id,
          name: specie.name,
          displayName: specie.displayName,
          description: specie.description,
          icon: specie.icon,
          breedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      species: result,
    });
  } catch (error) {
    console.error("Error fetching species:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch species",
      error: error.message,
    });
  }
};

/**
 * Get species by ID with its breeds
 */
exports.getSpeciesById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid species ID format",
      });
    }

    const species = await Species.findById(id);

    if (!species) {
      return res.status(404).json({
        success: false,
        message: "Species not found",
      });
    }

    // Get breeds associated with this species
    const breeds = await Breed.find({
      species: species._id,
      active: true,
    }).sort("name");

    res.status(200).json({
      success: true,
      species: {
        ...species.toObject(),
        breeds: breeds.map((breed) => ({
          _id: breed._id,
          name: breed.name,
          description: breed.description,
          characteristics: breed.characteristics,
        })),
      },
    });
  } catch (error) {
    console.error("Error fetching species details:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch species details",
      error: error.message,
    });
  }
};

/**
 * Get complete species hierarchy
 */
exports.getSpeciesHierarchy = async (req, res) => {
  try {
    // Get all active species
    const species = await Species.find({ active: true }).sort({
      popularity: -1,
      displayName: 1,
    });

    // Build the hierarchical data structure
    const hierarchy = await Promise.all(
      species.map(async (specie) => {
        // Get breeds for this species
        const breeds = await Breed.find({
          species: specie._id,
          active: true,
        }).sort("name");

        return {
          _id: specie._id,
          name: specie.name,
          displayName: specie.displayName,
          description: specie.description,
          icon: specie.icon,
          breeds: breeds.map((breed) => ({
            _id: breed._id,
            name: breed.name,
            description: breed.description,
            characteristics: breed.characteristics,
          })),
        };
      })
    );

    res.status(200).json({
      success: true,
      hierarchy,
    });
  } catch (error) {
    console.error("Error fetching species hierarchy:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch species hierarchy",
      error: error.message,
    });
  }
};
