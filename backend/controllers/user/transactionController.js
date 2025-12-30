const Transaction = require("../../models/Transaction");

const getMyTransactions = async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
    res.json({ ok: true, transactions });
  } catch (err) {
    console.error("TRANSACTION FETCH ERROR:", err);
    res.status(500).json({ ok: false, error: "Server error" });
  }
};

module.exports = {
  getMyTransactions
};
