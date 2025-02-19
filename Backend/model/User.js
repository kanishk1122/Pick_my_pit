const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AddressSchema = require("./Address");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      trim: true,
      minlength: 3,
      maxlength: 30,
      required: true,
    },
    lastname: {
      type: String,
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
    },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "other"],
    },
    sessionToken: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      // required: true,
      trim: true,
    },
    userpic: {
      type: String,
      default:
        "https://i.pinimg.com/564x/d8/2c/87/d82c87e21e84a3e7649d16c968105553.jpg",
    },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    post: {
      type: [
        {
          id: mongoose.Schema.Types.ObjectId,
          index: Number,
        },
      ],
      ref: "Post",
      default: [],
    },
    coins :{
      type: Number,
      default: 0,
    },
    referralCode: {
      type: String,
      default: null,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    status: {
      type: String,
      enum: ["active", "inactive", "banned"],
      default: "active",
    },
    activationToken: { type: String },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    emailConfirm: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: { type: String },
    emailConfirmExpires: {
      type: Date,
      default: () => Date.now() + 3600000, // 1 hour from now
    },
    addresses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    }],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address'
    },
    phone: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      trim: true,
    },
    ownedPets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
    purchasedPets: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }],
  },
  { timestamps: true }
);

// Add a pre-save hook to handle default address logic
userSchema.pre('save', async function(next) {
  if (this.isModified('addresses')) {
    const defaultAddr = await mongoose.model('Address').findOne({
      _id: { $in: this.addresses },
      isDefault: true
    });
    if (defaultAddr) {
      this.defaultAddress = defaultAddr._id;
    }
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
