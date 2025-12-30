const NumberModel = require('../../models/Number');
const SmsMessage = require('../../models/SmsMessage');

exports.getMyNumbers = async (req, res) => {
  try {
    const userId = req.user.userId;

    const numbers = await NumberModel.find({
      currentUserId: userId,
      isActive: true
    }).select('-__v');

    res.json(numbers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getMessagesForNumber = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { numberId } = req.params;

    const messages = await SmsMessage.find({
      numberId,
      userId
    }).sort({ receivedAt: -1 }); // latest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
