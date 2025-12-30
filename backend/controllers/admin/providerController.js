const Provider = require('../../models/Provider');

// Add provider
exports.addProvider = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Provider name required' });

    const provider = await Provider.create({ name });
    res.json({ message: 'Provider added', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all providers
exports.getProviders = async (req, res) => {
  try {
    const providers = await Provider.find();
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
