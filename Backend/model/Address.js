const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    country: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    district: { type: String, required: true },
    street: { type: String, required: true },
    building: { type: String, required: true },
    floor: { type: String, required: true },
    location: { type: String, required: true }
});

module.exports = AddressSchema; // Export just the schema, not the model
