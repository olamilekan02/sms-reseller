const mongoose = require("mongoose");

const walletTransactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceBefore: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    reason: {
      type: String,
      required: true,
      // examples: "Number Rental", "Number Purchase", "Admin Credit"
    },

    reference: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);
