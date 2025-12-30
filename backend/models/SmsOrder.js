const mongoose = require('mongoose');

const SmsOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  country: String,
  service: String,
  number: String,
  orderIdFromProvider: String,
  cost: Number,
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SmsOrder', SmsOrderSchema);
