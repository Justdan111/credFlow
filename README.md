# CredFlow

| Overview | [Architecture](ARCHITECTURE.md) |
|:---:|:---:|

Web app for CredFlow, a debt and collections tracker for African SMEs. A
business keeps track of its customers, what each one owes, and the payments
that come in — with a dashboard for what is outstanding and overdue, analytics
on collection performance, and a team that can share the work.

Next.js App Router talking to the [CredFlow API](https://github.com/Justdan111/credFlow-Api) over REST.

## Stack

| | |
|---|---|
| Framework | Next.js 16, React 19 |
| Data | TanStack Query, Axios |
| Forms | Zod schemas mirroring the API's validation |
| Styling | Tailwind v4, Radix primitives, Framer Motion |
| Charts | Recharts |

## Getting started

```bash
cp .env.example .env.local   # set NEXT_PUBLIC_API_URL if the API is not on :8080
pnpm install
pnpm dev
```

Open [localhost:3000](http://localhost:3000). The API must be running too.

For sign-in to work, the API needs to recognise this origin: set
`ALLOWED_ORIGINS=http://localhost:3000`, `APP_BASE_URL=http://localhost:3000`
so password-reset links come back here, and `COOKIE_SECURE=false` for local
http.

## Layout

```
src/
  api/          one module per backend feature
    client.ts     Axios instance, bearer injection, refresh-and-retry
    errors.ts     ApiError — the only error type components see
    query-keys.ts every cache key, in one registry
    <feature>/    .api.ts (HTTP) · .queries.ts (hooks) · .schema.ts (forms)
  app/          routes — (auth) and (dashboard) groups
  components/   ui primitives, dialogs, charts, domain panels, layout
  hooks/        small shared hooks
  lib/          formatting and form helpers
```

Pages stay presentational: they call query hooks, render loading, error and
empty states, and submit through mutations that invalidate whatever the write
affected.

## Sessions

The access token is held **in memory only**, never in `localStorage`, so a
cross-site scripting bug cannot read it back out. The refresh token lives in an
httpOnly cookie, so on a cold load one call to `/auth/refresh` either restores
the session or proves there is none.

Route guards and hidden buttons are conveniences. The API checks the token and
the caller's role on every request, and remains the thing that actually says no.

## Checks

```bash
pnpm exec tsc --noEmit   # types
pnpm lint                # eslint
pnpm build               # production build
```

[**ARCHITECTURE.md**](ARCHITECTURE.md) explains how the app is put together,
how it talks to the API, and the decisions behind both.

---

| Overview | [Architecture](ARCHITECTURE.md) |
|:---:|:---:|
