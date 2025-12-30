// backend/routes/admin/adminRoutes.js
const express = require("express");
const router = express.Router();

// Controllers
const adminController = require("../../controllers/admin/adminController");
const userAdminController = require("../../controllers/admin/userAdminController");
const numberAdminController = require("../../controllers/admin/numberAdminController");
const walletAdminController = require("../../controllers/admin/walletAdminController");
const transactionAdminController = require("../../controllers/admin/transactionAdminController"); // ← Uncommented

// Middleware
const adminMiddleware = require("../../middleware/adminMiddleware");

// -------------------- PUBLIC: Admin Login --------------------
router.post("/login", adminController.adminLogin);

// -------------------- PROTECTED ROUTES (Admin Only) --------------------
router.use(adminMiddleware); // All routes below require admin

// Dashboard
router.get("/dashboard", adminController.getDashboardStats);

// Users Management
router.get("/users", userAdminController.getAllUsers);
router.patch("/users/:id/block", userAdminController.blockUser);
router.patch("/users/:id/unblock", userAdminController.unblockUser);
router.delete("/users/:id", userAdminController.deleteUser);

// Numbers Management
router.get("/numbers", numberAdminController.getAllNumbers);
router.post("/numbers", numberAdminController.addNumber);
router.patch("/numbers/:id", numberAdminController.updateNumber);
router.delete("/numbers/:id", numberAdminController.deleteNumber);

// Wallets Management
router.get("/wallets", walletAdminController.getAllWallets);
router.post("/wallets/topup", walletAdminController.topUpWallet);

// Transactions — NOW ACTIVE
router.get("/transactions/all", transactionAdminController.getAllTransactions);

module.exports = router;