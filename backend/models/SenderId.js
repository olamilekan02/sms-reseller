const mongoose = require('mongoose');

const SenderIdSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider', required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

SenderIdSchema.index({ providerId: 1, name: 1 }, { unique: true }); // unique per provider

module.exports = mongoose.model('SenderId', SenderIdSchema);
