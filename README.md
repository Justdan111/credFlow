# CredFlow — web app

Debt and collections tracking for African SMEs. This is the Next.js frontend;
it talks to the CredFlow Go API over REST.

## Getting started

1. Copy the environment template and point it at your API:

   ```bash
   cp .env.example .env.local
   ```

   | Variable | Purpose |
   | --- | --- |
   | `NEXT_PUBLIC_API_URL` | API base URL including the `/api` prefix. Defaults to `http://localhost:8080/api`. |

2. Start the API, then the frontend:

   ```bash
   pnpm install
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

### Backend configuration this app depends on

Authentication uses a bearer access token plus an httpOnly refresh cookie, so
the API has to recognise this origin:

- `ALLOWED_ORIGINS` must include `http://localhost:3000`. CORS refuses a
  wildcard alongside credentialed requests, and `/auth/refresh` and
  `/auth/logout` additionally reject a foreign `Origin` header.
- `APP_BASE_URL` should be `http://localhost:3000` so emailed password-reset
  links point back here (`/reset-password?token=…`).
- `COOKIE_SECURE=false` for plain-http local development.

## How the API layer is organised

```
src/api/
  client.ts            Axios instance, bearer injection, refresh-and-retry
  token-store.ts       In-memory access token + change subscribers
  errors.ts            ApiError — the single error type the UI handles
  types.ts             { data, meta, error } envelope and pagination
  query-keys.ts        Every TanStack Query key, in one registry
  invalidate.ts        Cross-feature invalidation after money-moving writes
  <feature>/
    <feature>.api.ts     HTTP calls, request/response types, domain vocabulary
    <feature>.queries.ts TanStack Query hooks and cache updates
    <feature>.schema.ts  Zod form schemas mirroring the API's own validation
```

Pages stay presentational: they call query hooks, render loading, error and
empty states, and submit through mutations that invalidate whatever the write
affected.

### Session handling

The access token is held **in memory only** — never in `localStorage` — so a
cross-site scripting bug cannot read a credential back out. The refresh token
lives in an httpOnly, `SameSite=Strict` cookie scoped to `/api/auth`, so on a
cold load `SessionProvider` calls `POST /auth/refresh` once to rebuild the
session. A 401 on any other request triggers a single-flight refresh and one
retry; if that fails, the session is cleared and the user is sent to sign in.

Route guards (`RequireAuth`, `GuestOnly`) are navigation conveniences. The API
enforces authentication and role checks on every request, and the UI hides
owner/admin-only actions to match rather than to replace that.

## Checks

```bash
pnpm exec tsc --noEmit   # types
pnpm lint                # eslint
pnpm build               # production build
```
