const Message = require("../../models/Message");
const NumberModel = require("../../models/Number");

// Get messages for a number (only owner)
exports.getMessagesByNumber = async (req, res) => {
  try {
    const { numberId } = req.params;
    const userId = req.user.userId;

    const number = await NumberModel.findOne({
      _id: numberId,
      currentUserId: userId,
    });

    if (!number) {
      return res.status(403).json({ message: "Access denied" });
    }

    const now = new Date();
    const expired = number.otpReceived && 
                    (!number.graceExpiry || number.graceExpiry < now);

    const messages = expired ? [] : await Message.find({ numberId }).sort({ receivedAt: -1 });

    res.json({
      expired,
      messages,
      number,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mock incoming SMS (for testing) - no status change
// Mock incoming SMS (for testing) - super safe
exports.mockIncomingSMS = async (req, res) => {
  try {
    const { numberId, sender, from, message, body } = req.body;

    if (!numberId) {
      return res.status(400).json({ message: "numberId is required" });
    }

    // Use whatever your Message model expects
    const msgData = {
      numberId,
      sender: sender || from || "+1234567890",  // fallback
      message: message || body || "Test OTP message",  // fallback
      from: sender || from || "+1234567890",  // if model uses 'from'
      body: message || body || "Test OTP message",  // if model uses 'body'
      timestamp: new Date(),
      receivedAt: new Date(),
    };

    const msg = await Message.create(msgData);

    const number = await NumberModel.findById(numberId);
    if (number && !number.otpReceived) {
      number.otpReceived = true;
      number.graceExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
      await number.save();
      console.log(`OTP received for ${number.number}. Grace period started.`);
    }

    res.json({ success: true, message: msg });
  } catch (error) {
    console.error("Mock SMS error details:", error); // This will show exact validation error in backend console
    res.status(500).json({ message: "Failed to save message", error: error.message });
  }
};