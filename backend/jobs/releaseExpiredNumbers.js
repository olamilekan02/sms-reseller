// jobs/releaseExpiredNumbers.js
const NumberModel = require("../models/Number");
const Message = require("../models/Message");

const cron = require("node-cron");

// Run every 30 seconds for testing
cron.schedule("*/30 * * * * *", async () => {
  try {
    const now = new Date();

    const expired = await NumberModel.find({
      otpReceived: true,
      graceExpiry: { $lt: now },
      status: "rented"
    });

    let count = 0;
    for (const num of expired) {
      // DELETE ALL MESSAGES
      await Message.deleteMany({ numberId: num._id });

      // RELEASE NUMBER
      num.status = "available";
      num.currentUserId = null;
      num.otpReceived = false;
      num.graceExpiry = null;
      num.purpose = [];
      await num.save();

      count++;
    }

    if (count > 0) {
      console.log(`Released ${count} number(s) and deleted their messages`);
    } else {
      console.log("No expired numbers to release");
    }
  } catch (error) {
    console.error("Release job error:", error);
  }
});

console.log("Auto-release job scheduled (every 30 seconds for testing)");

module.exports = () => {};