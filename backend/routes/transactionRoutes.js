const express = require("express");
const router = express.Router();
const { getMyTransactions } = require("../controllers/transactionController");
const auth = require("../middleware/auth");

router.get("/me", auth, getMyTransactions);

module.exports = router;
