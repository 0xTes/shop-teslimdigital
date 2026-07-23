# Deployment guide

## Railway API and PostgreSQL

Create a Railway PostgreSQL service and an API service whose root directory is `backend/shop-teslimdigital-api`. Railway reads `railway.toml`, installs locked dependencies, runs additive migrations, then starts Express. Configure:

| Variable | Required | Notes |
| --- | --- | --- |
| `DATABASE_URL` | Yes | Use the Railway Postgres service reference. |
| `JWT_SECRET` | Yes | Long, unique production secret. |
| `FRONTEND_URL` | Yes | Exact Vercel production URL. |
| `NODE_ENV` | Yes | `production`. |
| `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` | Optional | Enables confirmation, shipping, and reset email. |
| `SMTP_PORT`, `SMTP_SECURE`, `EMAIL_FROM` | Optional | SMTP transport details. |
| `PAYMENT_PROVIDER`, provider secret keys | Optional | Keep `manual` until a vetted adapter/webhook is enabled. |

After deployment, confirm the Railway healthcheck at `/health` and set the CORS `FRONTEND_URL` to the final Vercel domain. Add a second allowed origin only after explicitly extending the CORS configuration.

## Vercel storefront

Import the repository in Vercel and choose `frontend` as the project root. The included `vercel.json` provides the SPA fallback. Configure:

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_API_URL` | Yes | `https://<railway-api-domain>/api` |
| `VITE_APP_URL` | Yes | Canonical storefront URL, normally `https://shop.teslim.digital` |
| `VITE_GA_MEASUREMENT_ID` | Optional | Google Analytics measurement ID |

Deploy after setting variables; Vite variables are compiled at build time. Verify the following production journeys: browse and search products, authenticated checkout, guest checkout and lookup, order history, password reset request, lifecycle update as an admin, and the `Visit Teslim Digital` footer link.

## Search and monitoring

The storefront ships a robots file, sitemap, canonical metadata, Open Graph metadata, and optional Google Analytics. Add the deployed sitemap URL to Google Search Console. Configure Railway/Vercel log alerts externally for 5xx errors, failed healthchecks, and migration failures.
