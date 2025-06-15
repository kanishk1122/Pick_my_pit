const { default: mongoose } = require("mongoose");
const AddressSchema = require("./Address.js");

const PostSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    images: {
      type: Array,
      default: [],
    },
    title: String,
    discription: String,
    date: {
      type: Date,
      default: Date.now(),
    },
    // Enhanced age fields with validation
    age: {
      value: {
        type: Number,
        min: 0,
      },
      unit: {
        type: String,
        enum: ["days", "weeks", "months", "years"],
        default: "months",
      },
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
      index: true, // Add index for better query performance
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    species: {
      type: String,
      trim: true,
      lowercase: true, // Store in lowercase for consistent querying
      index: true,
    },
    breed: {
      type: String,
      required: false,
      trim: true,
      lowercase: true, // Store in lowercase for consistent querying
      index: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    amount: {
      type: Number,
      min: 0,
      default: 0,
      index: true, // Add index for price range queries
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add a virtual property for formatted age
PostSchema.virtual("formattedAge").get(function () {
  if (!this.age || !this.age.value) return "";

  // Normalize the age to the most appropriate unit
  const normalized = normalizeAge(this.age.value, this.age.unit);
  return `${normalized.value} ${normalized.unit}`;
});

// Pre-save middleware to normalize age before saving
PostSchema.pre("save", function (next) {
  if (this.isModified("age") && this.age && this.age.value) {
    const normalized = normalizeAge(this.age.value, this.age.unit);
    this.age = normalized;
  }

  // If category is set but breed isn't, copy category to breed for backward compatibility
  if (this.isModified("category") && this.category && !this.breed) {
    this.breed = this.category;
  }

  next();
});

// Helper function to normalize age to the most appropriate unit
function normalizeAge(value, unit) {
  // Convert all to days first for easy calculation
  let days;
  switch (unit) {
    case "days":
      days = value;
      break;
    case "weeks":
      days = value * 7;
      break;
    case "months":
      days = value * 30; // Approximate
      break;
    case "years":
      days = value * 365; // Approximate
      break;
    default:
      return { value, unit };
  }

  // Convert to the most appropriate unit
  if (days < 7) {
    return { value: days, unit: "days" };
  } else if (days < 30) {
    // Convert days to weeks if it makes a clean number
    const weeks = Math.round(days / 7);
    return { value: weeks, unit: "weeks" };
  } else if (days < 365) {
    const months = Math.round(days / 30);
    return { value: months, unit: "months" };
  } else {
    const years = Math.round((days / 365) * 10) / 10; // Round to 1 decimal place
    return { value: years, unit: "years" };
  }
}

// Add compound indexes for common filter combinations
PostSchema.index({ species: 1, category: 1 }); // category is now used as breed
PostSchema.index({ type: 1, amount: 1 });
PostSchema.index({ category: 1, type: 1 });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
