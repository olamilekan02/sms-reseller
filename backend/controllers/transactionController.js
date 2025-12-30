const Transaction = require("../models/Transaction");

/* =====================================================
   GET MY TRANSACTIONS
   GET /api/transactions/me?page=1&limit=10
===================================================== */
const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Transaction.countDocuments({ userId })
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      transactions
    });
  } catch (err) {
    console.error("TRANSACTION HISTORY ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMyTransactions
};
