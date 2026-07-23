const test = require('node:test');
const assert = require('node:assert/strict');
const {
  VALID_TRANSITIONS, assertTransition, LifecycleError
} = require('../src/services/orderLifecycleService');
const { createPaymentRequest } = require('../src/services/paymentService');

test('lifecycle permits only the documented progression', () => {
  assert.deepEqual(VALID_TRANSITIONS.pending, ['paid', 'cancelled']);
  assert.doesNotThrow(() => assertTransition('pending', 'paid'));
  assert.doesNotThrow(() => assertTransition('processing', 'shipped'));
  assert.doesNotThrow(() => assertTransition('shipped', 'delivered'));
});

test('lifecycle rejects skipped, reverse and terminal transitions', () => {
  for (const [from, to] of [['pending', 'processing'], ['shipped', 'cancelled'], ['delivered', 'shipped']]) {
    assert.throws(() => assertTransition(from, to), LifecycleError);
  }
});

test('provider-neutral payment requests expose no provider credentials', () => {
  const request = createPaymentRequest({ orderNumber: 'TD-EXAMPLE', amount: 2500, provider: 'manual' });
  assert.equal(request.provider, 'manual');
  assert.equal(request.amount, 2500);
  assert.match(request.reference, /^TD-TD-EXAMPLE-/);
  assert.equal(request.requiresProviderRedirect, false);
});
