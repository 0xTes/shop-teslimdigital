# Teslim Digital Shop — Live Deployment Handoff

## Purpose and operating rule

This document transfers the project to the next ChatGPT session for **production deployment only**. Treat the repository and verified commit as the baseline. Do not widen the task into redesign, framework upgrades, visual rework, payment-provider implementation, data restructuring, or broad refactoring.

Allowed work is limited to:

1. Connecting the target Railway PostgreSQL/API and Vercel projects.
2. Supplying production configuration and deploying the already-verified application.
3. Running the documented migration and production acceptance checks.
4. Fixing a reproducible deployment blocker with the smallest isolated change, test, documentation update, and commit.
5. Improving GitHub release hygiene only as described below.

Any work outside those five items needs explicit user approval first.

## Verified baseline

- Repository: `0xTes/shop-teslimdigital`
- Remote: `https://github.com/0xTes/shop-teslimdigital.git`
- Branch: `main`
- Production baseline: `33aebc24eb4d697b4c388d56f8e11ba8639eade7` (`holistic refactor: verification green for production frontend build`)
- Remote state at handoff: local `main` is clean and aligned with `origin/main`.

Verified locally at this baseline:

```text
backend/shop-teslimdigital-api: npm test                  PASS (3/3)
frontend:                         npm run lint            PASS
frontend:                         npm run build           PASS
backend JavaScript syntax checks                           PASS
git diff --check                                        PASS
```

Do **not** amend, rebase, squash, reset, or force-push commit `33aebc2`: it is already on `origin/main`. The historical messages before it are imperfect, but rewriting published history has more risk than value. Improve history prospectively.

## What is already implemented

- Protected order lifecycle: `pending → paid → processing → shipped → delivered`, with valid pre-shipment cancellation paths only.
- Admin-only lifecycle and shipment management with immutable status-history events and automatic stock restoration on cancellation.
- Guest checkout, guest order lookup, customer history, address APIs, password reset flow, shipping tracking metadata, and email-service abstraction.
- Provider-neutral payment request abstraction. `manual` is the safe live default; no payment provider SDK/webhook is implemented yet.
- Admin operations API plus a protected storefront admin dashboard for metrics and lifecycle changes.
- SEO metadata, sitemap, robots, 404, responsive checkout/error/loading states, and the required `Visit Teslim Digital` footer call-to-action.
- Additive PostgreSQL migration runner, Railway healthcheck/deploy configuration, Vercel SPA configuration, OpenAPI, and operational documentation.

Reference documents:

- [Architecture](ARCHITECTURE.md)
- [API](API.md)
- [Migration notes](MIGRATIONS.md)
- [Deployment guide](DEPLOYMENT.md)

## Inputs the next ChatGPT must obtain before acting

Ask for these items through authenticated Railway/Vercel sessions or project invitations. Never ask the user to paste a long-lived secret into chat.

| Required decision/access | Why it is required |
| --- | --- |
| Railway project and target environment | Links the correct API and PostgreSQL service; prevents deploying to the wrong database. |
| Vercel project and target environment | Links the correct storefront project and deployment domain. |
| Final public domains | Needed before configuring `FRONTEND_URL`, `VITE_API_URL`, `VITE_APP_URL`, sitemap, and CORS. |
| Production SMTP provider/configuration | Enables order, shipment, delivery, and password-reset email. Without it email is intentionally skipped. |
| Payment decision | Keep `manual` for bank-transfer/manual reconciliation, or explicitly approve a separately scoped Paystack, Flutterwave, or Stripe adapter/webhook implementation. |
| Bootstrap admin email | Needed only after the owner approves promoting an existing user to the `admin` role. |

Recommended domain layout: storefront `https://shop.teslim.digital`; API `https://api.shop.teslim.digital`. Use the actual chosen values consistently instead of assuming these suggestions.

## Deployment runbook

### 1. Preflight and backup

1. Confirm the user has selected the exact Railway project/environment and Vercel project/environment.
2. Confirm `git status --short` is clean and `git rev-parse HEAD` is `33aebc2` (or a later deployment-only, reviewed commit).
3. Create a Railway PostgreSQL backup/snapshot before the first production migration. Record its timestamp in the deployment PR or release notes.
4. Confirm the final frontend and API domains before setting CORS variables.

### 2. Railway PostgreSQL and API

Create or select Railway Postgres, then deploy the API with repository root directory:

```text
backend/shop-teslimdigital-api
```

`railway.toml` intentionally runs:

```text
npm ci
npm run migrate && npm start
```

Set production variables in Railway, never in Git:

| Variable | Value/rule |
| --- | --- |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Railway Postgres service reference, not a copied credential when a reference is supported |
| `JWT_SECRET` | A new, unique, high-entropy secret generated in Railway |
| `FRONTEND_URL` | Exact final Vercel origin, e.g. `https://shop.teslim.digital` |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | SMTP provider values, when email is enabled |
| `SMTP_SECURE` | `true` only for implicit TLS; normally `false` for port 587 STARTTLS |
| `EMAIL_FROM` | Verified sender address, e.g. `"Teslim Digital" <orders@teslim.digital>` |
| `PAYMENT_PROVIDER` | `manual` until a provider adapter and verified webhook exist |
| `PAYMENT_CURRENCY` | `NGN` unless the business explicitly changes currency |

The service must start successfully, apply only the additive migration, and return HTTP 200 from:

```text
GET https://<api-domain>/health
```

Do not run `sequelize.sync({ force: true })`, `sequelize.sync({ alter: true })`, a destructive SQL statement, or a migration down operation in production.

### 3. Vercel storefront

Create or select the Vercel project with root directory:

```text
frontend
```

The included `vercel.json` supplies the SPA fallback. Set Vercel production variables before building:

| Variable | Value/rule |
| --- | --- |
| `VITE_API_URL` | `https://<api-domain>/api` |
| `VITE_APP_URL` | Exact canonical storefront URL |
| `VITE_GA_MEASUREMENT_ID` | Optional GA4 ID; leave blank if analytics is not approved |

Deploy the frontend after Railway is healthy. Vite variables are build-time values; changing them requires a new Vercel production deployment.

### 4. Link both services and check CORS

1. Load the Vercel deployment in a fresh browser session.
2. Confirm catalog calls originate from the final frontend domain and succeed against the Railway `/api` URL.
3. If CORS blocks requests, compare the browser origin byte-for-byte with Railway `FRONTEND_URL`, correct only the environment variable, and redeploy the API. Do not loosen CORS to wildcard origins when credentials are enabled.

## Production acceptance checklist

Perform these checks on the deployed domains and retain links/screenshots/log excerpts in the release record:

1. `GET /health` returns 200.
2. `GET /api/categories`, `GET /api/products`, and `GET /api/deals/current` return expected data.
3. Search, category filtering, product pages, cart persistence, sitemap, robots, and the footer `Visit Teslim Digital` link work.
4. Register and log in a test customer; profile and order history load.
5. Submit an authenticated checkout and a separate guest checkout. Confirm both orders persist with correct server-calculated totals/inventory.
6. Look up the guest order with its exact number and email. Verify an incorrect email cannot retrieve it.
7. With SMTP enabled, verify confirmation email, password-reset email, and shipment notification delivery. If SMTP is deliberately disabled, record that email is intentionally skipped.
8. After the owner authorizes an existing user as admin, set the role directly in Railway Postgres once:

   ```sql
   UPDATE "Users" SET role = 'admin' WHERE email = '<approved-admin-email>';
   ```

   Verify the exact email and production target immediately before executing this statement. Never promote an account based on a guess.

9. Log in as that admin and test a single disposable/test order through each permitted lifecycle transition. Confirm invalid skipped/reverse transitions are rejected and cancellation restores stock exactly once.
10. Add carrier/tracking data, check the customer/guest view, and verify a shipment email if SMTP is enabled.
11. Review Railway logs for startup/migration errors and Vercel browser console/network requests for errors.

## Payment boundary

The current production-safe flow creates an order as `pending` with `PAYMENT_PROVIDER=manual`; it does **not** collect card or wallet funds. This is intentional and must be communicated accurately in the checkout/payment copy and operations process.

Do not set `PAYMENT_PROVIDER=paystack`, `flutterwave`, or `stripe` merely because a secret is available. Live payment requires a separate, approved task that implements:

1. Provider adapter and hosted checkout/payment-intent creation.
2. Signed webhook verification and idempotency.
3. Transactional payment-to-order lifecycle update.
4. Reconciliation, refund handling, test-mode coverage, and production acceptance evidence.

## Rollback procedure

- **Frontend defect:** promote the previous Vercel production deployment.
- **API code defect:** redeploy the previously working Railway source/deployment only after confirming the additive schema changes remain backward compatible. They are designed to be additive.
- **Migration failure:** stop rollout, preserve logs, restore the Railway backup only with owner approval, and do not improvise a destructive down migration.
- **Secret exposure:** rotate the affected secret in the provider dashboard first, then update Railway/Vercel variables and redeploy.

## Git and GitHub operating standard

### History

- `main` is already clean and synchronized with `origin/main` at handoff. Preserve it.
- If a deployment-only code fix is truly necessary, branch from current `main` as `codex/deploy-production` (or a similarly specific `codex/` branch).
- Keep one concern per commit and use Conventional Commit-style messages, for example:
  - `docs(deploy): record production endpoints and validation evidence`
  - `fix(deploy): accept Railway healthcheck port`
  - `ci: add deployment verification workflow`
- Before each commit run the smallest relevant verification plus `git diff --check`.
- Never commit `.env`, provider keys, deployment screenshots containing credentials, `dist/`, or Railway/Vercel generated state.
- Never force-push `main`; do not amend published commits.

### GitHub outlook

After production is stable, improve the repository without changing application behavior:

1. Set the GitHub repository description to a concise, accurate summary such as: `Teslim Digital ecommerce storefront and Express/PostgreSQL API.`
2. Add relevant topics: `ecommerce`, `react`, `vite`, `express`, `postgresql`, `sequelize`, `railway`, and `vercel`.
3. Protect `main`: require pull requests, one approving review, a passing frontend lint/build check, and a passing backend test check. Do not require checks until their CI workflow exists and has passed at least once.
4. Add repository environments named `production` for Railway/Vercel deployment secrets; scope secrets to those environments rather than repository-wide plaintext variables.
5. Create a release or deployment note with the commit SHA, production URLs, migration identifier, backup timestamp, acceptance checklist evidence, and known payment mode (`manual`).
6. Create small, explicit follow-up issues only for work that has been approved: provider adapter/webhooks, automated CI checks, production monitoring, or additional admin console screens. Do not create speculative feature backlog items.

## Suggested continuation prompt for ChatGPT

> Continue the Teslim Digital Shop live deployment from `docs/LIVE_DEPLOYMENT_HANDOFF.md`. First verify the repository is clean and at the documented baseline. Restrict work to deployment, configuration, migration, production validation, and a narrowly scoped fix for a reproducible deployment blocker. Do not refactor, rewrite published Git history, implement a payment provider, or alter product data without explicit approval. Use authenticated Railway/Vercel sessions rather than requesting secrets in chat. Report each external change and stop for confirmation before any destructive database action or production role change.
