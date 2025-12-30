// backend/seedTestNumbers.js
const mongoose = require("mongoose");
const NumberModel = require("./models/Number");
require("dotenv").config();

// Use MONGO_URI from .env if available, otherwise default
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sms-reseller";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function seedNumbers() {
  try {
    const numbers = [
      { number: "+15551234567", country: "US", provider: "Twilio", status: "available", isSingleUse: true },
      { number: "+15559876543", country: "US", provider: "Twilio", status: "available", isSingleUse: true },
      { number: "+447911123456", country: "UK", provider: "Twilio", status: "available", isSingleUse: true },
    ];

    for (const num of numbers) {
      const existing = await NumberModel.findOne({ number: num.number });
      if (!existing) {
        await NumberModel.create(num);
        console.log("Created number:", num.number);
      } else {
        console.log("Number already exists:", num.number);
      }
    }

    console.log("All test numbers processed!");
  } catch (err) {
    console.error("Error seeding numbers:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedNumbers();
