/**
 * Resolves and validates purpose key for a phone number
 * Ensures the purpose exists in number.prices
 */
const resolvePurposeKey = (numberDoc, purpose) => {
  if (!numberDoc || !numberDoc.prices) return null;

  const normalizedPurpose = String(purpose).toLowerCase();

  // prices is a Map (mongoose)
  if (numberDoc.prices.has(normalizedPurpose)) {
    return normalizedPurpose;
  }

  return null;
};

module.exports = { resolvePurposeKey };
