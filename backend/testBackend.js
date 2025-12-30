const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Replace with actual credentials
const USER_CREDENTIALS = { email: "admin@gmail.com", password: "admin" };
const ADMIN_CREDENTIALS = { email: "admin@gmail.com", password: "admin" };

let userToken = "";
let adminToken = "";

async function testBackend() {
  try {
    // ----- 1. USER LOGIN -----
    console.log("===== USER LOGIN =====");
    const userLogin = await axios.post(`${BASE_URL}/user/login`, USER_CREDENTIALS);
    userToken = userLogin.data.token;
    console.log("User token:", userToken);

    // ----- 2. ADMIN LOGIN -----
    console.log("\n===== ADMIN LOGIN =====");
    const adminLogin = await axios.post(`${BASE_URL}/admin/login`, ADMIN_CREDENTIALS);
    adminToken = adminLogin.data.token;
    console.log("Admin token:", adminToken);

    // ----- 3. RENT SINGLE-USE NUMBER -----
    console.log("\n===== RENT SINGLE-USE NUMBER =====");
    const rentResponse = await axios.post(
      `${BASE_URL}/user/numbers/rent/single-use`,
      { country: "US", provider: "Twilio", purpose: "Test OTP" },
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("Rent Response:", rentResponse.data);
    const numberId = rentResponse.data.number._id;

    // ----- 4. MARK OTP RECEIVED -----
    console.log("\n===== MARK OTP RECEIVED =====");
    const otpResponse = await axios.put(
      `${BASE_URL}/user/numbers/otp-received/${numberId}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("OTP Received Response:", otpResponse.data);

    // ----- 5. CANCEL / RETRY -----
    console.log("\n===== CANCEL / RETRY =====");
    const cancelResponse = await axios.put(
      `${BASE_URL}/user/numbers/cancel/${numberId}`,
      {},
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    console.log("Cancel Response:", cancelResponse.data);

    // ----- 6. LIST USER NUMBERS -----
    console.log("\n===== LIST USER NUMBERS =====");
    const userNumbers = await axios.get(`${BASE_URL}/user/numbers/my-numbers`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    console.log("User Numbers:", userNumbers.data);

    // ----- 7. ADMIN DASHBOARD STATS -----
    console.log("\n===== ADMIN DASHBOARD STATS =====");
    const adminStats = await axios.get(`${BASE_URL}/admin/dashboard`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("Admin Stats:", adminStats.data);

    // ----- 8. LIST ALL USERS -----
    console.log("\n===== LIST ALL USERS (ADMIN) =====");
    const allUsers = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("All Users:", allUsers.data);

    // ----- 9. LIST ALL RENTALS -----
    console.log("\n===== LIST ALL RENTALS (ADMIN) =====");
    const allRentals = await axios.get(`${BASE_URL}/admin/rentals`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    console.log("All Rentals:", allRentals.data);

    console.log("\n===== BACKEND TEST COMPLETE =====");
  } catch (error) {
    console.error("Test Error:", error.response?.data || error.message);
  }
}

testBackend();
