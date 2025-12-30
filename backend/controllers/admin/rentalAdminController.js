const Number = require("../../models/Number"); // Use Number model for single-use rentals
const User = require("../../models/User");

// Get all active / past single-use rentals
exports.getAllRentals = async (req, res) => {
  try {
    // Find all numbers that were rented or expired
    const rentals = await Number.find({ isSingleUse: true })
      .populate("currentUserId", "username email") // current user renting number
      .sort({ createdAt: -1 });

    res.status(200).json(rentals);
  } catch (err) {
    console.error("Failed to fetch rentals:", err);
    res.status(500).json({ message: "Failed to fetch rentals" });
  }
};
