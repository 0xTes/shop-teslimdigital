export function formatNaira(amount) {
  const value =
    typeof amount === "string"
      ? Number.parseFloat(amount)
      : Number(amount);

  if (!Number.isFinite(value)) {
    return "₦0";
  }

  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}