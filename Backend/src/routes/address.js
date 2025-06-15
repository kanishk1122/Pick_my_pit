const express = require("express");
const router = express.Router();
const addressController = require("../controllers/AddressController");

// Middleware to extract userId from request
router.use(async (req, res, next) => {
  try {
    // Get userId from params or body
    const userId = req.params.userId || req.body.userId || req.headers['userid'];
    
    // Debug logging
    console.log('Request details:', {
      originalUrl: req.originalUrl,
      method: req.method,
      params: req.params,
      body: req.body,
      headers: req.headers,
      userId
    });

    if (!userId) {
      console.log('Missing userId in request');
      return res.status(400).json({
        success: false,
        message: "User ID is required"
      });
    }

    // Add userId to request object for later use
    req.userId = userId;
    next();
  } catch (error) {
    console.error('Middleware error:', error);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
      error: error.message
    });
  }
});

// CRUD operations for addresses
router.post("/add", addressController.addAddress);
router.put("/update/:addressId", addressController.updateAddress);
router.delete("/delete/:addressId", addressController.deleteAddress);
router.get("/:userId", addressController.getUserAddresses);
router.get("/detail/:addressId", addressController.getAddressById);
router.put("/default/:addressId", addressController.setDefaultAddress);

module.exports = router;