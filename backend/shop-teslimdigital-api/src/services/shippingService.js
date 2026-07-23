const SHIPPING_RATES = Object.freeze({
  standard: 2500,
  express: 5000
});

const calculateShippingCost = (shippingMethod = 'standard', subtotal = 0) => {
  return SHIPPING_RATES[shippingMethod] ?? SHIPPING_RATES.standard;
};

module.exports = {
  calculateShippingCost,
  SHIPPING_RATES
};
