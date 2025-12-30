const express = require("express");
const router = express.Router();
const {
  addNumber,
  getNumbers,
  deleteNumber
} = require("../../controllers/admin/NumberController");

router.post("/add", addNumber);
router.get("/", getNumbers);
router.delete("/:id", deleteNumber);

module.exports = router;
