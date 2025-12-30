const express = require("express");
const router = express.Router();
const controller = require("../../controllers/user/numberController");
const { auth } = require("../../middleware/auth"); // ✅ FIXED

// GET available numbers → /api/user/numbers/available
router.get("/available", auth, controller.getAvailableNumbers);

// GET my numbers → /api/user/numbers/my
router.get("/my", auth, controller.getMyNumbers);

// POST buy number → /api/user/numbers/buy
router.post("/buy", auth, controller.buyNumber);

// POST cancel number → /api/user/numbers/cancel
router.post("/cancel", auth, controller.cancelRental);

module.exports = router;
