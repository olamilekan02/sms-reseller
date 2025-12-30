// backend/createTestNumbers.js
const mongoose = require("mongoose");
const Number = require("./models/Number");

mongoose.connect("mongodb://127.0.0.1:27017/sms-reseller")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

async function createNumbers() {
  const numbers = [
    { number: "+15551234567", country: "US", provider: "Twilio", status: "available", isSingleUse: true },
    { number: "+15559876543", country: "US", provider: "Twilio", status: "available", isSingleUse: true },
    { number: "+447911123456", country: "UK", provider: "Twilio", status: "available", isSingleUse: true }
  ];

  try {
    for (const num of numbers) {
      // Upsert to avoid duplicates
      const existing = await Number.findOne({ number: num.number });
      if (!existing) {
        await Number.create(num);
        console.log("Created number:", num.number);
      } else {
        console.log("Number already exists:", num.number);
      }
    }
    console.log("All test numbers processed!");
  } catch (err) {
    console.error("Error creating numbers:", err);
  } finally {
    mongoose.disconnect();
  }
}

createNumbers();
