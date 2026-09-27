export function formatRupees(num: number | null | undefined): string {
  if (!num || isNaN(num)) return 'N/A';
  if (num >= 10000000) {
    const cr = num / 10000000;
    return `₹${cr % 1 === 0 ? cr : cr.toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    const lakh = num / 100000;
    return `₹${lakh % 1 === 0 ? lakh : lakh.toFixed(2)} Lakh`;
  }
  return `₹${num.toLocaleString('en-IN')}`;
}
