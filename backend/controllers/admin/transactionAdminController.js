// backend/controllers/admin/transactionAdminController.js
const Transaction = require("../../models/Transaction");
const User = require("../../models/User");

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("userId", "username email")
      .sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    console.error("Get transactions error:", err);
    res.status(500).json({ message: "Server error" });
  }
};