const Country = require("../../models/Country");

// ADD Country
exports.addCountry = async (req, res) => {
  try {
    const { name, code, rate } = req.body;

    const exists = await Country.findOne({ code });
    if (exists) return res.status(400).json({ message: "Country already exists" });

    const country = new Country({ name, code, rate });
    await country.save();

    res.json({ message: "Country added successfully", country });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all
exports.getCountries = async (req, res) => {
  try {
    const countries = await Country.find();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE
exports.deleteCountry = async (req, res) => {
  try {
    await Country.findByIdAndDelete(req.params.id);
    res.json({ message: "Country deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
