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
      required: true,
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
      enum: ["male", "female", "non-binary"],
    },
    sessionToken: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      required: true,
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
    status: {
      type: String,
      default: "pending",
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
    address: AddressSchema,
    phone: {
      type: String,
      default: null,
    },
    about: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);



module.exports = mongoose.model("User", userSchema);
