const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    numberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Number",
      required: true,
    },
    sender: { type: String, required: true },
    message: { type: String, required: true },
    receivedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);