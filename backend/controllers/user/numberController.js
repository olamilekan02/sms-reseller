const NumberModel = require("../../models/Number");
const Wallet = require("../../models/Wallet");
const Transaction = require("../../models/Transaction");

// =======================
// GET available numbers
// =======================
exports.getAvailableNumbers = async (req, res) => {
  try {
    const numbers = await NumberModel.find({
      status: "available",
      currentUserId: null,
      isSingleUse: true,
    }).sort({ createdAt: -1 });

    res.json(numbers);
  } catch (err) {
    console.error("getAvailableNumbers error:", err);
    res.status(500).json({ message: "Failed to fetch available numbers" });
  }
};

// =======================
// GET my numbers
// =======================
exports.getMyNumbers = async (req, res) => {
  try {
    const now = new Date();

    const numbers = await NumberModel.find({
      currentUserId: req.user.userId,
      status: "rented",
      $or: [
        { otpReceived: false },
        { otpReceived: true, graceExpiry: { $gt: now } },
      ],
    }).sort({ createdAt: -1 });

    res.json(numbers);
  } catch (err) {
    console.error("getMyNumbers error:", err);
    res.status(500).json({ message: "Failed to fetch my numbers" });
  }
};

// =======================
// BUY number
// =======================
exports.buyNumber = async (req, res) => {
  const { numberId, purpose } = req.body;

  if (!numberId || !purpose) {
    return res.status(400).json({ message: "Number ID and purpose are required" });
  }

  try {
    const normalizedPurpose = purpose.trim().toLowerCase();

    const number = await NumberModel.findOne({
      _id: numberId,
      status: "available",
      isSingleUse: true,
    });

    if (!number) {
      return res.status(400).json({ message: "Number not available" });
    }

    const priceObj =
      number.prices?.get?.(normalizedPurpose) ||
      number.prices?.[normalizedPurpose];

    if (!priceObj?.buy) {
      return res.status(400).json({ message: "Price not set for this purpose" });
    }

    const price = Number(priceObj.buy);

    let wallet = await Wallet.findOne({ userId: req.user.userId });
    if (!wallet) {
      wallet = await Wallet.create({ userId: req.user.userId, balance: 0 });
    }

    if (wallet.balance < price) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    wallet.balance -= price;
    await wallet.save();

    await Transaction.create({
      userId: req.user.userId,
      type: "buy",
      amount: price,
      reference: `BUY-${Date.now()}`,
      meta: { number: number.number, purpose: normalizedPurpose },
    });

    number.status = "rented";
    number.currentUserId = req.user.userId;
    number.purpose = [normalizedPurpose];
    number.otpReceived = false;
    number.updatedAt = new Date();

    await number.save();

    res.json({
      message: "Number purchased successfully",
      number,
      wallet,
    });
  } catch (error) {
    console.error("buyNumber error:", error);
    res.status(500).json({ message: "Buying failed" });
  }
};

// =======================
// SMS receipt
// =======================
exports.handleSmsReceipt = async (req, res) => {
  try {
    const { numberId } = req.body;

    const number = await NumberModel.findById(numberId);
    if (!number) return res.sendStatus(404);

    if (!number.otpReceived) {
      number.otpReceived = true;
      number.graceExpiry = new Date(Date.now() + 5 * 60 * 1000);
      await number.save();
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("handleSmsReceipt error:", err);
    res.sendStatus(500);
  }
};

// =======================
// CANCEL rental
// =======================
exports.cancelRental = async (req, res) => {
  const { numberId } = req.body;

  try {
    const number = await NumberModel.findOne({
      _id: numberId,
      currentUserId: req.user.userId, // ✅ FIXED
    });

    if (!number) {
      return res.status(404).json({ message: "Number not found" });
    }

    number.status = "available";
    number.currentUserId = null;
    number.otpReceived = false;
    number.graceExpiry = null;

    await number.save();

    res.json({ message: "Rental cancelled", number });
  } catch (error) {
    console.error("cancelRental error:", error);
    res.status(500).json({ message: "Cancel failed" });
  }
};
