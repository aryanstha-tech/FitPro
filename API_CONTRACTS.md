# FitPro API Contracts — Phase 4

Agreed between frontend (Next.js) and backend (Django REST Framework)
before backend implementation starts, per the plan's strict build order.
All request/response shapes below mirror the TypeScript interfaces
already in `frontend/lib/mock-data.ts`, so swapping mock data for real
calls in Phase 7 is a drop-in, not a rewrite.

**Base path:** `/api/v1/`
**Format:** JSON. **Auth:** JWT bearer token unless noted.
**Pagination:** list endpoints return `{ count, next, previous, results }`
(DRF's default `PageNumberPagination`), page size 20 unless noted.
**Errors:** `4xx` responses return `{ "detail": string }` for single
errors, or `{ "field_name": [string, ...] }` for validation errors (DRF
default). Standard status codes: `200` OK, `201` Created, `204` No
Content, `400` validation error, `401` unauthenticated, `403`
unauthorized (authenticated but wrong role), `404` not found, `409`
conflict (e.g. duplicate payment).

---

## auth/

| Method | URL | Auth | Body → Response |
|---|---|---|---|
| POST | `/api/v1/auth/register/` | none | `{name, email, password}` → `201 {user, tokens}` |
| POST | `/api/v1/auth/login/` | none | `{email, password}` → `200 {user, tokens}` or `401` |
| POST | `/api/v1/auth/refresh/` | refresh token | `{refresh}` → `200 {access}` |
| GET | `/api/v1/auth/me/` | member | → `200 CurrentUser` |
| PATCH | `/api/v1/auth/me/` | member | partial `CurrentUser` fields → `200 CurrentUser` |

```ts
// CurrentUser — matches frontend/lib/mock-data.ts
{
  id: string;
  name: string;
  email: string;
  memberSince: string;      // ISO date
  plan: string;              // package name, derived from active Membership
  planStatus: "active" | "expiring" | "expired";
  renewsOn: string;          // ISO date
  role: "member" | "staff" | "admin";  // drives frontend route guards
}
```

Validation: `email` unique + valid format, `password` min 8 chars.
`register` returns `400 {email: ["A user with this email already exists."]}`
on duplicate.

---

## members/ (admin)

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/members/` | staff/admin | paginated, search by `?search=` (name/email) |
| GET | `/api/v1/members/{id}/` | staff/admin | single member detail |
| PATCH | `/api/v1/members/{id}/` | staff/admin | update plan/status |
| DELETE | `/api/v1/members/{id}/` | staff/admin | deactivate (`is_active=false`), not a hard delete |

No `POST` — member accounts are created via `/auth/register/`, which is
the only path that sets a real password (`create_user()`). A bare
`CurrentUserSerializer`-backed create here has no password field, so it
would silently produce an unusable account; `POST /members/` correctly
returns `405`.

```ts
// Member — reuses the CurrentUser shape (a Member IS a User with role="member")
{ id: number; name: string; email: string; memberSince: string;
  plan: string | null; planStatus: "active" | "expiring" | "expired";
  renewsOn: string | null; role: "member" | "staff" | "admin"; }
```

---

## packages/

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/packages/` | none | public pricing page reads this |
| GET | `/api/v1/packages/{id}/` | none | |
| POST | `/api/v1/packages/` | admin | create tier |
| PUT | `/api/v1/packages/{id}/` | admin | full update |
| DELETE | `/api/v1/packages/{id}/` | admin | soft-delete if any active memberships reference it (`409` otherwise force with `?force=true`) |

```ts
// Package — matches Package interface in mock-data.ts
{ id: string; name: string; price: number; billing: "month" | "year";
  featured?: boolean; perks: string[]; }
```

---

## memberships/

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/memberships/me/` | member | current membership (drives `MembershipCard`) |
| POST | `/api/v1/memberships/switch/` | member | `{packageId}` → prorates via payment abstraction, `200` new membership |
| POST | `/api/v1/memberships/renew/` | member | manual renew, uses stored payment method |
| POST | `/api/v1/memberships/cancel/` | member | sets `status: "expiring"`, effective end of billing period |

Automated renewal + expiry emails (Celery beat task, Developer 1) are not
a direct HTTP endpoint — documented here since the frontend Dashboard
displays their result (`renewsOn`, `planStatus`).

---

## products/

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/products/` | none | paginated, filter `?category=`, `?in_stock=true`, search `?search=` |
| GET | `/api/v1/products/{slug}/` | none | by slug, matches `app/shop/[slug]` |
| POST | `/api/v1/products/` | admin | |
| PUT | `/api/v1/products/{id}/` | admin | |
| DELETE | `/api/v1/products/{id}/` | admin | |

```ts
// Product — matches Product interface in mock-data.ts
{ id: string; slug: string; name: string; price: number; category: string;
  image: string; description: string; inStock: boolean; }
```

`inStock` is derived server-side from the linked `InventoryItem.stock > 0`
— never set directly.

---

## orders/

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/orders/me/` | member | paginated, own orders only |
| GET | `/api/v1/orders/` | staff/admin | all orders, filter `?status=` |
| POST | `/api/v1/orders/` | member | `{items: [{productId, quantity}]}` → `201 Order`, decrements stock atomically, `409` if any item goes negative |
| GET | `/api/v1/orders/{id}/` | owner or staff | |
| PATCH | `/api/v1/orders/{id}/` | staff/admin | update `status` |

```ts
// Order — matches Order interface in mock-data.ts
{ id: string; date: string; items: string; total: number;
  status: "delivered" | "processing" | "cancelled"; }
```

Order creation calls the payment abstraction (Mock → Real provider, per
the plan's Phase 6 payment interface) before committing stock decrement;
duplicate submissions with the same idempotency key return the original
`201` rather than creating a second order.

---

## inventory/ (admin)

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/inventory/` | staff/admin | paginated, `?low_stock=true` filters to `stock <= reorderAt` |
| PATCH | `/api/v1/inventory/{productId}/` | staff/admin | `{stock}` or `{reorderAt}` |

```ts
// InventoryItem — matches InventoryItem interface in mock-data.ts
{ productId: string; name: string; sku: string; stock: number; reorderAt: number; }
```

Stock mutations from order creation and admin edits both go through one
service function with a DB constraint (`stock >= 0`) so negative stock is
impossible at the database level, not just in application code.

---

## staff/ (admin)

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/staff/` | admin | paginated |
| POST | `/api/v1/staff/` | admin | invites via email, `status: "inactive"` until accepted |
| PATCH | `/api/v1/staff/{id}/` | admin | update role/status |
| DELETE | `/api/v1/staff/{id}/` | admin | |

```ts
// StaffMember — matches StaffMember interface in mock-data.ts
{ id: string; name: string; email: string;
  role: "Coach" | "Front Desk" | "Manager"; status: "active" | "inactive"; }
```

---

## dashboard/ (admin analytics)

| Method | URL | Auth | Notes |
|---|---|---|---|
| GET | `/api/v1/dashboard/summary/` | staff/admin | `{activeMembers, ordersThisMonth, lowStockCount, monthRevenue}` — backs `admin/page.tsx` stat cards |
| GET | `/api/v1/dashboard/revenue/?months=6` | staff/admin | `[{month, revenue}]` — backs `RevenueChart` |
| GET | `/api/v1/dashboard/membership-mix/` | staff/admin | `[{plan, count}]` — backs the Analytics page breakdown |

Revenue figures are computed from `orders` + `memberships` billing
events, not stored redundantly — recomputed per request (or cached with
a short TTL if this becomes a hot path under load).

---

## payments/

| Method | URL | Auth | Notes |
|---|---|---|---|
| POST | `/api/v1/payments/intent/` | member | `{amount, currency}` → `{clientSecret}` or mock equivalent |
| POST | `/api/v1/payments/webhook/` | provider signature, not user auth | handles async confirmation from the real provider |

Sits behind the `PaymentProvider` interface (Mock → Real) described in
the plan's Phase 6, so `orders/` and `memberships/switch` never call a
concrete provider directly — only the interface.

---

## Auth & permission summary

| Role | Can access |
|---|---|
| Anonymous | `packages/`, `products/`, `auth/register`, `auth/login` |
| Member | + `auth/me`, `memberships/me`, `orders/me`, `payments/intent` |
| Staff | + `members/`, `products` write, `orders/` (all), `inventory/`, `dashboard/` |
| Admin | + `packages/` write, `staff/`, `members/` write/delete |

This maps directly to the two guards already stubbed as `TODO`s in the
frontend: `app/dashboard/layout.tsx` (member-or-above) and
`app/admin/layout.tsx` (staff-or-above).
