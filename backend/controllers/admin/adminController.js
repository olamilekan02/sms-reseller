// backend/controllers/admin/adminController.js

const User = require("../../models/User");
const bcrypt = require("bcryptjs"); // ← CRITICAL: This was missing!
const jwt = require("jsonwebtoken");
const NumberModel = require("../../models/Number");
const Transaction = require("../../models/Transaction");

// -------------------- ADMIN LOGIN --------------------
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find user with role "admin"
    const admin = await User.findOne({ email, role: "admin" });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        username: admin.username || "Admin",
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- ADMIN DASHBOARD STATS --------------------
exports.getDashboardStats = async (req, res) => {
  let revenueChart = [];

  try {
    const totalUsers = await User.countDocuments();
    const totalNumbers = await NumberModel.countDocuments();
    const activeRentals = await NumberModel.countDocuments({
      status: "rented",
      currentUserId: { $exists: true, $ne: null },
    });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const revenueTodayResult = await Transaction.aggregate([
      { $match: { type: { $in: ["buy", "rebuy"] }, createdAt: { $gte: startOfDay } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenueToday = revenueTodayResult[0]?.total || 0;

    const revenueWeekResult = await Transaction.aggregate([
      { $match: { type: { $in: ["buy", "rebuy"] }, createdAt: { $gte: startOfWeek } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenueWeek = revenueWeekResult[0]?.total || 0;

    const revenueMonthResult = await Transaction.aggregate([
      { $match: { type: { $in: ["buy", "rebuy"] }, createdAt: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const revenueMonth = revenueMonthResult[0]?.total || 0;

    const totalRevenueResult = await Transaction.aggregate([
      { $match: { type: { $in: ["buy", "rebuy"] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    const totalRevenue = totalRevenueResult[0]?.total || 0;

    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(now.getDate() - 30);

    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          type: { $in: ["buy", "rebuy"] },
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    revenueChart = dailyRevenue.map((d) => ({
      date: d._id,
      revenue: Number(d.revenue.toFixed(2)),
    }));

    res.json({
      totalUsers,
      totalNumbers,
      activeRentals,
      revenueToday: Number(revenueToday.toFixed(2)),
      revenueWeek: Number(revenueWeek.toFixed(2)),
      revenueMonth: Number(revenueMonth.toFixed(2)),
      totalRevenue: Number(totalRevenue.toFixed(2)),
      revenueChart,
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({
      totalUsers: 0,
      totalNumbers: 0,
      activeRentals: 0,
      revenueToday: 0,
      revenueWeek: 0,
      revenueMonth: 0,
      totalRevenue: 0,
      revenueChart: [],
    });
  }
};