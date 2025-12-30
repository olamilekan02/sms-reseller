const express = require("express");
const router = express.Router();
const {
  addCountry,
  getCountries,
  deleteCountry
} = require("../../controllers/admin/countryController");

router.post("/add", addCountry);
router.get("/", getCountries);
router.delete("/:id", deleteCountry);

module.exports = router;
