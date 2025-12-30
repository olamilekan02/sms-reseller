const User = require("../../models/User");
const Wallet = require("../../models/Wallet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// -----------------------------
//LOGIN SETUP

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        role: user.role, // ✅ THIS IS THE KEY
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};




// SIGNUP CONTROLLER
// -----------------------------
exports.signup = async (req, res) => {
  try {
    const { email, password, username, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: "user", // Default role
    });

    // Create wallet for the new user
    await Wallet.create({
      userId: user._id,
      balance: 200, // starting balance for testing
    });

    // Generate JWT including role
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
        role: user.role, // ✅ Include role for admin checks
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Return token
    res.json({ token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: error.message });
  }
};
