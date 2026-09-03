# FitPro — Frontend Scaffold (Phase 1 + Phase 2)

Design tokens and component system extracted from the supplied reference
screenshot, per the implementation plan's strict build order.

## Running with `docker compose up --build`

Works with zero setup — no need to manually create `backend/.env` first.
`docker-compose.yml`'s `env_file` for the backend/worker services is
marked `required: false`, and `config/settings.py` has safe local-dev
defaults for every variable that file would set. Copy
`backend/.env.example` to `backend/.env` only if you want to override
something (a real `DJANGO_SECRET_KEY`, etc.) — it's gitignored, so your
copy stays local.

**A real networking bug, found and proven fixed before you'd hit it in
practice**: pages that fetch data server-side (Membership, Shop) run
that fetch *inside the frontend container itself*, where `localhost`
means the frontend container — not the backend one. Client-side fetches
(login, dashboard, admin) run in the actual browser, where `localhost`
correctly reaches the backend via Docker's port mapping. One URL can't
serve both. Fixed with two env vars in `docker-compose.yml`:
`NEXT_PUBLIC_API_URL` (browser-facing, `localhost:8000`) and
`API_URL_INTERNAL` (container-facing, `http://backend:8000` — the
Docker service name), with `lib/api-client.ts` picking the right one
based on `typeof window`.

Verified this isn't just plausible-sounding: built and ran the frontend
with `NEXT_PUBLIC_API_URL` pointed at a deliberately dead port (`:9999`,
simulating what "localhost" wrongly resolves to inside a container) and
`API_URL_INTERNAL` pointed at the real backend. The server-rendered
`/membership` page still returned `HTTP 200` with live seeded data —
proving the server-side code path genuinely ignores the browser-facing
URL and uses the internal one, not just that the code compiles.

## Getting this into git

A root `.gitignore` is included, covering both apps: `node_modules/`,
`.next/`, `__pycache__/`, `db.sqlite3`, and any `.env` file (only
`backend/.env.example` is meant to be tracked — copy it to `backend/.env`
locally and fill in real values, never commit the copy). To start a repo:

```
git init
git add -A
git commit -m "Initial commit"
```

Verified before delivery: staged 186 files, zero matches for
`node_modules|\.next/|__pycache__|db\.sqlite3|backend/\.env$|\.pyc$`
against the staged list — nothing bloated or secret gets picked up.

## What's here

```
frontend/
├── tailwind.config.ts      # design tokens: colors, type scale, radius, shadows
├── app/globals.css         # font vars, base resets, focus ring, reduced-motion
├── components/
│   ├── ui/
│   │   ├── Button.tsx       # primary (lime pill) / secondary / ghost
│   │   ├── Card.tsx         # Card, CardHeader, CardTitle, CardFooter
│   │   ├── Badge.tsx        # status labels (stock, membership, orders)
│   │   ├── Input.tsx        # labeled text input w/ error state
│   │   └── Modal.tsx        # dialog w/ escape-to-close, focus-safe
│   ├── layout/
│   │   ├── Navbar.tsx       # matches reference: logo, nav, search/cart, CTA
│   │   ├── Footer.tsx
│   │   └── Container.tsx    # max-width/padding wrapper
│   └── shop/
│       ├── ProductCard.tsx
│       ├── ProductGrid.tsx
│       └── CartItem.tsx
├── lib/
│   └── mock-data.ts         # packages, products, orders, currentUser,
│                            # members, staff, inventory, monthlyRevenue
├── app/
│   ├── layout.tsx           # root layout: Google Fonts, Navbar, Footer
│   ├── page.tsx             # Home
│   ├── about/page.tsx
│   ├── package/page.tsx     # pricing tiers
│   ├── shop/page.tsx        # product grid
│   ├── shop/[slug]/page.tsx # product details, generateStaticParams from mock data
│   ├── contact/page.tsx     # form UI, TODO marks Phase 7 wiring
│   ├── login/page.tsx
│   ├── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx       # sidebar shell — auth guard goes here (Phase 6/7)
│   │   ├── page.tsx         # overview: stats, plan snapshot, recent orders
│   │   ├── membership/page.tsx
│   │   ├── orders/page.tsx
│   │   └── profile/page.tsx
│   └── admin/
│       ├── layout.tsx       # sidebar shell — role guard goes here (Phase 6/7)
│       ├── page.tsx         # admin overview: stats + revenue chart
│       ├── memberships/page.tsx
│       ├── packages/page.tsx
│       ├── products/page.tsx
│       ├── inventory/page.tsx
│       ├── staff/page.tsx
│       └── analytics/page.tsx
├── package.json
└── tsconfig.json
```

Verified: `npx tsc --noEmit` clean, and `npm run build` succeeds across
all 20 routes (public, dashboard, and admin groups, plus the 4 dynamic
`/shop/[slug]` pages). Same caveat as before — this sandbox blocks
`fonts.googleapis.com`, so the build was re-verified with a local font
stub; `app/layout.tsx` ships with the real `next/font/google` loaders.
Product/hero images are solid-color placeholders — swap in real assets
before shipping. `RevenueChart` is a plain CSS bar chart (no charting
library added), per the plan's own rule against unnecessary packages.

## Design system, extracted from the reference

- **Colors**: near-black surfaces with a faint cool-green cast (`#0B0D0B`
  base, `#15170F` cards) rather than flat black, plus a single lime accent
  (`#B6E509`) — matches the "Join Now" CTA and active nav state in the
  screenshot. One accent only; no secondary brand color.
- **Type**: Bebas Neue (condensed, athletic) for the logo/headlines, Inter
  for everything else. Two families, clearly distinct roles.
- **Radius**: full pill (`999px`) for buttons/CTAs, a smaller `14px` for
  cards — the reference uses pill buttons but square-ish photo panels, so
  those two radii are kept deliberately different rather than unified.
- **Motion**: hover-only transitions on interactive elements; no
  scroll-triggered fade-ins added by default (kept for one deliberate
  moment later, per the frontend-design guidance, rather than scattered
  on every card).

## Done so far — Phase 3 (Frontend Pages) is complete

- All public-site pages: Home, About, Package/Membership, Shop, Product
  Details (dynamic route), Contact (form UI), Login, Register.
- Authenticated member area (`app/dashboard/`): Overview, Membership
  Details, Order History, Profile.
- Admin area (`app/admin/`): Overview (stats + revenue chart), Membership
  Management, Package Management, Product Management, Inventory
  Management (with reorder-point highlighting), Staff Management,
  Analytics (revenue trend + membership mix).
- New reusable components: `Sidebar`/`AdminSidebar`, `StatCard`,
  `OrderTable`, `DataTable` (generic, shared across all management
  tables), `RevenueChart`.
- Mock data now covers packages, products, orders, the current user,
  members, staff, and inventory — enough to drive every page without a
  backend.

All 20 routes build and statically generate cleanly (`npm run build`).

### Frontend ↔ backend: proven live, end-to-end (Phase 7)

`app/package/page.tsx` was converted from mock data to a real server-side
call through `membershipService.listPackages()` — and this was actually
run, not just type-checked:

1. Seeded 3 real `Package` rows into the Django/SQLite database.
2. Started `manage.py runserver` and `npm run dev` together in one shell
   session (backgrounding a process only persists within a single tool
   call in this environment — a real constraint worth knowing about, not
   a guess).
3. `curl`'d `http://localhost:3000/package` and confirmed the returned
   HTML contains `$29`, `$59`, `$99`, `Most popular`, and perk text like
   "Nutrition consultation" — none of which exist in
   `lib/mock-data.ts`, so this data could only have come from Django,
   through `NEXT_PUBLIC_API_URL`, over a real HTTP round trip.

This is the one page fully proven end-to-end. The pattern to repeat for
the rest (`export const dynamic = "force-dynamic"` + swap the mock import
for the matching `services/*.ts` call) is the same one used here.

Repeated the same recipe on **Shop** and **Product Details**
(`app/shop/page.tsx`, `app/shop/[slug]/page.tsx`) with equally real
verification: seeded 2 products (one in-stock, one out-of-stock) into
Django, ran both servers together again, and confirmed via `curl`:
- `/shop` lists both live products with the correct stock badges
- `/shop/fitpro-training-tee` renders the live description and an
  "In stock" badge
- `/shop/whey-protein-vanilla` renders "Out of stock" and a disabled
  "Notify me" button
- `/shop/does-not-exist` correctly returns a real `HTTP 404`, not a crash
  — `generateStaticParams` was removed since slugs now come from a live
  API, not a fixed mock array.

**Order History** (`app/dashboard/orders/page.tsx`) was also converted,
but as a **client component** instead — it needs a browser-held auth
token that a server component can't read. This is architecturally
correct but only verified via `tsc`/`npm run build`, not the same
curl-based proof as the public pages: doing that would need a real
browser driving `localStorage`, which isn't available as a tool here.
The build output confirms the routing split is correct either way —
`/package` and `/shop*` show `ƒ (Dynamic)`, server-rendered per request,
while `/dashboard/orders` stays `○ (Static)` since it fetches
client-side after mount, exactly as intended.

### Frontend — services layer (Phase 7)

`frontend/services/` and `frontend/types/`, per the plan's exact
structure — a centralized API layer instead of scattered `fetch` calls:

- **`lib/api-client.ts`** — single `apiFetch<T>()` wrapper: attaches the
  bearer token, normalizes errors into the `{detail}` / `{field: [...]}`
  shapes from `API_CONTRACTS.md` as a typed `ApiError`.
- **`services/`** — `auth`, `membership`, `product`, `order`,
  `inventory`, `dashboard` — one file per domain, matching the plan's
  file list exactly.
- **`types/`** — wire types (`auth.ts`, `membership.ts`, `product.ts`,
  `order.ts`, `dashboard.ts`) — deliberately separate from
  `lib/mock-data.ts`'s interfaces, since the wire format differs in a
  few places from the mock shapes (e.g. DRF serializes decimals as
  strings, and real IDs are numbers, not the mock string ids).
- **Wired for real**: `login`, `register`, and `dashboard/profile` call
  `authService` instead of no-op handlers, with real error handling via
  `ApiError` (field-level errors surface inline, e.g. duplicate email on
  register). `app/package/page.tsx` is fully live (see above).

Verified: `npx tsc --noEmit` and a full `npm run build` both pass across
all 25 routes with the service layer wired in.

**Phase 7 is now complete — every page is live.** All six remaining
Admin pages (Memberships, Packages, Products, Inventory, Staff,
Analytics) were converted to client-fetch, following the exact pattern
established by Order History and both Overview pages. This also
required adding an endpoint that was missing from the original Phase 4
draft: **`/api/v1/members/`** (staff/admin list/update/deactivate),
now in `apps/accounts/admin_views.py` and documented in
`API_CONTRACTS.md`.

Re-ran the same leak test from the auth-guard section against the two
highest-risk new pages — seeded a real member and a real staff record,
curled `/admin/memberships` and `/admin/staff` while logged out — and
got the same result as before: **zero matches, `grep` exit code 1** on
both. No regression of the RSC data-leak issue across the newly
converted pages.

**Genuinely mock-data-backed still**: nothing, on any page that reads
live application data. What remains mock/placeholder is content that's
supposed to be static or manually curated — the About page's copy, the
placeholder product/hero images, and the "add member/package/staff"
buttons across Admin, which still need actual create forms wired to
their services' existing `create`/`update` methods (the services
support it; the button click handlers don't yet).

## Next steps

1. ~~Apply the live-fetch pattern to every remaining page.~~ **Done** —
   see above. Every page reading live data now does so.
2. ~~Add auth/role guards to `dashboard/layout.tsx` and
   `admin/layout.tsx`.~~ **Done** — see below, including a real bug this
   surfaced along the way.
3. `docker compose up --build` at the project root brings up Postgres,
   Redis, the Celery worker, the Django backend, and the Next.js
   frontend together (`docker-compose.yml` at the repo root) — this is
   the way to run both servers persistently rather than backgrounding
   them by hand.
4. Developer 1 (auth, memberships, real payment gateway) implements
   `RealPaymentProvider` in `apps/payments/providers.py` — everything
   else already codes against the `PaymentProvider` interface via
   `get_payment_provider()`, so swapping it in is a one-line change plus
   `USE_REAL_PAYMENT_PROVIDER=true`.
5. Developer 2 (products, orders, inventory, staff, analytics) can keep
   building against `MockPaymentProvider` without waiting.
6. Wire the "Add member" / "Add package" / "Add product" / "Add staff
   member" buttons across Admin to real create forms — the underlying
   services (`memberService`, `membershipService`, `productService`,
   `staffService`) already support `create`/`update`, only the UI forms
   are missing.
7. Consider replacing the localStorage JWT with an httpOnly cookie set
   by the backend — this removes the "client component must fetch its
   own data" constraint documented below, since a cookie is readable by
   Server Components via `next/headers`, letting authenticated pages go
   back to being server-rendered like the public ones.

### Auth guards — and a real finding along the way

`components/auth/RequireAuth.tsx` now wraps both `dashboard/layout.tsx`
and `admin/layout.tsx`. Since auth is JWT-in-localStorage (not a
cookie), the check has to run client-side: it reads the cached user from
login/register for an instant redirect, then re-verifies against
`/auth/me/` in the background and signs out if the server disagrees.

**Testing this surfaced a real Next.js App Router gotcha, not just a
theoretical one.** The first version left `dashboard/page.tsx` and
`admin/page.tsx` as Server Components with hardcoded mock data,
reasoning that `RequireAuth` returning `null` before the auth check
completes would hide them. Running both servers together and curling
`/dashboard` while logged out proved that wrong: the visible HTML
(`<main></main>`) was correctly empty, but the response still contained
the *full* dashboard content — "Welcome back, Alex", the mock
membership, mock orders — serialized inside a `self.__next_f.push(...)`
script tag. **A Server Component's data is rendered and shipped to the
browser as part of the RSC flight payload regardless of what a
wrapping Client Component's runtime state later decides to display.**
A client-side guard hides the DOM; it does not stop the data from
crossing the wire.

The fix was converting `dashboard/page.tsx` and `admin/page.tsx` to
client components that fetch their own data (`authService.me()`,
`membershipService.myMembership()`, `orderService.myOrders()` /
`dashboardService.summary()` + `.revenue()`) instead of receiving
hardcoded mock data as part of the server-rendered tree. Re-running the
identical test after the fix — same servers, same curl, same grep —
came back with **zero matches and a `grep` exit code of 1**, confirmed
directly rather than assumed.

**The general rule this leaves for the rest of the app**: any page
under a client-side auth guard must fetch its own data client-side
(or be genuinely public data safe to ship regardless of auth state).
Hardcoding real or mock user data into a Server Component under
`dashboard/` or `admin/` will leak it into the initial response even
though the guard "hides" it, because the guard runs after the server
has already generated and serialized that component's output.

### Nav consolidation — "Package" removed, everything points to Membership

Per request: dropped the separate "Package" nav item (it duplicated
"Membership" and pointed at the same page anyway) and moved the actual
route from `/package` to `/membership`, updating every reference —
Navbar, Footer, the post-registration redirect, and the page's own
title/metadata.

While doing this, found and fixed two things that would've been broken
otherwise:

- **Hero's two CTA buttons weren't links at all** — plain `<button>`
  elements with no `href`, `onClick`, or `type="submit"`. They looked
  clickable and did nothing. Rather than the common (and technically
  invalid) shortcut of nesting a `<Link>` inside a `<button>`, extended
  the shared `Button` component itself with an optional `href` prop that
  renders a real `next/link` anchor with the same pill styling — every
  other `Button` call site across the app still type-checks unchanged.
- Renamed the button label to **"View Membership"** and pointed it, plus
  "Join Now", at `/membership` and `/register` respectively.

`apps/memberships` (the Django app), `Package`/`PackageCard` (the
component and type), and `/admin/packages` (the admin CRUD page for
managing pricing tiers) were all left alone — those name a real backend
concept distinct from the public nav, not the thing being consolidated.

Verified live: seeded a real package, ran both servers, confirmed via
`curl` that the navbar contains exactly zero "Package" labels and the
expected two "Membership" occurrences (desktop nav + mobile dropdown,
consistent with every other nav link), `/membership` serves the live
package data, the old `/package` route correctly 404s, and both Hero
CTAs render as real `href` links. Full `tsc`/`build` pass, no
regressions from the `Button` prop-type change.

### Design QA (Phase 10) — no screenshot tool, so a code-level audit instead

This sandbox has no headless browser available under the network
allowlist (Puppeteer/Playwright both need a Chromium download from a
domain that isn't reachable), so pixel-level visual comparison against
the reference screenshot wasn't possible. What follows instead is a
systematic audit against every item Phase 10 lists — navbar, hero,
typography, colors, spacing, buttons, forms, dashboard, mobile layout —
done by reading the actual rendered output (HTML/build stats) and the
component code, not by assumption. It found four real issues, not
zero — a QA pass that finds nothing on a build this size is more likely
incomplete than the code being perfect:

1. **Dead link**: the reference design's navbar shows both "Package" and
   "Membership" as separate items, but only `/package` exists as an
   actual route — `/membership` would have 404'd. Pointed both labels at
   `/package` rather than either dropping the label (losing fidelity to
   the reference) or building a duplicate page for no reason.

2. **Mobile navigation was completely broken**: `Navbar`'s nav links were
   `hidden md:flex` with no mobile fallback at all — on a phone, there
   was no way to reach About/Package/Shop/Contact except by typing the
   URL directly. Added a working hamburger menu (`useState` toggle,
   `aria-expanded`), verified the button and its ARIA wiring actually
   render via `curl` against the live build.

3. **Sidebar responsive direction was wrong**: `DashboardSidebar` and
   `AdminSidebar` had a hardcoded right border and right padding meant
   for the desktop side-by-side layout, but on mobile the layout stacks
   vertically (`flex-col` until `md:`) — a right border makes no visual
   sense stacked above content. Fixed to a horizontally-scrollable pill
   row with a bottom border on mobile, switching to the original
   vertical sidebar with a right border at `md:`.

4. **Failed WCAG AA contrast**: `ink-faint` (`#6B7263`) was used almost
   exclusively at `text-xs` — category labels, chart axis labels, footer
   copyright text, form helper text — which is "normal text" under WCAG,
   not "large text" (the large-text threshold is 18px+, or bold 14px+).
   Checked the actual contrast ratio computationally (relative luminance
   formula, not eyeballing) and got **3.91:1 and 3.63:1** against the two
   dark surfaces it appears on — both fail the 4.5:1 AA threshold.
   Retuned to `#818879`, verified computationally to clear 4.5:1 against
   all three background tones the token is actually used on (base,
   surface, and the raised/hover surface), not just the one that was
   easiest to check.

Also downsized the largest headline (`text-display-lg`, 3.25rem) to step
down to `text-display-md` below the `md:` breakpoint — a 52px condensed
headline on a 375px-wide screen with 24px side padding leaves under
330px of width, forcing 2–3 line wraps on headings like "Membership
packages" that look fine on desktop but cramped on mobile.

Full `npm run build` re-verified clean after all four fixes — 20/20
routes, no regressions.

### Admin create forms — and a bug avoided before it shipped

Wired the "Add package", "Add product", and "Add staff member" buttons
to real forms (`components/ui/Modal` + existing service `create()`
methods). Before touching "Add member", though, tracing it back
surfaced the same class of problem the Order-status bug did: `POST
/api/v1/members/` reused `CurrentUserSerializer`, which has no password
field. Wiring a form to it wouldn't have errored — it would have
silently created a `User` row with no usable password, via the raw
manager instead of `create_user()`. Fixed by narrowing `MemberViewSet`
to List/Retrieve/Update/Destroy only (no `POST`), with a test proving
`405` — member accounts are created through `/auth/register/`, which is
the only path that actually hashes a password. The "Add member" button
became an explanatory label instead of a form that looked like it
worked but didn't.

Product creation surfaced a second, smaller gap: a newly-created product
had no `InventoryItem`, so it wouldn't appear on the Inventory page at
all until someone remembered to add one by hand. Fixed with a
`post_save` signal (`apps/inventory/signals.py`) that auto-provisions an
`InventoryItem` at 0 stock whenever a `Product` is created — which then
required updating every existing test that manually created both
(`InventoryItem.objects.create()` right after `Product.objects.create()`
now collides with the signal's own row). Consolidated those into one
`set_inventory()` test helper rather than leaving five call sites to
silently rot.

Verified two ways: `tsc`/`npm run build` for the frontend wiring, and a
direct backend request test sending the **exact payloads the new forms
produce** — create package, create product (confirming it shows up in
`/api/v1/inventory/` at 0 stock), create staff (confirming it defaults
to `inactive`), and `POST /members/` correctly returning `405`. Full
test suite re-run afterward: **45/45 passing**, no regressions from the
signal change.

### Testing (Phase 9) — a permanent suite, and two real bugs it caught

The earlier smoke test was ad-hoc and thrown away after each run. It's
now a permanent Django test suite — `manage.py test apps` — covering
every item Phase 9 explicitly lists that applies to what's built so far:

- **`apps/accounts/tests.py`** — registration, duplicate-email
  rejection, weak-password rejection, login success/failure, `/me/`
  auth requirement, role-gated `/members/` access (member vs staff vs
  anonymous)
- **`apps/memberships/tests.py`** — package CRUD permissions, soft-delete
  conflict (`409`) when a package has active memberships plus
  `?force=true` override, switch/renew/cancel lifecycle, the
  `expire_overdue_memberships` Celery task
- **`apps/orders/tests.py`** — stock decrement, oversell → `409` with
  stock provably unchanged, idempotent duplicate orders, **negative
  stock proven impossible by attempting to write it directly and
  catching the database's own `IntegrityError`** (not just checking the
  service layer), atomicity across multi-item orders (one bad item
  rolls back all of them), member/staff order visibility
- **`apps/products/tests.py`**, **`apps/inventory/tests.py`** —
  in-stock derivation, category/search/low-stock filters, write
  permissions
- **`apps/analytics/tests.py`** — dashboard summary, revenue, and
  membership-mix numbers checked against known seeded data, not just
  "does it return 200"

**43 tests, all passing** (`Ran 43 tests ... OK`) — but two of them
failed on the first run and pointed at real bugs, not test mistakes:

1. A **slug collision** in a shared test helper (a papercut, fixed by
   generating unique slugs per call).
2. A **real backend bug**: `PATCH /api/v1/orders/{id}/` (staff updating
   order status) returned `200` but silently wrote nothing, because
   `OrderSerializer` intentionally marks every field read-only for GET
   responses — including `status` — so the same serializer being reused
   for the PATCH action just discarded the write. Fixed by adding a
   dedicated `UpdateOrderStatusSerializer` for that one write path,
   keeping `OrderSerializer` read-only everywhere else. This is exactly
   the kind of bug a manual smoke test walking the happy path won't
   catch — it takes an assertion on the actual persisted state.

Also fixed two `UnorderedObjectListWarning`s from DRF's pagination
(added explicit `ordering` to `User` and `InventoryItem` — pagination
without a stable order can return duplicate or missing rows across
pages, which is a real correctness issue, not just a warning to
silence).

### Backend — what's built (Phase 5)

`backend/` (Django + DRF), verified end-to-end against a local SQLite DB
in this sandbox (`manage.py check`, `makemigrations`, `migrate`, and a
full request-cycle smoke test all pass — see below):

- **`apps/accounts`** — custom email-based `User` model with a `role`
  field (member/staff/admin), JWT auth (register/login/refresh/me),
  role-based `IsStaffOrAdmin`/`IsAdmin` permission classes
- **`apps/memberships`** — `Package` + `Membership` models; switch/renew/
  cancel endpoints; soft-delete on packages with active memberships
- **`apps/products`** — `Product` model, public list/detail with
  category filter + search, admin writes
- **`apps/inventory`** — `InventoryItem` with a **DB-level
  `CheckConstraint` enforcing `stock >= 0`** — negative stock is
  impossible even with an application bug, not just guarded in Python
- **`apps/orders`** — `Order`/`OrderItem`; `services.py` handles order
  creation atomically: `select_for_update` locks the inventory row,
  decrements stock, calls the payment abstraction, and rolls back
  everything (including stock) if payment fails or stock is
  insufficient (`409`); an `idempotency_key` makes retried requests
  return the original order instead of creating a duplicate
- **`apps/payments`** — the `PaymentProvider` interface plus
  `MockPaymentProvider` (always succeeds) and a `RealPaymentProvider`
  stub, selected via `USE_REAL_PAYMENT_PROVIDER`, exactly matching the
  plan's Phase 6 no-waiting rule
- **`apps/staff`** — `StaffMember` CRUD, admin-only
- **`apps/analytics`** — dashboard summary/revenue/membership-mix
  endpoints, computed live from orders/memberships/inventory (no
  redundant stored aggregates)
- **`apps/notifications`** — Celery task stubs for renewal reminders and
  an expiry sweep, registered on `CELERY_BEAT_SCHEDULE`

**Verified with a real request-cycle smoke test** (register → duplicate
rejected → login → permission-gated package creation → membership switch
→ order creation with stock decrement → duplicate order returns the
original → overselling returns `409` with stock unchanged → member
blocked from admin order list): all scenarios passed.

**Caveats from running in this sandbox** (fine for any real machine):
- Used SQLite locally instead of Postgres (no DB server available here);
  `DATABASE_URL` already switches to Postgres via `dj-database-url` the
  moment it's set — no code changes needed.
- Redis/Celery aren't running here, so the beat schedule and worker
  aren't exercised live, only reviewed for correctness.
- `backend/.env` in this zip has a placeholder dev secret key — replace
  it before deploying anywhere real.

This scaffold intentionally stops here — building all 18 pages, the
Django backend, and Docker compose in one pass isn't practical in a single
chat response. Claude Code is a better fit for driving through the
remaining phases with a persistent repo and terminal.
