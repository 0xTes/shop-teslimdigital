# Architecture

## Runtime boundaries

The Vercel frontend is a React 19 single-page application. React Query owns API request/cache state, Zustand owns the persistent cart and authentication session state, and React Router owns page navigation. The public Vercel rewrite serves `index.html` for client-side routes.

The Railway service is an Express API organized by responsibility under `src/`: routes perform transport wiring, controllers perform request/response work, services hold reusable domain integrations, models own Sequelize persistence, and middleware handles authentication, validation, rate limiting, and errors. PostgreSQL is the only source of transactional business state.

## Order aggregate

`Order` is the checkout record, `OrderItem` stores purchase-time product snapshots, and `Shipping` is a one-to-one extension for carrier, tracking, shipment, and delivery metadata. Prices and inventory are read and decremented inside the create-order transaction; browser prices are never trusted.

Lifecycle transitions are centralized in `orderLifecycleService`:

```text
pending -> paid -> processing -> shipped -> delivered
     \-> cancelled     \-> cancelled
                     (from processing only before shipment)
```

Only an authenticated admin can call lifecycle and shipping management endpoints. Each successful transition records an actor/time audit event in `Order.statusHistory`; cancellation restores reserved inventory atomically. Customers can view only their own orders. Guest retrieval requires both the order number and checkout email.

## Payments and email

Controllers request a provider-neutral payment request from `paymentService`. It supports `manual`, `paystack`, `flutterwave`, and `stripe` identifiers without embedding any provider SDK or secret in transport code. Future integrations should be adapters that verify provider webhooks and invoke the lifecycle service transactionally.

Email is also an abstraction. When SMTP is not configured, sends are safely skipped rather than blocking checkout. Confirmation, shipping, delivery, and password-reset workflows share the same service.
