const Wallet = require("../models/Wallet");

// GET USER WALLET BALANCE
exports.getMyWallet = async (req, res) => {
  try {
    const userId = req.user.userId;

    const wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      return res.json({ balance: 0 });
    }

    res.json({ balance: wallet.balance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
