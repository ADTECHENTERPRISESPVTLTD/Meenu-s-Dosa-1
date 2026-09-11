# API Documentation — Meenu's Dosa Backend

## Base URL

- Local development: `http://localhost:5000/api`
- Netlify deployment: `https://<your-site>.netlify.app/api`

## Response Format

All responses follow a consistent shape.

Success:
```json
{ "success": true, "message": "Success", "data": { } }
```

Error:
```json
{ "success": false, "message": "Readable error message", "errors": [ { "field": "price", "message": "Price must be a non-negative number" } ] }
```

## Authentication

Admin endpoints require a JWT in the `Authorization` header:

```
Authorization: Bearer <token>
```

Obtain a token via `POST /api/admin/auth/login`. Tokens expire per `JWT_EXPIRES_IN` (default 1 day).

---

## Health

### `GET /api/health`
No auth. Returns server + database status only (no sensitive info).

---

## Menu (public)

### `GET /api/menu`
Query params (all optional): `category` (id), `available` (`true`/`false`), `featured`, `vegetarian`.
Returns array of menu items with populated `category` (`name`, `slug`, `image`).

### `GET /api/menu/:id`
Returns a single menu item.

---

## Categories (public)

### `GET /api/categories`
Query: `includeInactive=true` to include inactive categories (defaults to active only).
Returns categories sorted by `sortOrder`.

### `GET /api/categories/:id`

---

## Locations (public)

### `GET /api/locations`
Query: `includeInactive=true`.

### `GET /api/locations/:id`

---

## Restaurant Settings & Integrations (public)

### `GET /api/settings`
Returns restaurant profile: name, description, phone, whatsapp, instagram, zomato, swiggy, googleMaps, openingHoursSummary.

### `GET /api/settings/integrations`
Returns only public-safe integration data: `whatsappNumber` (for click-to-chat), `zomatoUrl`, `swiggyUrl`. Empty string when that integration is disabled. Never includes private API credentials.

---

## Bookings (public create)

### `POST /api/bookings`
Body:
```json
{
  "customerName": "string, 2-100 chars",
  "phone": "string, valid phone format",
  "date": "ISO8601 date",
  "time": "HH:mm",
  "guestCount": "integer 1-50",
  "message": "optional string, max 500 chars",
  "location": "location id (must be an active outlet)"
}
```
Response: created booking with `status: "pending"`. Validates all fields server-side regardless of frontend validation. Rejects dates in the past.

---

## Admin Auth

### `POST /api/admin/auth/login`
Body: `{ "email": "string", "password": "string" }`
Returns `{ token, admin: { id, name, email, role } }`. Rate-limited (10 attempts / 15 min per IP).

### `GET /api/admin/auth/me`
Auth required. Returns the current admin's profile.

### `POST /api/admin/auth/logout`
Auth required. Stateless — confirms logout for the frontend session flow; discard the token client-side.

---

## Admin — Dashboard

### `GET /api/admin/dashboard`
Auth required. Returns:
```json
{
  "menu": { "total": 0, "available": 0, "unavailable": 0 },
  "bookings": { "pending": 0, "confirmed": 0, "recent": [] }
}
```

---

## Admin — Menu Management

### `POST /api/admin/menu`
Auth required. Body: `{ name, category (id), description?, price, isAvailable?, isVegetarian?, isFeatured?, sortOrder? }`. `price` must be numeric and >= 0.

### `PUT /api/admin/menu/:id`
Auth required. Same fields, all optional.

### `DELETE /api/admin/menu/:id`
Auth required, role `super_admin` or `admin`.

---

## Admin — Category Management

### `POST /api/admin/categories`
Auth required. Body: `{ name, image, sortOrder?, isActive? }`. `image` is the category's shared image filename (e.g. `dosa.jpg`) — dishes never store their own image.

### `PUT /api/admin/categories/:id`
Auth required.

### `DELETE /api/admin/categories/:id`
Auth required, role `super_admin` or `admin`. Refused with `409` if menu items still reference the category.

---

## Admin — Booking Management

### `GET /api/admin/bookings`
Auth required. Query: `status`, `location` (id), `from`/`to` (ISO dates), `page`, `limit`. Returns `{ bookings, pagination }`.

### `GET /api/admin/bookings/:id`
Auth required.

### `PUT /api/admin/bookings/:id`
Auth required. Body: `{ "status": "pending" | "confirmed" | "rejected" | "completed" | "cancelled" }`.

---

## Admin — Location Management

### `POST /api/admin/locations`
Auth required. Body: `{ name, address, phone, openingHours?, mapsUrl?, zomatoUrl?, swiggyUrl?, isActive? }`.

### `PUT /api/admin/locations/:id`
Auth required.

### `DELETE /api/admin/locations/:id`
Auth required, role `super_admin` or `admin`.

---

## Admin — Settings Management

### `PUT /api/admin/settings`
Auth required. Body: any subset of restaurant settings fields.

### `PUT /api/admin/settings/integrations`
Auth required, role `super_admin` or `admin`. Body: any subset of `{ whatsappNumber, whatsappEnabled, zomatoUrl, zomatoEnabled, swiggyUrl, swiggyEnabled, trilioEnabled }`. Private credentials (Trilio tokens, WhatsApp Business API tokens) are configured only via environment variables and are not editable or readable through this endpoint.

---

## Error Responses

| Status | Meaning |
|---|---|
| 400 | Bad request / cast error |
| 401 | Missing/invalid/expired token, or bad login credentials |
| 403 | Authenticated but insufficient role |
| 404 | Resource not found |
| 409 | Conflict (e.g. duplicate record, category still in use) |
| 422 | Validation failed (see `errors` array) |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error (no internal details are leaked to the client) |
