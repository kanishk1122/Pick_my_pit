const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

// Define admin data
const adminData = {
  name: "Test Admin",
  email: "admin@example.com",
  password: "admin123", // Will be hashed
  role: "superadmin",
  active: true,
};

async function createTestAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/pickMyPit"
    );
    console.log("Connected to MongoDB");

    // Get Admin collection directly
    const adminCollection = mongoose.connection.collection("admins");

    // Check if admin already exists
    const existingAdmin = await adminCollection.findOne({
      email: adminData.email,
    });
    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin._id);
      console.log("Email:", existingAdmin.email);

      // Update password for existing admin
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      await adminCollection.updateOne(
        { _id: existingAdmin._id },
        { $set: { password: hashedPassword } }
      );

      console.log("Admin password updated");
    } else {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminData.password, salt);

      // Insert admin with hashed password
      const admin = {
        ...adminData,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await adminCollection.insertOne(admin);
      console.log("Admin created successfully:", result.insertedId);
    }

    // Also try to create in users collection for compatibility
    const usersCollection = mongoose.connection.collection("users");
    const existingUser = await usersCollection.findOne({
      email: adminData.email,
      role: "admin",
    });

    if (!existingUser) {
      await usersCollection.insertOne({
        firstname: "Test",
        lastname: "Admin",
        email: adminData.email,
        password: "admin123", // Plain text for testing
        role: "admin",
        status: "active",
        emailConfirm: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      console.log("Admin also added to users collection");
    }

    console.log("Test admin setup complete");
  } catch (error) {
    console.error("Error creating test admin:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
    process.exit(0);
  }
}

createTestAdmin();
