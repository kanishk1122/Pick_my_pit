const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
require("dotenv").config();

async function diagnoseAdminIssues() {
  console.log("🔍 Starting Admin System Diagnostic Tool");
  console.log("----------------------------------------");

  try {
    // Connect to DB
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!dbUrl) {
      console.log(
        "❌ ERROR: No database connection URL found in environment variables"
      );
      process.exit(1);
    }

    console.log("🔌 Connecting to database...");
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB successfully");

    // Get all collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log(`\n📋 Database collections:`);
    console.log(collectionNames.join(", "));

    // Check for admin collections
    console.log("\n👤 Checking for admin users:");

    let adminUsersFound = 0;

    if (collectionNames.includes("admins")) {
      const admins = await db.collection("admins").find({}).toArray();
      console.log(`✓ 'admins' collection: ${admins.length} documents found`);

      if (admins.length > 0) {
        adminUsersFound += admins.length;
        console.log("\n📊 Admin users in admins collection:");
        admins.forEach((admin, i) => {
          console.log(
            `${i + 1}. _id: ${admin._id}, email: ${admin.email}, role: ${
              admin.role || "admin"
            }`
          );
        });
      } else {
        console.log("  No admin users found in admins collection");
      }
    } else {
      console.log("❌ admins collection does not exist");
    }

    if (collectionNames.includes("users")) {
      const adminUsers = await db
        .collection("users")
        .find({ role: "admin" })
        .toArray();
      console.log(
        `✓ 'users' collection: ${adminUsers.length} admin users found`
      );

      if (adminUsers.length > 0) {
        adminUsersFound += adminUsers.length;
        console.log("\n📊 Admin users in users collection:");
        adminUsers.forEach((admin, i) => {
          console.log(`${i + 1}. _id: ${admin._id}, email: ${admin.email}`);
        });
      } else {
        console.log("  No admin users found in users collection");
      }
    } else {
      console.log("❌ users collection does not exist");
    }

    // Summary
    console.log("\n📝 SUMMARY:");
    console.log(`Total admin users found: ${adminUsersFound}`);

    if (adminUsersFound === 0) {
      console.log(
        "❌ No admin users found. You should run the seedAdmin script."
      );
      console.log("   Command: npm run seed-admin");
    } else {
      console.log("✅ Admin users exist in your database.");
    }

    // Environment check
    console.log("\n🔧 Environment check:");
    const requiredVars = ["DATABASE_URL", "MONGO_URI", "JWT_SECRET"];
    const missingVars = [];

    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missingVars.push(varName);
      }
    });

    if (missingVars.length > 0) {
      console.log(
        `❌ Missing environment variables: ${missingVars.join(", ")}`
      );
    } else {
      console.log("✅ All required environment variables are present");
    }

    console.log("\n🏁 Diagnostic completed!");

    // Close connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("❌ Diagnostic error:", error);

    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }

    process.exit(1);
  }
}

diagnoseAdminIssues();
