const mongoose = require('mongoose');

const SmsMessageSchema = new mongoose.Schema({
  Number: { type: String, required: true },
  numberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Number' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SmsMessage', SmsMessageSchema);
