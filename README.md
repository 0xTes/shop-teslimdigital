# Teslim Digital Shop

Teslim Digital Shop is a React/Vite storefront backed by an Express, Sequelize, and PostgreSQL API. It supports catalog browsing, promotions, persistent cart state, customer accounts, guest checkout, secure guest order lookup, order lifecycle administration, shipping tracking, and password reset email flows.

The business catalogue is deliberately limited to Merchandise, Campaigns, Books, and Gadgets. Music may be promoted through external links, but is not product inventory.

## Repository layout

| Path | Responsibility |
| --- | --- |
| `frontend/` | Vite storefront deployed to Vercel |
| `backend/shop-teslimdigital-api/` | Express API deployed to Railway |
| `backend/shop-teslimdigital-api/migrations/` | Additive, tracked PostgreSQL migrations |
| `docs/` | Architecture, API, deployment, and migration handoff material |

## Local development

1. Copy `backend/shop-teslimdigital-api/.env.example` to `.env` in the same directory and set `DATABASE_URL` and a long `JWT_SECRET`.
2. Copy `frontend/.env.example` to `frontend/.env.local` and point `VITE_API_URL` at the local API.
3. In one terminal, run `npm install` then `npm run migrate` and `npm run dev` from `backend/shop-teslimdigital-api`.
4. In another terminal, run `npm install` then `npm run dev` from `frontend`.

## Verification

```sh
cd backend/shop-teslimdigital-api && npm test
cd frontend && npm run lint && npm run build
```

## Deployment

Deploy `backend/shop-teslimdigital-api` as the Railway service root and `frontend` as the Vercel project root. Railway applies migrations before starting and serves `GET /health`. Configure the variables documented in [Deployment](docs/DEPLOYMENT.md), then set the Railway public API URL in Vercel as `VITE_API_URL`.

See [Architecture](docs/ARCHITECTURE.md), [API](docs/API.md), [Migrations](docs/MIGRATIONS.md), and [Deployment](docs/DEPLOYMENT.md) for the complete operational handoff. For an AI-safe, scope-controlled live rollout, start with the [Live Deployment Handoff](docs/LIVE_DEPLOYMENT_HANDOFF.md).
