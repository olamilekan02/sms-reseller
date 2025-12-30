const express = require("express");
const router = express.Router();
const adminMiddleware = require("../../middleware/adminMiddleware");
const { getAllWallets } = require("../../controllers/admin/walletAdminController");

router.use(adminMiddleware);

router.get("/wallets", getAllWallets);

module.exports = router;
