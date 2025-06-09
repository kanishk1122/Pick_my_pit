const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

const adminData = {
  firstname: "Kanishk",
  lastname: "Soni",
  email: "pickmypit@gmail.com",
  password: "kanishk1122",
  role: "admin",
  status: "active",
  emailConfirm: true,
  gender: "male",
};

async function seedAdmin() {
  try {
    // Using DATABASE_URL from .env instead of MONGODB_URI
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!dbUrl) {
      throw new Error(
        "Database connection URL is not defined in environment variables"
      );
    }

    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");

    // Try to use Admin model first
    try {
      const Admin = require("../model/Admin");

      // Check if admin already exists using the model
      const existingAdmin = await Admin.findOne({ email: adminData.email });

      if (existingAdmin) {
        console.log("Admin user already exists in Admin model");
        await mongoose.connection.close();
        process.exit(0);
      }

      // Create new admin using the model
      const admin = new Admin(adminData);
      await admin.save();

      console.log("Admin user created successfully with ID:", admin._id);
      await mongoose.connection.close();
      process.exit(0);
    } catch (modelError) {
      console.log(
        "Could not use Admin model, falling back to direct collection access:",
        modelError.message
      );

      // Fallback to direct collection access
      // Use 'admins' collection (plural) to be consistent with convention
      const adminCollection = mongoose.connection.collection("admins");

      // Check if admin already exists
      const existingAdmin = await adminCollection.findOne({
        email: adminData.email,
      });

      if (existingAdmin) {
        console.log("Admin user already exists in admins collection");
        await mongoose.connection.close();
        process.exit(0);
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Insert admin directly
      const result = await adminCollection.insertOne({
        ...adminData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      console.log(
        "Admin user created successfully with ID:",
        result.insertedId
      );
    }

    // Close the connection after operation
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    // Ensure connection is closed even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

seedAdmin();
