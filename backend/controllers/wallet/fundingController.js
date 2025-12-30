const Wallet = require('../../models/Wallet');
const Transaction = require('../../models/Transaction');

exports.fakeFund = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be positive" });
    }

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    await Transaction.create({
      userId,
      type: "fund",
      amount: Number(amount),
      reference: `TEST-${Date.now()}`,
      status: "completed",
      meta: { method: "test_mode" },
    });

    res.json({ 
      message: `₦${amount} added to your wallet!`,
      balance: wallet.balance 
    });
  } catch (error) {
    console.error("Funding error:", error);
    res.status(500).json({ message: "Server error" });
  }
};