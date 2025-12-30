const WalletTransaction = require("../models/WalletTransaction");
const Wallet = require("../models/Wallet");

async function applyWalletTransaction({
  userId,
  amount,
  type,
  reason,
  reference = null,
}) {
  // Find wallet
  const wallet = await Wallet.findOne({ userId });

  if (!wallet) {
    throw new Error("Wallet not found");
  }

  const balanceBefore = Number(wallet.balance);

  if (isNaN(balanceBefore)) {
    throw new Error("Invalid wallet balance");
  }

  let balanceAfter;

  if (type === "debit") {
    if (balanceBefore < amount) {
      throw new Error("Insufficient wallet balance");
    }
    balanceAfter = balanceBefore - amount;
  } else {
    balanceAfter = balanceBefore + amount;
  }

  // Update wallet
  wallet.balance = balanceAfter;
  await wallet.save();

  // Log transaction
  await WalletTransaction.create({
    userId,
    type,
    amount,
    balanceBefore,
    balanceAfter,
    reason,
    reference,
  });

  return balanceAfter;
}

module.exports = { applyWalletTransaction };
