const Breed = require("../model/breed");
const Species = require("../model/Species");
const mongoose = require("mongoose");

/**
 * Get all breeds
 */
exports.getAllBreeds = async (req, res) => {
  try {
    const breeds = await Breed.find({ active: true })
      .populate("species", "name displayName")
      .sort("name");

    res.status(200).json({
      success: true,
      breeds: breeds.map((breed) => ({
        _id: breed._id,
        name: breed.name,
        description: breed.description,
        speciesId: breed.species._id,
        speciesName: breed.species.displayName,
      })),
    });
  } catch (error) {
    console.error("Error fetching breeds:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch breeds",
      error: error.message,
    });
  }
};

/**
 * Get breeds by species (using either species ID or name)
 */
exports.getBreedsBySpecies = async (req, res) => {
  try {
    const { species } = req.params;
    let speciesFilter;

    // Check if the species param is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(species)) {
      speciesFilter = { species: species };
    } else {
      // Try to find the species by name
      const speciesDoc = await Species.findOne({
        $or: [
          { name: new RegExp(`^${species}$`, "i") },
          { displayName: new RegExp(`^${species}$`, "i") },
        ],
      });

      if (!speciesDoc) {
        return res.status(404).json({
          success: false,
          message: "Species not found",
        });
      }

      speciesFilter = { species: speciesDoc._id };
    }

    const breeds = await Breed.find({
      ...speciesFilter,
      active: true,
    }).sort("name");

    res.status(200).json({
      success: true,
      breeds: breeds.map((breed) => ({
        _id: breed._id,
        name: breed.name,
        description: breed.description,
      })),
    });
  } catch (error) {
    console.error(
      `Error fetching breeds for species ${req.params.species}:`,
      error
    );
    res.status(500).json({
      success: false,
      message: "Unable to fetch breeds",
      error: error.message,
    });
  }
};

/**
 * Get breed by ID
 */
exports.getBreedById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid breed ID format",
      });
    }

    const breed = await Breed.findById(id).populate(
      "species",
      "name displayName"
    );

    if (!breed) {
      return res.status(404).json({
        success: false,
        message: "Breed not found",
      });
    }

    res.status(200).json({
      success: true,
      breed: {
        _id: breed._id,
        name: breed.name,
        description: breed.description,
        characteristics: breed.characteristics,
        species: {
          _id: breed.species._id,
          name: breed.species.name,
          displayName: breed.species.displayName,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching breed:", error);
    res.status(500).json({
      success: false,
      message: "Unable to fetch breed",
      error: error.message,
    });
  }
};
