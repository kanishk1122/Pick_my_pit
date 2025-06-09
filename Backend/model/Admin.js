const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const AdminSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
      trim: true,
    },
    lastname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "superadmin"],
      default: "admin",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    emailConfirm: {
      type: Boolean,
      default: true,
    },
    sessionToken: String,
    userpic: {
      type: String,
      default:
        "https://i.pinimg.com/564x/d8/2c/87/d82c87e21e84a3e7649d16c968105553.jpg",
    },
  },
  { timestamps: true }
);

// Hash password before saving if modified
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);
