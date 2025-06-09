const express = require("express");
const router = express.Router();
const User = require("../model/User");

router.post("/deduct-coins", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    if (user.coins < amount) {
      return res.status(400).json({ msg: "Not enough coins" });
    }

    user.coins -= amount;
    await user.save();

    res.status(200).json({ msg: "Coins deducted successfully" });
  } catch (err) {
    console.error("Error deducting coins:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

module.exports = router;
