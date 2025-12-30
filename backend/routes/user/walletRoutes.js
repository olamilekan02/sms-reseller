const express = require("express");
const router = express.Router();
const { auth } = require("../../middleware/auth");
const {
  getWallet,
  addFunds,
} = require("../../controllers/user/walletController");

router.get("/", auth, getWallet);
router.post("/add", auth, addFunds);

module.exports = router;
