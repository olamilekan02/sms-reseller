const express = require("express");
const router = express.Router();

const transactionController = require("../../controllers/user/transactionController");
const authMiddleware = require("../../middleware/authMiddleware");

// GET /api/transactions/me
router.get("/me", authMiddleware, transactionController.getMyTransactions);

module.exports = router;
