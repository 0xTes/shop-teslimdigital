# API reference

All API paths are rooted at `/api` and return JSON. Authenticated calls use `Authorization: Bearer <JWT>`. The machine-readable companion is [OpenAPI](../backend/shop-teslimdigital-api/docs/openapi.yaml).

## Public catalog

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/categories` | List categories |
| GET | `/products` | Paginated/filterable products: `search`, `category`, `sort`, `page`, `limit` |
| GET | `/products/featured` | Featured products |
| GET | `/products/related` | Related products by `productId` or `categoryId` |
| GET | `/products/:slug` | Product by slug |
| GET | `/deals/current` | Active weekly promotions |
| GET/POST | `/reviews/product/:productId` | List or create a product review |

## Account and customer data

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register with email or phone and password |
| POST | `/auth/login` | Receive JWT and public user profile |
| POST | `/auth/forgot-password` | Email a one-hour reset link (non-enumerating response) |
| POST | `/auth/reset-password` | Reset with a signed reset token |
| GET | `/auth/me` | Current account |
| GET/PUT | `/users/profile` | Current profile |
| GET/POST | `/users/addresses` | List/create saved addresses |
| PUT/DELETE | `/users/addresses/:addressId` | Update/delete an owned address |

## Orders

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/orders` | Guest or authenticated checkout; validates inventory server-side |
| GET | `/orders/mine` | Authenticated customer order history |
| GET | `/orders/:orderId` | Authenticated owner order detail |
| GET | `/orders/lookup?orderNumber=&email=` | Guest order detail, requiring both values |

## Admin (JWT with `role: admin`)

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/admin/dashboard` | Operations metrics and revenue summary |
| GET | `/admin/orders` | Paginated orders; filter by `status`, `paymentStatus`, or `search` |
| PATCH | `/admin/orders/:orderId/status` | Guarded lifecycle change, optional payment status |
| PATCH | `/admin/orders/:orderId/shipping` | Carrier, tracking URL/number, shipment/delivery timestamps |
| GET | `/admin/customers` | Paginated customers |
| GET/POST/PATCH | `/admin/products[/:productId]` | Product management |
| GET/POST/PATCH | `/admin/categories[/:categoryId]` | Category management |
| GET/POST/PATCH | `/admin/deals[/:dealId]` | Promotion management |
| GET | `/admin/reviews` | Review moderation listing |

`PATCH /admin/orders/:orderId/status` accepts `status` and optional `paymentStatus`. Valid order status transitions are documented in [Architecture](ARCHITECTURE.md); invalid, reverse, and terminal transitions return HTTP 422.
