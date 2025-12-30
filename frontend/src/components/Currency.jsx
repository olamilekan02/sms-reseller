// src/components/Currency.jsx
import React from "react";

const Currency = ({ amount = 0, className = "" }) => {
  return (
    <span className={className}>
      ₦{Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
    </span>
  );
};

export default Currency;