# CredFlow API Integration Checklist

**Last verified:** 2026-09-16, end to end against the Go API running on a
throwaway Postgres instance (register → onboarding → customer → debt → payment
→ dashboard → analytics → export → refresh rotation → logout), plus a contract
replay asserting every field these modules declare is present in the live
response.

**Backend:** `credflow api` · **Frontend:** `credFlow`

## Status Legend

- [x] Integrated and consumed by a frontend screen.
- [~] Partially integrated.
- [B] Backend route is not implemented in the Go server.
- [!] Contract note worth knowing before changing this area.

## Current Summary

| Area | Frontend status |
| --- | --- |
| Axios/TanStack Query foundation | [x] Client, in-memory token, refresh-and-retry, normalised errors, central query keys |
| Authentication | [x] Login, register, logout, session restore, forgot/reset, change password, sessions |
| Business/onboarding | [x] Status, resume, single-call completion, profile editing with currency lock |
| Customers | [x] List, search, filter, pagination, detail, create, update, delete |
| Debts | [x] List, filters, pagination, detail, create, update, delete, mark paid |
| Payments | [x] List, filters, pagination, detail, create, debt-linked create, void |
| Dashboard | [x] Summary tiles, trend, risk mix, recent debts and payments |
| Analytics | [x] Collection rate, risk trend, segments, CSV export |
| Team | [x] List, invite, change role, remove — Settings → Team |
| Audit trail | [x] Filterable activity feed — Settings → Activity |
| Customer notes | [x] Timeline with add and retract on customer detail |
| Global search | [x] Header dropdown across customers, debts and payments |
| Notifications, reminders, files, reports, receipts, 2FA | [B] No backend routes; deliberately not built |

## Frontend Foundation

- [x] `src/api/client.ts` owns one Axios instance, bearer injection and unwrapping.
- [x] Base URL from `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:8080/api`.
- [x] `withCredentials: true` carries the httpOnly refresh cookie.
- [x] A 401 triggers one single-flight refresh, then one retry, tracked per request
      so a second failure cannot loop.
- [x] `/auth/login`, `/auth/register`, `/auth/refresh` and `/auth/logout` are excluded
      from the retry: a 401 there is the answer, not an expired token.
- [x] Access token is held **in memory only**. The refresh cookie is the durable
      credential, so `SessionProvider` restores the session on boot with one
      `POST /auth/refresh`. Nothing readable by JavaScript persists across reloads.
- [x] Every transport failure is normalised to `ApiError` (`status`, `message`,
      `isForbidden`, `isConflict`, …) so no component imports Axios.
- [x] Queries do not retry 4xx — the server already decided.
- [x] Query keys live in one registry (`src/api/query-keys.ts`); money-moving writes
      invalidate customers, debts, payments, dashboard and analytics together.
- [x] Zod schemas mirror the API's own validation rules, per feature.

## 1. Authentication and Account

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `POST /auth/register` | Register page → `/onboarding` |
| [x] | `POST /auth/login` | Login page, honours a same-site `?next=` |
| [x] | `GET /auth/me` | Session provider: user, role, business, currency, onboarding state |
| [x] | `PATCH /auth/me` | Settings → Profile |
| [x] | `POST /auth/refresh` | Boot restore and the 401 retry path |
| [x] | `POST /auth/logout` | Header and sidebar; clears the whole query cache |
| [x] | `POST /auth/forgot-password` | Forgot-password page |
| [x] | `POST /auth/reset-password` | Reset-password page, reads `?token=` |
| [x] | `POST /auth/change-password` | Settings → Security |
| [x] | `GET /auth/sessions` | Settings → Security |
| [x] | `DELETE /auth/sessions/:id` | Settings → Security |

- [!] `GET /auth/me` answers `{ user, business }`, while `PATCH /auth/me` answers a
      flat profile that includes `phone`. The GET shape is deliberate — it is what
      the backend's own integration test asserts and what its README documents — so
      the frontend follows it, and **`phone` is not readable**. The settings form
      therefore omits the `phone` key while the field is blank, so saving a profile
      cannot silently wipe a number the user was never shown.
- [!] The register form sends empty `industry`/`size`. They are collected during
      onboarding, alongside the currency they affect, which leaves the business step
      legitimately incomplete until then.

## 2. Business and Onboarding

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `GET /businesses/current` | Settings → Business |
| [x] | `PATCH /businesses/current` | Settings → Business, owner/admin only |
| [x] | `GET /onboarding/status` | Onboarding resumes at `currentStep` |
| [x] | `POST /onboarding/complete` | One submit for profile + first customer + first debt |

- [x] A 409 from a repeated `complete` is treated as success — the business is
      onboarded either way.
- [x] The currency selector disables itself when `currencyLocked` is true rather than
      offering a change the API will reject.
- [x] An explicit `null` clears `monthlyCollectionTarget`; an omitted key leaves it.

## 3. Customers

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `GET /customers` | List: debounced search, risk filter, server pagination |
| [x] | `POST /customers` | Add-customer dialog |
| [x] | `GET /customers/:id` | Detail page |
| [x] | `PATCH /customers/:id` | Edit dialog |
| [x] | `DELETE /customers/:id` | Owner/admin only; the action is hidden otherwise |
| [x] | `GET /customers/:id/debts` | Detail page |
| [x] | `GET /customers/:id/payments` | Detail page |

- [!] Risk levels are `low`/`medium`/`high`. The old UI sent `Low`, which the API
      rejects with a 400; casing now comes from one shared constant.
- [!] There is no per-customer totals endpoint, so outstanding and paid-to-date are
      summed from the customer's own debts and payments, requested at the maximum
      page size, with the server's `meta.total` shown beside them.

## 4. Debts

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `GET /debts` | List: status and customer filters, overdue toggle, pagination |
| [x] | `POST /debts` | Record-debt dialog, real customer UUIDs from a live picker |
| [x] | `GET /debts/:id` | Detail page with collection progress |
| [x] | `PATCH /debts/:id` | Edit dialog, owner/admin only |
| [x] | `DELETE /debts/:id` | Owner/admin only |
| [x] | `POST /debts/:id/mark-paid` | List row action and detail page |
| [x] | `POST /debts/:id/payments` | Detail page; the API derives the customer |

- [!] `overdue` is a separate flag, not a status: an overdue debt is still `pending`.
      The status pill and the filter both account for that.

## 5. Payments

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `GET /payments` | List: method and customer filters, pagination |
| [x] | `POST /payments` | Record-payment dialog with an idempotency key |
| [x] | `GET /payments/:id` | Detail page |
| [x] | `PATCH /payments/:id` | Owner/admin; "Correct" on payment detail |
| [x] | `DELETE /payments/:id` | Owner only; shown as "void payment" |
| [x] | `GET /customers/:id/payments` | Customer detail |
| [x] | `GET /debts/{debtId}/payments` | Debt detail |

- [x] One idempotency key per opened dialog. Verified: a repeated submit returns 200
      with the original payment instead of recording the money twice.
- [x] `GET /debts/:debtId/payments` now exists and is used directly; the
      `?debtId=` workaround is gone.
- [x] A correction cannot move a payment to another customer or debt — the API
      does not accept it, and the dialog says why.

## 6. Dashboard

| Status | Route |
| --- | --- |
| [x] | `GET /dashboard/summary` |
| [x] | `GET /dashboard/recent-debts` |
| [x] | `GET /dashboard/recent-payments` |
| [x] | `GET /dashboard/risk-distribution` |
| [x] | `GET /dashboard/collections-trend` |

- [x] Each group has its own loading, error and empty state.
- [x] A null `change` renders no comparison badge rather than a fabricated percentage.

## 7. Analytics

| Status | Route |
| --- | --- |
| [x] | `GET /analytics/collection-rate` |
| [x] | `GET /analytics/risk-trend` |
| [x] | `GET /analytics/customer-segments` |
| [x] | `GET /analytics/export` |

- [x] Export is read as a blob and downloaded; it never goes through `unwrap`.
- [x] The target series is only drawn when a target exists.
- [x] KPIs are derived solely from returned data. The old page's invented metrics
      (days-to-collect, retention, bad-debt ratio) were removed rather than faked.

## 8. Team, Notes, Audit and Search

| Status | Route | Frontend surface |
| --- | --- | --- |
| [x] | `GET /users` | Settings → Team, with pending invitations flagged |
| [x] | `POST /users` | Invite dialog; only offers roles the caller may grant |
| [x] | `PATCH /users/:userId` | Inline role selector |
| [x] | `DELETE /users/:userId` | Owner only, with a confirmation dialog |
| [x] | `GET /customers/:customerId/notes` | Customer detail timeline |
| [x] | `POST /customers/:customerId/notes` | Inline composer with a channel selector |
| [x] | `DELETE /notes/:noteId` | Owner/admin only |
| [x] | `GET /audit-logs` | Settings → Activity, filterable by action |
| [x] | `GET /search` | Header dropdown, keyboard navigable |

- [!] The UI mirrors the API's privilege rules rather than discovering them by
      failing: the invite dialog lists only grantable roles, and the role
      selector and remove button are hidden for the last owner and for yourself.
      The API remains the enforcement point; this just avoids offering a choice
      that comes back as a 403.
- [!] An invitation link is never returned by the API and never rendered. It is a
      credential for taking over that account and goes only to the invitee.
- [x] Search short-circuits below two characters instead of sending a request the
      API answers with 400.

## 9. Backend Routes Not Built

Not integrated, and deliberately not mocked: 2FA, onboarding seed, customer notes
and activity, debt reschedule/waive/schedule/activity, payment update, receipts,
notifications, reminders, communications, uploads, reports, audit logs, global
search, and the aggregate settings endpoints. The header search box routes to the
customer list with the term applied instead of pretending to search everything.

## Verification

- [x] `pnpm exec tsc --noEmit` passes.
- [x] `pnpm lint` passes (one pre-existing warning in `use-scroll-animation`).
- [x] `pnpm build` succeeds.
- [x] CORS preflight from `http://localhost:3000` returns the credentialed headers.
- [x] Register sets the refresh cookie; `POST /auth/refresh` rotates it using the
      cookie alone, with no bearer token.
- [x] 400, 401, 404 and 409 bodies all surface a useful message through `ApiError`.
- [x] Every query string the UI sends was replayed against the live API: all 200.
- [x] Every field these modules type was replayed against the live API and
      confirmed present, including the `{ member }` wrapper on invite and the
      omitted-vs-null shape of cleared optional fields.
- [ ] Browser-driven click-through of each screen against a seeded database.
