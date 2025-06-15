const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");

// Admin login endpoint
router.post("/login", adminController.loginAdmin);

// Verify token endpoint
router.get("/verify-token", adminController.verifyToken);

// Utility tool to diagnose admin issues
router.get("/diagnose", adminController.runDiagnostics);

// Create admin endpoint
router.post("/create", adminController.createAdmin);

module.exports = router;
