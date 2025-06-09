const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    latitude: {
      type: Number,
    },
    longitude: {
      type: Number,
    },
    landmark: {
      type: String,
    },
    postalCode: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Add your postal code validation regex here
          return /^\d{6}$/.test(v); // Example for 6-digit postal code
        },
        message: (props) => `${props.value} is not a valid postal code!`,
      },
    },
    country: {
      type: String,
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Add a pre-save hook to ensure only one default address per user
addressSchema.pre("save", async function (next) {
  if (this.isModified("isDefault") && this.isDefault) {
    await this.constructor.updateMany(
      {
        userId: this.userId,
        _id: { $ne: this._id },
      },
      { isDefault: false }
    );
  }
  next();
});

module.exports = mongoose.model("Address", addressSchema);
