// backend/testFullBackend.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const NumberModel = require("./models/Number");
const User = require("./models/User");
require("dotenv").config();

const BASE_URL = "http://localhost:5000/api"; // backend API base URL

// Test credentials
const TEST_USER = { username: "testuser", email: "admin@gmail.com", password: "admin" };
const TEST_ADMIN = { username: "admin", email: "admin@gmail.com", password: "admin" };

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sms-reseller";

mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ---------------- HELPER FUNCTIONS ---------------- //

async function ensureUser(userObj, isAdmin = false) {
  let user = await User.findOne({ email: userObj.email });

  const hashedPassword = await bcrypt.hash(userObj.password, 10);

  if (!user) {
    user = await User.create({
      username: userObj.username,
      email: userObj.email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
    });
    console.log(`${isAdmin ? "Admin" : "User"} created: ${userObj.email}`);
  } else {
    // Force password update to match test password
    user.password = hashedPassword;
    if (isAdmin) user.role = "admin";
    await user.save();
    console.log(`${isAdmin ? "Admin" : "User"} exists: ${userObj.email} (password reset)`);
  }

  return user;
}

async function seedNumbers() {
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
}

async function resetNumbers() {
  await NumberModel.updateMany(
    { isSingleUse: true },
    { $set: { status: "available", otpReceived: false, currentUserId: null, purpose: null } }
  );
  console.log("All single-use numbers reset to available.");
}

// ---------------- RUN FULL TEST ---------------- //

async function runTest() {
  try {
    // 1️⃣ Seed numbers and ensure users
    await seedNumbers();
    await ensureUser(TEST_USER);
    await ensureUser(TEST_ADMIN, true);
    await resetNumbers();

    // 2️⃣ User login
    console.log("\n===== USER LOGIN =====");
    const userRes = await axios.post(`${BASE_URL}/user/login`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    const userToken = userRes.data.token;
    console.log("User token OK");

    // 3️⃣ Admin login
    console.log("\n===== ADMIN LOGIN =====");
    const adminRes = await axios.post(`${BASE_URL}/admin/login`, {
      email: TEST_ADMIN.email,
      password: TEST_ADMIN.password,
    });
    const adminToken = adminRes.data.token;
    console.log("Admin token OK");

    // 4️⃣ Rent a single-use number
    console.log("\n===== RENT SINGLE-USE NUMBER =====");
    const rentRes = await axios.post(
      `${BASE_URL}/user/numbers/rent/single-use`,
      { provider: "Twilio", country: "US", purpose: "Test OTP" },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("Rented number:", rentRes.data.number.number);

    // 5️⃣ Mark OTP received
    console.log("\n===== OTP RECEIVED =====");
    const otpRes = await axios.put(
      `${BASE_URL}/user/numbers/otp-received/${rentRes.data.number._id}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("OTP received response:", otpRes.data.message);

    // 6️⃣ Cancel the rental
    console.log("\n===== CANCEL RENTAL =====");
    const cancelRes = await axios.put(
      `${BASE_URL}/user/numbers/cancel/${rentRes.data.number._id}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("Cancel response:", cancelRes.data.message);

  } catch (err) {
    if (err.response && err.response.data) console.error("TEST FAILED ❌:", err.response.data);
    else console.error("TEST FAILED ❌:", err.message || err);
  } finally {
    mongoose.disconnect();
  }
}

runTest();
