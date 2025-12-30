// migrate.js - FIXED VERSION
require('dotenv').config(); // Loads your .env file (same as your app)
const mongoose = require('mongoose');
const NumberModel = require('./models/Number'); // Adjust path if needed

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI); // Uses your .env MONGO_URI
    console.log('Connected! Migrating prices...');

    const numbers = await NumberModel.find({ prices: { $exists: true } });
    let updatedCount = 0;

    for (const num of numbers) {
      let changed = false;
      const newPrices = new Map();

      // Handle Map or Object
      if (num.prices instanceof Map) {
        for (const [key, value] of num.prices.entries()) {
          if (typeof key === 'string') {
            const lowerKey = key.trim().toLowerCase();
            newPrices.set(lowerKey, value);
            if (lowerKey !== key) changed = true;
          } else {
            newPrices.set(key, value);
          }
        }
      } else if (typeof num.prices === 'object' && num.prices !== null) {
        for (const [key, value] of Object.entries(num.prices)) {
          const lowerKey = key.trim().toLowerCase();
          newPrices.set(lowerKey, value);
          if (lowerKey !== key) changed = true;
        }
      }

      if (changed) {
        num.prices = newPrices;
        await num.save();
        updatedCount++;
        console.log(`✅ Updated number ${num.number} (${num._id})`);
      }
    }

    console.log(`\n🎉 Migration complete! Updated ${updatedCount} numbers.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();