const express = require("express");
const router = express.Router();
const WalletTransaction = require("../models/WalletTransaction");
const Wallet = require("../models/Wallet");
const auth = require("../middleware/auth");

// ✅ GET WALLET BALANCE
router.get("/me", auth, async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.user.userId });

    res.json({
      balance: wallet ? wallet.balance : 0
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load wallet" });
  }
});

// ✅ GET TRANSACTIONS
router.get("/transactions", auth, async (req, res) => {
  try {
    const transactions = await WalletTransaction.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Failed to load transactions" });
  }
});

module.exports = router;
