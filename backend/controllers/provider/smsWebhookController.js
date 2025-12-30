const Number = require("../../models/Number");

exports.receiveSms = async (req, res) => {
  try {
    const { to, message } = req.body;

    const number = await Number.findOne({ number: to });

    if (!number) {
      return res.json({ ok: true });
    }

    // NEW: If already received OTP, ignore (prevent multiple processing)
    if (number.otpReceived) {
      console.log("OTP already received for", to, " — ignoring duplicate");
      return res.json({ ok: true });
    }

    // Mark OTP received
    number.otpReceived = true;

    // NEW: Set grace expiry if not set (e.g., 5 minutes grace)
    if (!number.graceExpiry) {
      number.graceExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    }

    // For single use, set shorter grace (immediate release in job)
    if (number.isSingleUse) {
      number.graceExpiry = new Date(Date.now() + 30 * 1000); // 30 sec for testing
      number.status = "expired"; // Mark as expired to trigger job
    }

    await number.save();

    // Optional: Log for debugging
    console.log("OTP received for", to, " — grace expiry set to", number.graceExpiry);

    res.json({ ok: true });
  } catch (err) {
    console.error("SMS WEBHOOK ERROR:", err.message);
    res.status(500).json({ ok: false });
  }
};