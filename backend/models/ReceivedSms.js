const mongoose = require('mongoose');

const ReceivedSmsSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'SmsOrder' },
  smsText: String,
  code: String,
  receivedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ReceivedSms', ReceivedSmsSchema);
