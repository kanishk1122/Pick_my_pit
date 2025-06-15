const mongoose = require("mongoose");

// Helper function to generate slug
function slugify(text) {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

// Create the Post schema
const PostSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      index: true,
    },
    discription: String,
    date: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      enum: ["free", "paid"],
      default: "free",
    },
    category: String,
    species: String,
    speciesSlug: {
      type: String,
      lowercase: true,
    },
    breedSlug: {
      type: String,
      lowercase: true,
    },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    age: {
      value: Number,
      unit: {
        type: String,
        enum: ["days", "weeks", "months", "years"],
        default: "months",
      },
    },
    status: {
      type: String,
      enum: ["available", "sold", "adopted", "pending"],
      default: "available",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Generate slug before saving
PostSchema.pre("save", function (next) {
  // Create slug if not exists or title changed
  if (!this.slug || this.isModified("title")) {
    // Generate base slug from title
    const baseSlug = slugify(this.title || "pet-post");

    // Add a unique timestamp to avoid collisions
    const timestamp = new Date().getTime().toString().slice(-6);
    this.slug = `${baseSlug}-${timestamp}`;
  }

  // Generate species slug if missing
  if (this.species && !this.speciesSlug) {
    this.speciesSlug = slugify(this.species);
  }

  // Generate breed/category slug if missing
  if (this.category && !this.breedSlug) {
    this.breedSlug = slugify(this.category);
  }

  next();
});

// Virtual for formatted age
PostSchema.virtual("formattedAge").get(function () {
  if (!this.age || !this.age.value) return "";

  const { value, unit } = this.age;
  const unitStr = value === 1 ? unit.slice(0, -1) : unit;
  return `${value} ${unitStr} old`;
});

// Create indexes for efficient querying
PostSchema.index({ species: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ type: 1 });
PostSchema.index({ slug: 1 }, { unique: true });

// Static method to find by slug
PostSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug: slug.toLowerCase() })
    .populate("owner", "firstname lastname userpic")
    .populate("address");
};

// Age formatting helper (static method)
PostSchema.statics.formatAge = function (age) {
  if (!age || !age.value) return "";

  const { value, unit } = age;
  const unitStr = value === 1 ? unit.slice(0, -1) : unit;
  return `${value} ${unitStr} old`;
};

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
