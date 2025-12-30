const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["buy", "topup"], // Add "refund" if needed later
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true, // Make required for tracking
      unique: true,
    },
    meta: Object,
  },
  { timestamps: true }
);

// Index for user transaction history
transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);