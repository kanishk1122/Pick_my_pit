const mongoose = require("mongoose");
require("dotenv").config();

// Get database connection string with fallbacks
const getDbConnectionString = () => {
  const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
  if (!dbUrl) {
    console.warn(
      "WARNING: No database connection string found in environment variables."
    );
    console.warn(
      "Using default connection: mongodb://localhost:27017/pickMyPit"
    );
    return "mongodb://localhost:27017/pickMyPit";
  }
  return dbUrl;
};

// Connect to MongoDB
const connectDB = async () => {
  try {
    const connectionString = getDbConnectionString();
    await mongoose.connect(connectionString);
    console.log(`MongoDB Connected: ${connectionString.split("@").pop()}`); // Hide credentials in logs
    return true;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = { connectDB, getDbConnectionString };
