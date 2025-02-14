const express = require("express");
const router = express.Router();
const Address = require("../model/Address");
const User = require("../model/User");
const { checkSessionId } = require("../helper/Functions");


// Update middleware to properly extract userId
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

// Add new address
router.post("/add", async (req, res) => {
  try {
    const {
      userId,
      street,
      city,
      state,
      postalCode,
      country,
      isDefault,
      landmark,
    } = req.body;

    console.log("from AddressForm", req.body);

    // Create new address
    const address = new Address({
      userId,
      street,
      city,
      state,
      postalCode,
      landmark,
      country,
      isDefault,
    });
    await address.save();

    // Update user's addresses array
    await User.findByIdAndUpdate(
      userId,
      {
        $push: { addresses: address._id },
        ...(isDefault && { defaultAddress: address._id }),
      },
      { new: true }
    );

    if (isDefault) {
      // Update other addresses to not be default
      await Address.updateMany(
        {
          userId: userId,
          _id: { $ne: address._id },
        },
        { isDefault: false }
      );
    }

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
    console.error(error);
  }
});

// Update address
router.put("/update/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    // Check if address exists and belongs to user
    const existingAddress = await Address.findOne({ _id: addressId, userId });
    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // If setting as default, remove default from other addresses
    if (updateData.isDefault) {
      await Address.updateMany(
        { userId, _id: { $ne: addressId } },
        { isDefault: false }
      );

      // Update user's default address
      await User.findByIdAndUpdate(userId, { defaultAddress: addressId });
    }

    // Update the address
    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...updateData },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address: updatedAddress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message
    });
  }
});

// Delete address
router.delete("/delete/:addressId", async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId;

    // Check if address exists and belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    // If deleting default address, remove defaultAddress reference from user
    if (address.isDefault) {
      await User.findByIdAndUpdate(userId, { 
        $unset: { defaultAddress: "" }
      });
    }

    // Remove address from user's addresses array
    await User.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId }
    });

    // Delete the address
    await Address.findByIdAndDelete(addressId);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message
    });
  }
});

// Update GET route to use req.userId and include pagination
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log('Processing GET request for userId:', userId, 'Page:', page, 'Limit:', limit);

    const [addresses, total] = await Promise.all([
      Address.find({ userId }).skip(skip).limit(limit).lean(),
      Address.countDocuments({ userId })
    ]);
    
    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message: addresses.length > 0 ? "Addresses fetched successfully" : "No addresses found",
      addresses,
      pagination: {
        currentPage: page,
        totalPages,
        totalAddresses: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error in GET /:userId:', error);
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message
    });
  }
});

module.exports = router;
