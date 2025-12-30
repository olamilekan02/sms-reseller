const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/numberController");
const { auth } = require("../../middleware/auth");
const admin = require("../../middleware/adminMiddleware");

router.get("/", auth, admin, controller.getNumbers);
router.post("/add", auth, admin, controller.addNumber);
router.post("/pricing", auth, admin, controller.updateNumberPricing);
router.delete("/:id", auth, admin, controller.deleteNumber);

module.exports = router;
