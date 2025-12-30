const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/sms-reseller", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("adminpass", 10);

  const admin = new User({
    username: "admin2",
    email: "admin2@gmail.com",
    password: admin2,
    isAdmin: true,
  });

  await admin.save();
  console.log("Admin created successfully!");
  mongoose.disconnect();
}

createAdmin();
