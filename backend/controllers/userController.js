const User = require("../models/User");
const Wallet = require("../models/Wallet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ ok: false, error: "All fields are required" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ ok: false, error: "Email already registered" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ ok: false, error: "Username already taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashed,
    });

    // ✅ AUTO-CREATE WALLET
    await Wallet.create({
      userId: user._id,
      balance: 0,
    });

    res.status(201).json({
      ok: true,
      message: "Account created successfully",
    });

  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
