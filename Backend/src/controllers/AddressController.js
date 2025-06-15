const Address = require("../model/Address");
const User = require("../model/User");
const { checkSessionId } = require("../helper/Functions");

/**
 * Add a new address for a user
 */
exports.addAddress = async (req, res) => {
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

    console.log("Adding new address for user:", userId);

    // Validate required fields
    if (!userId || !street || !city || !state) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

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

    console.log(`Address created with ID: ${address._id}`);

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
      console.log(`Set address ${address._id} as default`);
    }

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({
      success: false,
      message: "Error adding address",
      error: error.message,
    });
  }
};

/**
 * Update an existing address
 */
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const updateData = req.body;
    const userId = req.userId;

    console.log(`Updating address: ${addressId} for user: ${userId}`);

    // Check if address exists and belongs to user
    const existingAddress = await Address.findOne({ _id: addressId, userId });
    if (!existingAddress) {
      console.log(`Address not found or doesn't belong to user ${userId}`);
      return res.status(404).json({
        success: false,
        message: "Address not found",
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
      console.log(`Set address ${addressId} as default for user ${userId}`);
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
      address: updatedAddress,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({
      success: false,
      message: "Error updating address",
      error: error.message,
    });
  }
};

/**
 * Delete an address
 */
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId;

    console.log(`Deleting address: ${addressId} for user: ${userId}`);

    // Check if address exists and belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // If deleting default address, remove defaultAddress reference from user
    if (address.isDefault) {
      await User.findByIdAndUpdate(userId, {
        $unset: { defaultAddress: "" },
      });
      console.log(`Removed default address reference for user ${userId}`);
    }

    // Remove address from user's addresses array
    await User.findByIdAndUpdate(userId, {
      $pull: { addresses: addressId },
    });

    // Delete the address
    await Address.findByIdAndDelete(addressId);
    console.log(`Address ${addressId} deleted successfully`);

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting address",
      error: error.message,
    });
  }
};

/**
 * Get all addresses for a user
 */
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(
      `Fetching addresses for user: ${userId}, Page: ${page}, Limit: ${limit}`
    );

    const [addresses, total] = await Promise.all([
      Address.find({ userId }).skip(skip).limit(limit).lean(),
      Address.countDocuments({ userId }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      message:
        addresses.length > 0
          ? "Addresses fetched successfully"
          : "No addresses found",
      addresses,
      pagination: {
        currentPage: page,
        totalPages,
        totalAddresses: total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching addresses",
      error: error.message,
    });
  }
};

/**
 * Get a specific address by ID
 */
exports.getAddressById = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId;

    console.log(`Fetching address: ${addressId} for user: ${userId}`);

    const address = await Address.findOne({
      _id: addressId,
      userId,
    }).lean();

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.status(200).json({
      success: true,
      address,
    });
  } catch (error) {
    console.error("Error fetching address:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching address",
      error: error.message,
    });
  }
};

/**
 * Set an address as default
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const userId = req.userId;

    console.log(`Setting address ${addressId} as default for user: ${userId}`);

    // Check if address exists and belongs to user
    const address = await Address.findOne({ _id: addressId, userId });
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    // Set the selected address as default
    address.isDefault = true;
    await address.save();

    // Remove default flag from other addresses
    await Address.updateMany(
      { userId, _id: { $ne: addressId } },
      { isDefault: false }
    );

    // Update user's default address
    await User.findByIdAndUpdate(userId, { defaultAddress: addressId });

    res.status(200).json({
      success: true,
      message: "Default address set successfully",
      address,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({
      success: false,
      message: "Error setting default address",
      error: error.message,
    });
  }
};
