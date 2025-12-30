const mongoose = require("mongoose");

const numberSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    provider: { type: String, required: true },
    countryFlag: { type: String },
    status: {
      type: String,
      enum: ["available", "rented", "expired"],
      default: "available",
    },
    isSingleUse: { type: Boolean, default: true },
    otpReceived: { type: Boolean, default: false },
    graceExpiry: { type: Date, default: null }, // NEW: For grace period after OTP
    currentUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    purpose: { type: [String], default: [] },
    prices: {
      type: Map,
      of: new mongoose.Schema(
        {
          buy: { type: Number, required: true },
        },
        { _id: false }
      ),
      default: new Map(),
    },
  },
  { timestamps: true }
);

// PRE-SAVE HOOK TO KEEP KEYS LOWERCASE
numberSchema.pre("save", async function () {
  if (!this.prices || !(this.prices instanceof Map)) {
    return;
  }
  const newPrices = new Map();
  let changed = false;
  for (const [key, value] of this.prices.entries()) {
    if (typeof key === "string") {
      const lowerKey = key.trim().toLowerCase();
      newPrices.set(lowerKey, value);
      if (lowerKey !== key) changed = true;
    } else {
      newPrices.set(key, value);
    }
  }
  if (changed) {
    this.prices = newPrices;
  }
});

module.exports = mongoose.model("Number", numberSchema, "numbers");