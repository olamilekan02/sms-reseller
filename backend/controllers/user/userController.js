// backend/controllers/user/userController.js
const User = require("../../models/User");
const Wallet = require("../../models/Wallet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // ← ADDED: Critical for token generation
const PasswordResetToken = require("../../models/PasswordResetToken");
const sendEmail = require("../../utils/sendEmail");

// GET CURRENT USER
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      username: user.username,
      email: user.email,
      userId: user._id.toString(),
    });
  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: { username: user.username, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// REGISTER
exports.signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;

    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }

    if (await User.findOne({ username })) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    // Auto-create wallet
    await Wallet.create({
      userId: user._id,
      balance: 0,
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({ token, message: "Registration successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Registration failed" });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Delete any old tokens
    await PasswordResetToken.deleteMany({ userId: user._id });

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = await bcrypt.hash(resetToken, 10);

    await PasswordResetToken.create({
      userId: user._id,
      token: hashedToken,
    });

    // Create reset link
    const link = `${process.env.RESET_PASSWORD_URL}?token=${resetToken}&id=${user._id}`;

    // Send email (Ethereal in dev)
    await sendEmail(
      user.email,
      "LARRYSMS - Password Reset Request",
      `Hello ${user.username},\n\nYou requested a password reset.\n\nClick this link to reset your password:\n${link}\n\nThis link expires in 1 hour.\n\nIf you didn't request this, ignore this email.\n\n— LARRYSMS Team`
    );

    res.json({ message: "Password reset link sent to your email" });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { token, userId, password } = req.body;

    if (!token || !userId || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const resetRecord = await PasswordResetToken.findOne({ userId });
    if (!resetRecord) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const isValid = await bcrypt.compare(token, resetRecord.token);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    // Delete used token
    await resetRecord.deleteOne();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};