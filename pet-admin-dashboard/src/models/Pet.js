const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  species: {
    type: String,
    required: true
  },
  breed: String,
  age: Number,
  owner: {
    name: String,
    email: String,
    phone: String
  },
  medicalHistory: [{
    date: Date,
    description: String,
    treatment: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Pet', petSchema);
