const crypto = require('crypto');

const PROVIDERS = Object.freeze(['manual', 'paystack', 'flutterwave', 'stripe']);

const getConfiguredProvider = () => process.env.PAYMENT_PROVIDER || 'manual';

const createPaymentReference = (orderNumber) =>
  `TD-${orderNumber}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;

// This is deliberately provider-neutral. Provider SDKs/webhooks belong in
// adapters added later; controllers only deal with this stable contract.
const createPaymentRequest = ({ orderNumber, amount, provider = getConfiguredProvider() }) => {
  if (!PROVIDERS.includes(provider)) {
    const error = new Error('Unsupported payment provider');
    error.status = 422;
    throw error;
  }

  return {
    provider,
    reference: createPaymentReference(orderNumber),
    amount: Number(amount),
    currency: process.env.PAYMENT_CURRENCY || 'NGN',
    requiresProviderRedirect: provider !== 'manual'
  };
};

module.exports = { PROVIDERS, getConfiguredProvider, createPaymentRequest };
