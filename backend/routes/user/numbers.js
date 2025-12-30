const express = require("express");
const router = express.Router();
const NumberModel = require("../../models/Number"); // path to your Number model
const authMiddleware = require("../../middleware/authMiddleware"); // JWT auth

// GET available single-use numbers
router.get("/available", authMiddleware, async (req, res) => {
  try {
    const numbers = await NumberModel.find({ status: "available", isSingleUse: true });
    res.json(numbers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
