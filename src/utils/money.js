// Helpers for formatting INR amounts the way an Indian real-estate employee would speak them.

function formatINR(amount) {
  if (amount === null || amount === undefined) return null;
  const n = Number(amount);
  if (Number.isNaN(n)) return null;

  if (n >= 10000000) {
    const cr = n / 10000000;
    return `₹${trimZero(cr)} Cr`;
  }
  if (n >= 100000) {
    const lakh = n / 100000;
    return `₹${trimZero(lakh)} L`;
  }
  if (n >= 1000) {
    const k = n / 1000;
    return `₹${trimZero(k)}K`;
  }
  return `₹${n}`;
}

function trimZero(num) {
  return Math.round(num * 100) / 100;
}

module.exports = { formatINR };
