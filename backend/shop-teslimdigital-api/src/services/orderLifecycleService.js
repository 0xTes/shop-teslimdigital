const VALID_TRANSITIONS = Object.freeze({
  pending: ['paid', 'cancelled'],
  paid: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: []
});

const ORDER_STATUSES = Object.freeze(Object.keys(VALID_TRANSITIONS));

class LifecycleError extends Error {
  constructor(message) {
    super(message);
    this.status = 422;
  }
}

const assertTransition = (from, to) => {
  if (!ORDER_STATUSES.includes(to)) {
    throw new LifecycleError('Unsupported order status');
  }
  if (from === to) {
    throw new LifecycleError(`Order is already ${to}`);
  }
  if (!VALID_TRANSITIONS[from]?.includes(to)) {
    throw new LifecycleError(`Cannot transition an order from ${from} to ${to}`);
  }
};

const transitionOrder = async ({ order, status, actorId, transaction, paymentStatus }) => {
  assertTransition(order.status, status);

  // A processing order must have cleared payment. The paid transition is the
  // only lifecycle transition allowed to record payment collection.
  if (status === 'processing' && order.paymentStatus !== 'paid') {
    throw new LifecycleError('An order must be paid before processing');
  }
  if (paymentStatus && !['unpaid', 'paid', 'refunded'].includes(paymentStatus)) {
    throw new LifecycleError('Unsupported payment status');
  }
  if (paymentStatus === 'refunded' && status !== 'cancelled') {
    throw new LifecycleError('Refunds may only be recorded when cancelling an order');
  }

  const now = new Date();
  const nextPaymentStatus = paymentStatus || (status === 'paid' ? 'paid' : order.paymentStatus);
  const history = Array.isArray(order.statusHistory) ? order.statusHistory : [];
  const event = { from: order.status, to: status, at: now.toISOString(), actorId: actorId || null };

  await order.update({
    status,
    paymentStatus: nextPaymentStatus,
    paidAt: nextPaymentStatus === 'paid' && !order.paidAt ? now : order.paidAt,
    cancelledAt: status === 'cancelled' ? now : order.cancelledAt,
    statusHistory: [...history, event]
  }, { transaction });

  return order;
};

module.exports = { ORDER_STATUSES, VALID_TRANSITIONS, LifecycleError, assertTransition, transitionOrder };
