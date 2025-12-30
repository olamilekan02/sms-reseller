// backend/controllers/admin/userAdminController.js
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");

exports.getAllUsers = async (req, res) => {
  try {
    // Get all users
    const users = await User.find().select("-password").lean();

    // Get all wallets
    const wallets = await Wallet.find({ userId: { $in: users.map(u => u._id) } }).lean();

    // Create map of userId → balance
    const walletMap = {};
    wallets.forEach(w => {
      walletMap[w.userId.toString()] = w.balance;
    });

    // Attach balance to each user
    const usersWithBalance = users.map(user => ({
      ...user,
      wallet: {
        balance: walletMap[user._id.toString()] || 0
      }
    }));

    res.json(usersWithBalance);
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = true;
    await user.save();
    res.json({ message: "User blocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isBlocked = false;
    await user.save();
    res.json({ message: "User unblocked successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    // Optional: also delete wallet
    await Wallet.deleteOne({ userId: req.params.id });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};