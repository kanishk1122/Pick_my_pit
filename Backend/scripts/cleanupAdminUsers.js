const mongoose = require("mongoose");
require("dotenv").config();

async function cleanupAdminUsers() {
  try {
    // Connect to the database
    const dbUrl = process.env.DATABASE_URL || process.env.MONGO_URI;
    if (!dbUrl) {
      throw new Error("Database URL not defined in environment variables");
    }

    await mongoose.connect(dbUrl);
    console.log("Connected to MongoDB successfully");

    // Get direct DB access
    const db = mongoose.connection.db;

    // Check available collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    console.log("Available collections:", collectionNames.join(", "));
    console.log("\n=== STARTING ADMIN USER CLEANUP ===");

    // Track all found admin users across collections
    let foundAdmins = [];

    // Check admins collection
    if (collectionNames.includes("admins")) {
      console.log("\nChecking admins collection...");
      const admins = await db.collection("admins").find({}).toArray();
      console.log(`Found ${admins.length} users in admins collection`);

      // Delete any with email admin@321
      await db.collection("admins").deleteMany({ email: "admin@321" });
      console.log('Deleted any admin users with email "admin@321"');

      // Add the rest to the found list
      foundAdmins = foundAdmins.concat(
        admins
          .filter((a) => a.email !== "admin@321")
          .map((a) => ({
            id: a._id,
            email: a.email,
            collection: "admins",
            document: a,
          }))
      );
    }

    // Check users collection
    if (collectionNames.includes("users")) {
      console.log("\nChecking users collection...");
      const adminUsers = await db
        .collection("users")
        .find({ role: "admin" })
        .toArray();
      console.log(`Found ${adminUsers.length} admin users in users collection`);

      // Delete any with email admin@321
      await db
        .collection("users")
        .deleteMany({ email: "admin@321", role: "admin" });
      console.log('Deleted any admin users with email "admin@321"');

      // Add the rest to the found list
      foundAdmins = foundAdmins.concat(
        adminUsers
          .filter((a) => a.email !== "admin@321")
          .map((a) => ({
            id: a._id,
            email: a.email,
            collection: "users",
            document: a,
          }))
      );
    }

    // Check admin collection (singular)
    if (collectionNames.includes("admin")) {
      console.log("\nChecking admin collection...");
      const adminDocs = await db.collection("admin").find({}).toArray();
      console.log(`Found ${adminDocs.length} documents in admin collection`);

      // Delete any with email admin@321
      await db.collection("admin").deleteMany({ email: "admin@321" });
      console.log('Deleted any admin users with email "admin@321"');

      // Add the rest to the found list
      foundAdmins = foundAdmins.concat(
        adminDocs
          .filter((a) => a.email !== "admin@321")
          .map((a) => ({
            id: a._id,
            email: a.email,
            collection: "admin",
            document: a,
          }))
      );

      // Delete the entire collection if needed (singular form is not MongoDB convention)
      if (adminDocs.length > 0) {
        console.log(
          'Note: The "admin" collection (singular) is not following MongoDB naming conventions.'
        );
        console.log('Consider migrating to "admins" collection (plural).');
      }
    }

    console.log(
      `\nTotal valid admin users found across all collections: ${foundAdmins.length}`
    );

    // Choose which admin to keep
    let adminToKeep = null;

    // Priority: keep pickmypit@gmail.com if exists
    const preferredAdmin = foundAdmins.find(
      (a) => a.email === "pickmypit@gmail.com"
    );
    if (preferredAdmin) {
      adminToKeep = preferredAdmin;
      console.log(
        `\nKeeping preferred admin user: ${adminToKeep.email} (${adminToKeep.collection})`
      );
    } else if (foundAdmins.length > 0) {
      // Just keep the first one found
      adminToKeep = foundAdmins[0];
      console.log(
        `\nPreferred admin not found. Keeping: ${adminToKeep.email} (${adminToKeep.collection})`
      );
    } else {
      console.log("\nNo valid admin users found to keep");
    }

    // Delete duplicates
    if (adminToKeep && foundAdmins.length > 1) {
      console.log("\nRemoving duplicate admin users...");

      for (const collection of ["admin", "admins", "users"]) {
        if (collectionNames.includes(collection)) {
          if (collection === adminToKeep.collection && collection === "users") {
            // For users collection, only delete other admin users, not the one to keep
            await db.collection(collection).deleteMany({
              role: "admin",
              _id: { $ne: adminToKeep.id },
              email: { $ne: adminToKeep.email },
            });
          } else if (collection === adminToKeep.collection) {
            // For admins/admin collections, delete all except the one to keep
            await db.collection(collection).deleteMany({
              _id: { $ne: adminToKeep.id },
            });
          } else {
            // Delete all from other collections
            if (collection === "users") {
              await db.collection(collection).deleteMany({ role: "admin" });
            } else {
              await db.collection(collection).deleteMany({});
            }
          }
        }
      }

      console.log("Duplicate admin users removed successfully.");
    }

    // Final check
    console.log("\n=== FINAL STATE ===");
    let totalAdmins = 0;

    for (const collection of ["admin", "admins", "users"]) {
      if (collectionNames.includes(collection)) {
        const query = collection === "users" ? { role: "admin" } : {};
        const count = await db.collection(collection).countDocuments(query);
        console.log(`${collection}: ${count} admin user(s)`);
        totalAdmins += count;
      }
    }

    if (totalAdmins === 1) {
      console.log("\n✅ SUCCESS: Database now has exactly 1 admin user.");
    } else if (totalAdmins === 0) {
      console.log(
        "\n❌ WARNING: No admin users found. Run the seedAdmin script to create one."
      );
    } else {
      console.log(
        `\n⚠️ WARNING: ${totalAdmins} admin users found. There may still be duplicates.`
      );
    }

    // Close the database connection
    await mongoose.connection.close();
    console.log("\nDatabase connection closed.");
  } catch (error) {
    console.error("Error during cleanup:", error);
    // Ensure connection is closed even if there's an error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
}

cleanupAdminUsers();
