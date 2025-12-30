// backend/routes/user/userRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middleware/authMiddleware");

// Controller
const {
  signup,
  login,
  getMe,
  forgotPassword,   // ← Added
  resetPassword,    // ← Added
} = require("../../controllers/user/userController");

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);     // ← New route
router.post("/reset-password", resetPassword);       // ← New route

// Protected routes
router.get("/me", authMiddleware, getMe);

module.exports = router;