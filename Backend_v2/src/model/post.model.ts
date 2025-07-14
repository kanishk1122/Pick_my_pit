import mongoose, { Document, Model, Schema } from "mongoose";

export interface IAge {
  value: number;
  unit: "days" | "weeks" | "months" | "years";
}

export interface IPost extends Document {
  owner: mongoose.Types.ObjectId;
  images: string[];
  title: string;
  slug: string;
  discription: string;
  date: Date;
  amount: number;
  type: "free" | "paid";
  category: string;
  species: string;
  speciesSlug: string;
  breedSlug: string;
  address: mongoose.Types.ObjectId;
  age?: IAge;
  status: "available" | "sold" | "adopted" | "pending";
  createdAt: Date;
  updatedAt: Date;
  formattedAge: string; // Virtual field
}

export interface IPostMethods {
  updateStatus(
    newStatus: "available" | "sold" | "adopted" | "pending"
  ): Promise<IPost>;
}

export interface IPostModel extends Model<IPost, {}, IPostMethods> {
  findBySlug(slug: string): Promise<IPost | null>;
  findAvailable(): Promise<IPost[]>;
  findBySpecies(species: string): Promise<IPost[]>;
  formatAge(age: IAge): string;
}

// Helper function to generate slug
function slugify(text: string): string {
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

const postSchema = new Schema<IPost, IPostModel, IPostMethods>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    images: {
      type: [String],
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
    discription: {
      type: String,
      required: true,
    },
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
    category: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    speciesSlug: {
      type: String,
      lowercase: true,
    },
    breedSlug: {
      type: String,
      lowercase: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
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

// Instance methods
postSchema.methods.updateStatus = async function (
  newStatus: "available" | "sold" | "adopted" | "pending"
): Promise<IPost> {
  this.status = newStatus;
  return this.save();
};

// Static methods
postSchema.statics.findBySlug = function (slug: string) {
  return this.findOne({ slug: slug.toLowerCase() })
    .populate("owner", "firstname lastname userpic")
    .populate("address");
};

postSchema.statics.findAvailable = function () {
  return this.find({ status: "available" })
    .populate("owner", "firstname lastname userpic")
    .populate("address");
};

postSchema.statics.findBySpecies = function (species: string) {
  return this.find({ speciesSlug: slugify(species) })
    .populate("owner", "firstname lastname userpic")
    .populate("address");
};

postSchema.statics.formatAge = function (age: IAge): string {
  if (!age || !age.value) return "";

  const { value, unit } = age;
  const unitStr = value === 1 ? unit.slice(0, -1) : unit;
  return `${value} ${unitStr} old`;
};

// Virtual for formatted age
postSchema.virtual("formattedAge").get(function () {
  if (!this.age || !this.age.value) return "";

  const { value, unit } = this.age;
  const unitStr = value === 1 ? unit.slice(0, -1) : unit;
  return `${value} ${unitStr} old`;
});

// Pre-save hooks
postSchema.pre("save", function (next) {
  // Create slug if not exists or title changed
  if (!this.slug || this.isModified("title")) {
    // Generate base slug from title
    const baseSlug = slugify(this.title || "pet-post");

    // Add a unique timestamp to avoid collisions
    const uniqueId = new Date().getTime().toString().slice(-6);
    this.slug = `${baseSlug}-${uniqueId}`;
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

// Create indexes for efficient querying
postSchema.index({ species: 1 });
postSchema.index({ category: 1 });
postSchema.index({ type: 1 });
postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ status: 1 });
postSchema.index({ owner: 1 });

const PostModel = mongoose.model<IPost, IPostModel>("Post", postSchema);

export default PostModel;
