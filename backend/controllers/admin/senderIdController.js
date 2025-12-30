const SenderId = require("../../models/SenderId");
const Provider = require("../../models/Provider");


// ADD Sender ID
exports.addSenderId = async (req, res) => {
  try {
    const { providerId, name } = req.body;

    if (!providerId || !name) {
      return res.status(400).json({ message: "Provider ID and name required" });
    }

    const exists = await SenderId.findOne({ providerId, name });
    if (exists) return res.status(400).json({ message: "Sender ID already exists for this provider" });

    const sender = await SenderId.create({ providerId, name });

    res.json({ message: "Sender ID added successfully", sender });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET all sender IDs
exports.getSenderIds = async (req, res) => {
  try {
    const senders = await SenderId.find().populate('providerId', 'name');
    res.json(senders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE Sender ID
exports.deleteSenderId = async (req, res) => {
  try {
    await SenderId.findByIdAndDelete(req.params.id);
    res.json({ message: "Sender ID deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
