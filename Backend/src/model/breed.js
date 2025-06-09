const mongoose = require("mongoose");

const BreedSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  species: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Species",
    required: true,
  },
  speciesName: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
  characteristics: [
    {
      type: String,
    },
  ],
  active: {
    type: Boolean,
    default: true,
  },
  popularity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create compound index for efficient querying
BreedSchema.index({ species: 1, name: 1 }, { unique: true });

const Breed = mongoose.model("Breed", BreedSchema);

module.exports = Breed;
