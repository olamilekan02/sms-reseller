const NumberModel = require("../../models/Number");

/**
 * ADD NUMBER
 */
exports.addNumber = async (req, res) => {
  try {
    const { number, country, provider, purpose = [], prices = {} } = req.body;

    if (!number || !country || !provider) {
      return res.status(400).json({ message: "number, country and provider are required" });
    }

    const exists = await NumberModel.findOne({ number });
    if (exists) {
      return res.status(400).json({ message: "Number already exists" });
    }

    const newNumber = await NumberModel.create({
      number,
      country,
      provider,
      purpose,
      prices,
      status: "available",
      isSingleUse: true,
    });

    res.json({ message: "Number added successfully", number: newNumber });
  } catch (error) {
    console.error("ADD NUMBER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE PRICES (per purpose)
 */
exports.updateNumberPricing = async (req, res) => {
  try {
    const { numberId, prices } = req.body;

    if (!numberId || !prices) {
      return res.status(400).json({ message: "numberId and prices are required" });
    }

    const number = await NumberModel.findById(numberId);
    if (!number) {
      return res.status(404).json({ message: "Number not found" });
    }

    number.prices = prices; // Map or object
    await number.save();

    res.json({ message: "Pricing updated successfully", number });
  } catch (error) {
    console.error("UPDATE PRICING ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET ALL NUMBERS (ADMIN)
 */
exports.getNumbers = async (req, res) => {
  try {
    const numbers = await NumberModel.find().sort({ createdAt: -1 });
    res.json(numbers);
  } catch (error) {
    console.error("GET NUMBERS ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE NUMBER
 */
exports.deleteNumber = async (req, res) => {
  try {
    const { id } = req.params;
    await NumberModel.findByIdAndDelete(id);
    res.json({ message: "Number deleted successfully" });
  } catch (error) {
    console.error("DELETE NUMBER ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};
