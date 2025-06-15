const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Google Auth Route
router.post("/google-auth", AuthController.googleAuth);

// Session verification route
router.post("/verify-session", AuthController.verifySession);

module.exports = router;
