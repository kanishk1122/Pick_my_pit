const User = require("../model/User");

const adminAuth = async (req, res, next) => {
  try {
    // Check if user is logged in (assumes authentication middleware sets req.user)
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // Find user in database to verify admin status
    const user = await User.findById(req.user._id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // User is admin, proceed to next middleware
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying admin permissions",
      error: error.message,
    });
  }
};

module.exports = adminAuth;
