const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

// Middleware to verify admin token
const verifyAdminToken = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        msg: "Access denied. No token provided.",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_for_development"
    );

    // Check if token contains admin role
    if (!decoded.role || decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        msg: "Access denied. Not authorized as admin.",
      });
    }

    // Add decoded user to request
    req.admin = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        msg: "Token expired. Please log in again.",
      });
    }

    res.status(400).json({
      success: false,
      msg: "Invalid token.",
    });
  }
};

// Check if user exists in DB (optional additional verification)
const validateAdminExists = async (req, res, next) => {
  try {
    if (!req.admin || !req.admin.id) {
      return res.status(400).json({
        success: false,
        msg: "Invalid admin data in token",
      });
    }

    // Try to find admin user in Admin model or users collection
    let adminExists = false;

    // First try Admin model if available
    try {
      const Admin = require("../model/Admin");
      const admin = await Admin.findById(req.admin.id);
      if (admin) {
        adminExists = true;
        req.adminUser = admin;
      }
    } catch (err) {
      console.log("Admin model check error:", err.message);
    }

    // Then try User model if needed
    if (!adminExists) {
      try {
        const User = require("../model/User");
        const admin = await User.findOne({
          _id: req.admin.id,
          role: "admin",
        });
        if (admin) {
          adminExists = true;
          req.adminUser = admin;
        }
      } catch (err) {
        console.log("User model check error:", err.message);
      }
    }

    if (!adminExists) {
      return res.status(401).json({
        success: false,
        msg: "Admin user no longer exists",
      });
    }

    next();
  } catch (error) {
    console.error("Admin validation error:", error);
    res.status(500).json({
      success: false,
      msg: "Server error during admin validation",
    });
  }
};


const userIdFromRequest = (req) => {

};


module.exports = {
  verifyAdminToken,
  validateAdminExists,
};
