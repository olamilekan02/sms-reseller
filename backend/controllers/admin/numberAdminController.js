// backend/controllers/admin/numberAdminController.js
const NumberModel = require("../../models/Number");

exports.getAllNumbers = async (req, res) => {
  try {
    const numbers = await NumberModel.find().sort({ createdAt: -1 });
    res.json(numbers);
  } catch (err) {
    console.error("Get numbers error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addNumber = async (req, res) => {
  try {
    const newNumber = new NumberModel(req.body);
    await newNumber.save();
    res.status(201).json(newNumber);
  } catch (err) {
    console.error("Add number error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.updateNumber = async (req, res) => {
  try {
    const updated = await NumberModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Number not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update number error:", err);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteNumber = async (req, res) => {
  try {
    const deleted = await NumberModel.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Number not found" });
    res.json({ message: "Number deleted successfully" });
  } catch (err) {
    console.error("Delete number error:", err);
    res.status(500).json({ message: "Server error" });
  }
};