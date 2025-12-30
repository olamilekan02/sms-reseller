const router = require("express").Router();
const { auth } = require("../../middleware/auth");



router.get("/available", auth, rent.getAvailableNumbers);
router.post("/rent", auth, rent.rentNumber);

module.exports = router;
