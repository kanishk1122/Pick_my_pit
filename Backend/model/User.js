const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
      // Removed max length constraint to accommodate bcrypt hashes
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "inactive",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    userpic: {
      type: String,
      default:
        "https://i.pinimg.com/564x/d8/2c/87/d82c87e21e84a3e7649d16c968105553.jpg",
    },
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: String,
    emailConfirmExpires: Date,
    sessionToken: String,
    phone: String,
    phoneNumber: String,
    about: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    referredBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    coins: {
      type: Number,
      default: 0,
    },
    ownedPets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    purchasedPets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
  },
  { timestamps: true }
);

// Add a pre-save hook to handle default address logic
UserSchema.pre("save", async function (next) {
  if (this.isModified("addresses")) {
    const defaultAddr = await mongoose.model("Address").findOne({
      _id: { $in: this.addresses },
      isDefault: true,
    });
    if (defaultAddr) {
      this.defaultAddress = defaultAddr._id;
    }
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
