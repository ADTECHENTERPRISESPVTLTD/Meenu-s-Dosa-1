# Meenu's Dosa — Backend API

Production backend for Meenu's Dosa's website: Node.js, Express, TypeScript, MongoDB/Mongoose, JWT-based admin authentication. This repository currently contains the backend only; the frontend will be connected once it is built.

## Tech Stack

- Node.js + Express.js + TypeScript
- MongoDB with Mongoose
- JWT authentication with bcrypt password hashing
- express-validator for request validation
- helmet, cors, express-rate-limit for security
- Deployable as a standalone Node server or as a Netlify Function (`netlify/functions/api.ts`)

## Project Setup

```bash
npm install
cp .env.example .env
# fill in .env with real values (see Environment Variables below)
```

## Environment Variables

All configuration lives in environment variables — nothing is hardcoded in source. See `.env.example` for the full list:

- `PORT`, `NODE_ENV`
- `MONGODB_URI` — MongoDB Atlas (or any MongoDB) connection string
- `JWT_SECRET`, `JWT_EXPIRES_IN`
- `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME` — used only by the seed script to create the first admin account; never hardcoded
- `FRONTEND_URL`, `ADDITIONAL_ALLOWED_ORIGINS` — CORS allow-list
- `RATE_LIMIT_WINDOW_MINUTES`, `RATE_LIMIT_MAX_REQUESTS`
- `WHATSAPP_*` — public click-to-chat number plus optional WhatsApp Business API credentials (server-side only)
- `ZOMATO_URL`, `SWIGGY_URL` — external ordering destinations
- `TRILIO_*` — messaging provider credentials (server-side only, never sent to the frontend)

## Database Setup

Use a MongoDB Atlas cluster (or self-hosted MongoDB) and put the connection string in `MONGODB_URI`. The app fails fast and refuses to start in production if the database cannot be reached.

## Seed Command

```bash
npm run seed
```

This populates categories, the full approved menu, a default outlet location, restaurant settings, integration settings, and (if `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` are set) a first admin account. It is idempotent — re-running it will not create duplicate records; existing records are matched by slug/name and updated in place.

## Development

```bash
npm run dev
```

Runs the API with live reload on `http://localhost:5000` (or your configured `PORT`).

## Production

```bash
npm run build
npm start
```

`npm run build` compiles TypeScript to `dist/`. `npm start` runs the compiled server.

## API Architecture

- Public routes: `/api/health`, `/api/menu`, `/api/categories`, `/api/locations`, `/api/settings`, `POST /api/bookings`
- Admin auth: `/api/admin/auth/login`, `/api/admin/auth/me`, `/api/admin/auth/logout`
- Protected admin routes (JWT required): `/api/admin/menu`, `/api/admin/categories`, `/api/admin/bookings`, `/api/admin/locations`, `/api/admin/settings`, `/api/admin/dashboard`

Full endpoint-by-endpoint documentation is in `API_DOCUMENTATION.md`.

## Admin Setup

There is no hardcoded admin account. To create the first admin, set `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `.env` and run `npm run seed`. Additional admins can then be created directly in the database, or a "create admin" flow can be added later behind `super_admin` role protection.

## External Integrations

- **WhatsApp**: a centralized, configurable click-to-chat number (`WHATSAPP_PHONE_NUMBER`) is exposed publicly via `/api/settings/integrations`. Optional WhatsApp Business API credentials stay server-side.
- **Zomato / Swiggy**: the backend stores the approved ordering links centrally (`ZOMATO_URL`, `SWIGGY_URL`, or per-location `zomatoUrl`/`swiggyUrl`) and exposes them via `/api/settings/integrations` and `/api/locations`. The website only links out — no order tracking or fake confirmations are implemented.
- **Trilio**: a `MessageProvider` abstraction (`src/services/notificationService.ts`) isolates the messaging integration so the provider can change without touching calling code. Credentials are read only from environment variables and are never returned by any API response.

## Deployment

This backend can run:
1. As a standalone Node process (any VM/container host) using `npm run build && npm start`.
2. As a Netlify Function — `netlify/functions/api.ts` wraps the same Express app with `serverless-http`, and `netlify.toml` redirects `/api/*` to it.

Set all environment variables in the hosting provider's dashboard (Netlify environment variables, or equivalent). Never commit a real `.env` file.
