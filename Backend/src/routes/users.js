const express = require("express");
const router = express.Router();
const userController = require("../controllers/UserController");

// Authentication routes
router.post("/login", userController.login);
router.post("/", userController.register);

// Email confirmation routes
router.get("/confirmationgenrate/:id", userController.generateConfirmationToken);
router.get("/confirmation/:id/:token", userController.confirmEmail);

// Password reset routes
router.get("/resetpassowrd-email/:id", userController.resetPasswordEmail);
router.patch("/resetpassword/:id", userController.resetPassword);

// User profile and data routes
router.get("/getuser/?:username/?:email", userController.getUserByUsernameOrEmail);
router.get("/fetch-user/:userId", userController.fetchUserById);
router.get("/profile/:userId", userController.getUserProfile);

// User management routes
router.put("/update", userController.updateUser);
router.delete("/:email", userController.deleteUser);

// Referral system routes
router.get("/generate-referral-link/:userId", userController.generateReferralLink);
router.get("/referral-analytics/:userId", userController.getReferralAnalytics);

// Coin management
router.post("/deduct-coins", userController.deductCoins);

module.exports = router;