const SHIPPING_RATES = {
  standard: 0,
  express: 0
};

const calculateShippingCost = (shippingMethod = 'standard', subtotal = 0) => {
  return SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard;
};

module.exports = {
  calculateShippingCost
};