# AGENTS.md

## Architecture

Express + TypeScript backend, MongoDB via Mongoose. Two entry points share the same Express app (`src/app.ts`):

- `src/server.ts` — standalone Node server (`npm run dev` / `npm start`)
- `netlify/functions/api.ts` — wraps the same app with `serverless-http` for Netlify Functions deployment

## Key Directories

- `src/config` — environment loading (`env.ts`) and MongoDB connection (`database.ts`)
- `src/models` — Mongoose schemas: `Admin`, `Category`, `MenuItem`, `Location`, `Booking`, `RestaurantSettings`, `IntegrationSettings`
- `src/controllers` — request handlers, one file per resource
- `src/routes` — Express routers; public routes (`menuRoutes`, `categoryRoutes`, `locationRoutes`, `bookingRoutes`, `settingsRoutes`, `healthRoutes`) vs. `adminRoutes` (all mounted behind `requireAdminAuth`)
- `src/middleware` — `auth.ts` (JWT verification + role check), `validate.ts` (express-validator error bridge), `errorHandler.ts` (centralized error + 404 handling, `asyncHandler` wrapper)
- `src/validators` — express-validator chains per resource
- `src/services/notificationService.ts` — messaging provider abstraction (Trilio today, swappable later); reads credentials only from env vars
- `src/seed/seed.ts` — idempotent seed script (upserts by slug/name, never duplicates)
- `src/utils` — `apiResponse.ts` (consistent `{ success, message, data }` shape), `errors.ts` (typed `AppError` subclasses), `jwt.ts`, `slug.ts`, `logger.ts` (redacts secrets in log lines)

## Conventions

- Every route handler is wrapped in `asyncHandler` — throw `AppError` subclasses (`NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError`, `ConflictError`) instead of manually shaping error responses; `errorHandler` middleware converts them to the standard JSON error shape.
- All success responses use `sendSuccess(res, data, message?, statusCode?)`; all error responses that aren't thrown exceptions use `sendError(res, message, statusCode, errors?)`.
- Admin routes are all mounted under `/api/admin` behind `requireAdminAuth`; destructive operations (`DELETE`) additionally require `requireRole('super_admin', 'admin')`.
- Prices are always stored and returned as numbers (never strings).
- Category images are a single filename per category (`Category.image`), referenced by menu items indirectly through `MenuItem.category` — never duplicated per dish.
- Never hardcode credentials or admin accounts in source. The only way to create the first admin is via `SEED_ADMIN_EMAIL`/`SEED_ADMIN_PASSWORD` env vars + `npm run seed`.
- Private integration credentials (Trilio, WhatsApp Business API) live in env vars only and are never included in any controller's response payload; `IntegrationSettings` stores only public destinations/flags.

## Non-Obvious Decisions

- `IntegrationSettings` and `RestaurantSettings` are separate models: `RestaurantSettings` is general restaurant info editable by admins; `IntegrationSettings` isolates ordering/messaging destinations and enable/disable flags so integrations can be toggled without touching restaurant info.
- The seed script upserts by `slug` (categories/menu items) or `name` (locations) specifically so re-running it during redeploys never creates duplicate records.
- Logout is stateless (JWT) — the `/api/admin/auth/logout` endpoint exists for a consistent frontend session flow but does not blacklist tokens server-side.
