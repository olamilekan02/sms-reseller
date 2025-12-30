const mongoose = require('mongoose');

const PricingSchema = new mongoose.Schema({
  country: String,
  service: String,
  costPrice: Number,
  sellingPrice: Number,
});

module.exports = mongoose.model('Pricing', PricingSchema);
