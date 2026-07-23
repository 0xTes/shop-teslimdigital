# Migration notes

Run migrations with `npm run migrate` from `backend/shop-teslimdigital-api`. The migration runner first creates only missing Sequelize tables, then records and applies additive migration files in `SequelizeMeta` within transactions. It does not run destructive alterations.

`001-order-lifecycle-and-shipping.js` safely adds lifecycle payment/audit fields and indexes to `Orders`, plus `Shippings` and `Addresses` if absent. It is idempotent for databases where a local `sequelize.sync()` already created the new fields.

For an existing Railway database:

1. Take a Railway backup before deployment.
2. Deploy the new service; `railway.toml` runs `npm run migrate && npm start`.
3. Confirm `GET /health`, `GET /api/categories`, `GET /api/products`, and an authenticated admin lifecycle update in a staging environment.
4. Never use `sync({ force: true })`, `sync({ alter: true })`, or a destructive migration in production.
