// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// ===================== MIDDLEWARE =====================

// CORS
app.use(cors());

// JSON parser with raw body for webhook verification (Paystack needs this)
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf.toString(); // Required for signature verification
    },
  })
);

// ===================== DATABASE =====================
connectDB();

// ===================== HEALTH CHECK =====================
app.get("/", (req, res) => res.send("SMS Reseller API Backend is running..."));
app.get("/api/health", (req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || "development" })
);

// ===================== GENERIC WEBHOOK (for other providers) =====================
app.post("/api/webhook/provider", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ ok: false });
    }
    console.log("Provider webhook received:", req.body);
    res.json({ ok: true });
  } catch (err) {
    console.error("Provider webhook error:", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ===================== ROUTES =====================

// User auth routes
app.use("/api/user", require("./routes/user/userRoutes"));

// User feature routes
app.use("/api/user/numbers", require("./routes/user/numberRoutes"));
app.use("/api/user/dashboard", require("./routes/user/dashboardRoutes"));
app.use("/api/user/messages", require("./routes/user/messageRoutes"));
app.use("/api/user/wallet", require("./routes/user/walletRoutes"));
app.use("/api/transactions", require("./routes/user/transactionRoutes"));

// Wallet Funding (Paystack Virtual Account)
app.use('/api/wallet/funding', require('./routes/wallet/fundingRoutes'));


// Admin routes
app.use("/api/admin", require("./routes/admin/adminRoutes"));
app.use("/api/admin/numbers", require("./routes/admin/numberRoutes"));
app.use("/api/admin/providers", require("./routes/admin/providerRoutes"));
app.use("/api/admin/sender-ids", require("./routes/admin/senderIdRoutes"));
app.use("/api/admin/phone-numbers", require("./routes/admin/NumberRoutes"));
app.use("/api/admin/countries", require("./routes/admin/countryRoutes"));
app.use("/api/admin/wallet", require("./routes/admin/walletRoutes"));


// Provider webhook (SMS delivery reports, etc.)
app.use("/api/provider/sms", require("./routes/provider/smsWebhookRoutes"));

// Payments placeholder
app.use("/api/payments", (req, res) =>
  res.status(501).json({ ok: false, error: "Not implemented" })
);

// ===================== JOBS =====================
// Start auto-release expired numbers job
require("./jobs/releaseExpiredNumbers")();

// ===================== SERVER =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});