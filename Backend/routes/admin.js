const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
let Admin;
const CryptoJS = require("crypto-js");

// Try to load Admin model, but don't crash if it doesn't exist
try {
  Admin = require("../model/Admin");
} catch (error) {
  console.log("Admin model not available, will use fallbacks");
}

// Admin login endpoint
router.post("/login", async (req, res) => {
  try {
    console.log("Admin login attempt:", req.body.email);
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        msg: "Email and password are required",
      });
    }

    // Normalize the email
    const normalizedEmail = email.trim().toLowerCase();
    console.log(`Looking for admin with normalized email: ${normalizedEmail}`);

    // Try multiple sources to find admin user
    let foundUser = null;
    let userModel = null;
    let userCollection = null;

    // First try: Admin model if available
    if (Admin) {
      try {
        foundUser = await Admin.findOne({
          email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
        });

        if (foundUser) {
          console.log("Found user in Admin model");
          userModel = "Admin";
        }
      } catch (error) {
        console.log("Admin model search error:", error.message);
      }
    }

    // Second try: User model with admin role
    if (!foundUser) {
      try {
        const User = require("../model/User");
        foundUser = await User.findOne({
          email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
          role: "admin",
        });

        if (foundUser) {
          console.log("Found user in User model with admin role");
          userModel = "User";
        }
      } catch (error) {
        console.log("User model search error:", error.message);
      }
    }

    // Third try: Direct DB access (admins collection)
    if (!foundUser) {
      try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map((c) => c.name);
        console.log("Available collections:", collectionNames.join(", "));

        if (collectionNames.includes("admins")) {
          userCollection = "admins";
          foundUser = await db.collection("admins").findOne({
            email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
          });
          if (foundUser) console.log("Found user in admins collection");
        }

        // Try users collection with admin role if still not found
        if (!foundUser && collectionNames.includes("users")) {
          userCollection = "users";
          foundUser = await db.collection("users").findOne({
            email: { $regex: new RegExp(`^${normalizedEmail}$`, "i") },
            role: "admin",
          });
          if (foundUser) console.log("Found user in users collection");
        }
      } catch (dbError) {
        console.error("DB direct access error:", dbError);
      }
    }

    // If no user found after all attempts
    if (!foundUser) {
      console.log("No admin user found");
      return res.status(401).json({
        success: false,
        msg: "Invalid credentials",
      });
    }

    // Verify password
    let authenticated = false;

    console.log(`Found user: ${foundUser.email} (Model: ${password })`);
    console.log("Attempting to verify password...");

    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      process.env.CRYPTO_KEY
    ).toString(CryptoJS.enc.Utf8);

    // Try bcrypt compare
    try {
      if (foundUser.password) {
        const isMatch = await bcrypt.compare(decryptedPassword, foundUser.password);
        if (isMatch) {
          console.log("Password verified with bcrypt");
          authenticated = true;
        }
      }
    } catch (bcryptError) {
      console.log("Bcrypt comparison failed:", bcryptError.message);
    }

    // Development/emergency login for testing
    if (
      !authenticated &&
      (password === "kanishk1122" || password === "admin123")
    ) {
      console.log("Using admin development password");
      authenticated = true;
    }

    // Authentication failed
    if (!authenticated) {
      return res.status(401).json({
        success: false,
        msg: "Invalid password",
      });
    }

    // Generate JWT token
    const sessionToken = jwt.sign(
      { id: foundUser._id, email: foundUser.email, role: "admin" },
      process.env.JWT_SECRET || "fallback_secret_for_development",
      { expiresIn: "7d" }
    );

    // Format response
    const userData = {
      id: foundUser._id,
      email: foundUser.email,
      name: foundUser.firstname
        ? `${foundUser.firstname} ${foundUser.lastname || ""}`
        : foundUser.name || "Admin User",
      role: "admin",
      sessionToken,
    };

    console.log("Admin login successful for:", userData.email);
    res.status(200).json({
      success: true,
      userdata: userData,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error during login",
    });
  }
});

// Verify token endpoint
router.get("/verify-token", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "No token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_for_development"
    );

    // Check if admin still exists - using same pattern as login
    let adminExists = false;

    // Try Admin model if available
    if (Admin) {
      try {
        const admin = await Admin.findById(decoded.id);
        if (admin) {
          adminExists = true;
        }
      } catch (error) {
        console.log("Admin model verification error:", error.message);
      }
    }

    // Try User model if needed
    if (!adminExists) {
      try {
        const User = require("../model/User");
        const admin = await User.findOne({
          _id: decoded.id,
          role: "admin",
        });
        if (admin) {
          adminExists = true;
        }
      } catch (error) {
        console.log("User model verification error:", error.message);
      }
    }

    // Try direct DB access if needed
    if (!adminExists) {
      try {
        const db = mongoose.connection.db;

        // Try admins collection
        try {
          const admin = await db.collection("admins").findOne({
            _id: new mongoose.Types.ObjectId(decoded.id),
          });
          if (admin) adminExists = true;
        } catch (idError) {
          console.log("ID conversion error:", idError.message);
        }

        // Try users collection with admin role
        if (!adminExists) {
          try {
            const admin = await db.collection("users").findOne({
              _id: new mongoose.Types.ObjectId(decoded.id),
              role: "admin",
            });
            if (admin) adminExists = true;
          } catch (idError) {
            console.log("ID conversion error:", idError.message);
          }
        }
      } catch (dbError) {
        console.error("DB verification error:", dbError);
      }
    }

    if (!adminExists) {
      return res.status(401).json({
        success: false,
        msg: "Invalid token - admin not found",
      });
    }

    res.status(200).json({
      success: true,
      msg: "Token valid",
    });
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({
      success: false,
      msg: "Invalid token",
    });
  }
});

// Utility tool to diagnose admin issues
router.get("/diagnose", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    return res.status(403).json({
      success: false,
      msg: "Diagnostic tools not available in production",
    });
  }

  const report = {
    collections: [],
    adminUsers: [],
    models: [],
    environment: {},
  };

  try {
    // Check for collections
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    report.collections = collections.map((c) => c.name);

    // Check for admin users in different collections
    if (report.collections.includes("admins")) {
      const admins = await db.collection("admins").find({}).toArray();
      report.adminUsers.push({
        collection: "admins",
        count: admins.length,
        users: admins.map((a) => ({ id: a._id, email: a.email })),
      });
    }

    if (report.collections.includes("users")) {
      const adminUsers = await db
        .collection("users")
        .find({ role: "admin" })
        .toArray();
      report.adminUsers.push({
        collection: "users",
        count: adminUsers.length,
        users: adminUsers.map((a) => ({ id: a._id, email: a.email })),
      });
    }

    // Check for models
    report.models.push({ name: "Admin", exists: !!Admin });
    try {
      const User = require("../model/User");
      report.models.push({ name: "User", exists: !!User });
    } catch (e) {
      report.models.push({ name: "User", exists: false });
    }

    // Check environment
    report.environment = {
      DATABASE_URL: !!process.env.DATABASE_URL,
      MONGO_URI: !!process.env.MONGO_URI,
      JWT_SECRET: !!process.env.JWT_SECRET,
      NODE_ENV: process.env.NODE_ENV || "development",
    };

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    console.error("Diagnostic error:", error);
    res.status(500).json({
      success: false,
      msg: "Error running diagnostic",
      error: error.message,
    });
  }
});

module.exports = router;
