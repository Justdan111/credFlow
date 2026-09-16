# Architecture

| [Overview](README.md) | Architecture |
|:---:|:---:|

How the CredFlow web app is built, how it talks to the API, and why it is
arranged this way. [README.md](README.md) covers getting it running.

---

## What the app does

A small business signs in, records the customers it extends credit to, records
what each of them owes, and records payments as they come in. Around that sit a
dashboard of what is outstanding and overdue, analytics on collection
performance, a shared team, and an activity trail of who changed what.

Every screen is backed by the [CredFlow API](https://github.com/Justdan111/credFlow-Api).
There is no local database, no server-side data fetching, and no mock data —
the app is a client, and it fails visibly when the API does.

---

## Shape of the code

```
src/
  api/            one module per backend feature
    client.ts       Axios instance, bearer injection, refresh-and-retry
    token-store.ts  in-memory access token + change subscribers
    errors.ts       ApiError — the only error type components see
    types.ts        the { data, meta, error } envelope, pagination
    query-keys.ts   every cache key, in one registry
    invalidate.ts   what a money-moving write makes stale
    <feature>/
      <feature>.api.ts      HTTP calls, request/response types, vocabulary
      <feature>.queries.ts  TanStack Query hooks and cache updates
      <feature>.schema.ts   Zod schemas for the forms
  app/            routes: (auth) and (dashboard) groups
  components/
    ui/           primitives — button, input, select, dialog, pagination
    dialogs/      create and edit flows
    domain/       panels that know about the product: team, notes, activity
    charts/       Recharts wrappers taking API shapes directly
    layout/       sidebar, header, global search
    providers/    session
    feedback/     loading, error and empty states
  hooks/          debounce, mounted
  lib/            formatting and form helpers
```

The three-file pattern per feature is the whole convention. Adding one means
adding an `.api.ts`, a `.queries.ts`, keys in the registry, and — if it has a
form — a `.schema.ts`. Nothing else moves.

---

## How a request actually flows

```
component
   └─ useCustomers()                  queries.ts — cache, loading, retry policy
        └─ listCustomers()            api.ts — URL, params, response type
             └─ apiClient.get()       client.ts — bearer, refresh, unwrap
                  └─ HTTP
```

**`client.ts` is the only file that knows about HTTP.** It:

- injects `Authorization: Bearer …` from the in-memory token store;
- sends `withCredentials`, so the httpOnly refresh cookie travels with
  `/auth/*` requests;
- unwraps `{ data, meta, error }` so no caller destructures an envelope;
- normalises every failure into `ApiError`, so **no component ever imports
  Axios**;
- handles a 401 by refreshing once and retrying once.

The refresh is **single-flight**: ten concurrent requests that all 401 share one
round-trip rather than firing ten refreshes and racing each other into a token
rotation. Each request carries a `_retried` marker so a second 401 cannot loop.
Login, register, refresh and logout are excluded entirely — a 401 there is the
answer, not an expired token.

### Errors

`ApiError` carries `status`, `message` and predicates (`isForbidden`,
`isConflict`, `isNotFound`, `isRateLimited`). The message is the API's own where
it has one, and a human sentence where it does not. That is why a page can write:

```tsx
<InlineError error={mutation.error} fallback="We could not save that." />
```

and get a useful sentence whether the failure was a validation error, a role
check, a rate limit, or the server being unreachable.

Queries **never retry a 4xx** — the server already decided, and repeating the
request only delays the error the user needs to see.

---

## Sessions

The access token lives **in memory only**. Not `localStorage`, not a readable
cookie: anything JavaScript can read, injected JavaScript can exfiltrate.

Losing it on reload costs nothing, because the refresh token is in an httpOnly
`SameSite=Strict` cookie. On boot, `SessionProvider` calls `POST /auth/refresh`
once — which either restores the session or proves there is none — then loads
`GET /auth/me`, whose response carries the user *and* their business, so
identity, role, currency and onboarding state arrive in one request.

```
boot → restoreSession()          cookie → access token, or nothing
     → GET /auth/me              user + business
     → status: authenticated | unauthenticated
```

`RequireAuth` gates the dashboard and redirects unfinished onboarding.
`GuestOnly` keeps a signed-in user off the sign-in screen — but renders the form
immediately while the session is still restoring, because almost everyone
opening that page is signed out and making them wait on a round-trip to start
typing would be the wrong trade.

**Guards are navigation conveniences, not the security boundary.** The API
checks the token and the caller's role on every request. Hiding a button the
user cannot use is a courtesy; the server is what says no.

---

## Server state

TanStack Query owns everything that comes from the API. There is no Redux, no
context for data — only a session context for identity.

**Keys live in one registry** (`query-keys.ts`) rather than being spelled out at
call sites, because invalidation here is cross-cutting: recording a payment
changes its debt, the customer's exposure, the dashboard tiles, the analytics
series and the audit trail. Hand-picking keys per mutation means one gets missed
and the user reads a stale total.

So money-moving writes call one helper:

```ts
invalidateFinancials(queryClient)  // customers, debts, payments + derived
```

Writes that genuinely touch less do less — a note invalidates only that
customer's timeline, since it moves no balance.

Lists use `placeholderData: (previous) => previous`, so paging keeps the current
rows on screen instead of collapsing to a spinner.

---

## Forms and validation

Each feature's `.schema.ts` holds Zod schemas that **mirror the API's own
rules** — the same password length, the same risk levels, the same "a debt
cannot come due before it was issued". A form that passes locally is not then
rejected by the server.

Client validation is a UX affordance, never a control. The API re-checks
everything.

Submission is uniform: validate, show per-field errors, call `mutateAsync` in a
`try/catch`, and let the mutation's error state render underneath. The `catch`
matters — without it a rejected mutation becomes an unhandled promise rejection.

`FormField` owns the label, the error and the `aria-invalid`/`aria-describedby`
wiring, so accessibility is consistent rather than remembered.

---

## Permissions in the UI

The API's rules are mirrored, not re-implemented:

- the invite dialog offers only roles the caller may actually grant;
- the role selector and remove button are hidden for the last owner and for
  yourself;
- delete is hidden from members, voiding a payment from anyone but an owner;
- the activity tab tells a member it is not for them rather than firing a
  request that returns 403.

The point is to avoid presenting a choice that comes back as a permission error.
It is not a security measure, and the mirrored rules are documented as mirrors
so nobody mistakes them for the real check.

---

## Rendering conventions

Routes are grouped: `(auth)` for signed-out screens, `(dashboard)` for
everything behind the session gate, which supplies the sidebar and header.

Every data-backed surface renders four states — loading, error (with retry),
empty, and content — using the shared components in `components/feedback`. An
empty list says so; it never shows stale rows or an blank panel.

Numbers are formatted through `lib/format.ts` against the **business's own
currency**, which the API echoes with every financial payload. No currency
symbol is hard-coded.

Charts take API shapes directly and share one palette, so "high risk" is the
same red everywhere. A metric with no prior period renders no comparison badge
rather than inventing a percentage.

---

## What is deliberately absent

- **No mock data.** A screen with no backing endpoint was not built.
- **No fabricated metrics.** The analytics page once showed retention and
  days-to-collect; the API cannot compute either, so they were removed rather
  than faked.
- **No social sign-in buttons**, since there is no OAuth flow behind them.
- **The header search** covers customers, debts and payments because that is
  what `GET /search` returns — not "everything".

---

## Known gaps

- **There is no test suite.** No unit tests, no component tests, no end-to-end
  tests, and no CI workflow. The backend has all three. This is the largest
  outstanding gap in the project.
- No browser-driven click-through has been run against a seeded database;
  verification so far is type-level plus request-by-request contract checks
  against a live API.
- Customer detail sums its exposure from the customer's own debts and payments
  requested at the maximum page size, because the API exposes no per-customer
  totals endpoint. The server's `total` is shown alongside so a customer beyond
  that many records is visibly partial rather than quietly wrong.
- `phone` is write-only: `GET /auth/me` does not return it, so the settings form
  omits the field when blank rather than clearing a number the user never saw.

---

| [Overview](README.md) | Architecture |
|:---:|:---:|
