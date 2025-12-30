// routes/user/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../../controllers/user/messageController");
const { auth } = require("../../middleware/auth");

// Get messages for a number
router.get("/:numberId", auth, messageController.getMessagesByNumber);

// MOCK SMS — ONLY FOR TESTING (remove in production!)
router.post("/mock", auth, messageController.mockIncomingSMS);

module.exports = router;