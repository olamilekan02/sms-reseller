// backend/controllers/admin/walletAdminController.js
const Wallet = require("../../models/Wallet");

exports.getAllWallets = async (req, res) => {
  try {
    const wallets = await Wallet.find().populate("userId", "username email");
    res.json(wallets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.topUpWallet = async (req, res) => {
  const { userId, amount } = req.body;

  if (!userId || !amount || amount <= 0) {
    return res.status(400).json({ message: "Valid userId and positive amount required" });
  }

  try {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    res.json({ message: "Wallet topped up successfully", wallet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Top-up failed" });
  }
};