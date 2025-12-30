const Wallet = require('../../models/Wallet');

// Get Wallet Balance
exports.getWallet = async (req, res) => {
  try {
    const userId = req.user.userId;
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      // Create wallet if not exists
      wallet = await Wallet.create({ userId, balance: 0 });
    }
    res.json(wallet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add Funds (simulate deposit)
exports.addFunds = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ message: 'Invalid amount' });

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) wallet = await Wallet.create({ userId, balance: 0 });

    wallet.balance += amount;
    await wallet.save();

    res.json({ message: `Wallet topped up with ${amount}`, wallet });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
