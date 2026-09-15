# CredFlow API Integration Checklist

**Audit date:** 2026-09-15  
**Backend:** `credflow api`  
**Frontend:** `credFlow/credFlow`

## Status Legend

- [x] Integrated and consumed by a frontend screen.
- [~] API module exists, but no screen consumes it yet or the flow is incomplete.
- [ ] Backend route exists but frontend integration has not started.
- [B] Backend route is not implemented in the Go server.
- [!] Contract or implementation issue to resolve before integration.

## Current Summary

| Area | Backend route status | Frontend status |
| --- | --- | --- |
| Axios/TanStack Query foundation | Implemented locally | [x] Provider, Axios client, bearer injection, refresh retry |
| Authentication | Implemented | [~] Login/register connected; recovery, profile, sessions, logout UI remain |
| Customers | Implemented | [~] List/create/delete connected; detail/update/nested data remain |
| Debts | Implemented | [~] API module exists; pages still use mock data |
| Payments | Implemented | [~] API module exists; pages still use mock data |
| Business/onboarding | Implemented | [ ] No API module or server persistence from the UI |
| Dashboard | Implemented | [ ] No dashboard API module; page still uses static data |
| Analytics | Implemented | [ ] No analytics API module; page still uses static data |
| Notifications, reminders, files, reports, audit, global search | Not implemented in backend | [B] Cannot integrate until backend routes exist |

## Frontend Foundation

- [x] `src/api/client.ts` creates one reusable Axios instance.
- [x] Base URL uses `NEXT_PUBLIC_API_URL`, defaulting to `http://localhost:8080/api`.
- [x] `withCredentials: true` sends the httpOnly refresh cookie.
- [x] Access token is injected into `Authorization: Bearer <token>`.
- [x] A 401 response attempts one refresh through `/auth/refresh`, then retries the original request.
- [x] Shared response types cover `{ data, meta, error }` and paginated lists.
- [x] `QueryProvider` is mounted in the root layout.
- [x] Query keys and mutation invalidation exist for customers, debts, and payments.
- [!] `useLogin` and `useRegister` cache only `user`, while `useCurrentUser` returns the different `/auth/me` profile shape. Normalize the auth cache before adding route guards or settings.
- [!] Access tokens are stored in `localStorage`. Confirm this is acceptable for the deployment threat model; the refresh token remains httpOnly.
- [!] The refresh interceptor can retry any 401 request except login/refresh. Logout, authorization failures, and expired sessions should be tested explicitly.

## 1. Authentication and Account

### Registered backend routes

All routes below are under `/api/auth`.

| Status | Method and route | Auth | Request | Response / notes |
| --- | --- | --- | --- | --- |
| [x] | `POST /register` | Public | `businessName`, `industry`, `size`, `email`, `password`, `name` | `201`, auth response with `user`, `business`, `accessToken`; sets refresh cookie |
| [x] | `POST /login` | Public | `email`, `password` | `200`, same auth response; sets refresh cookie |
| [ ] | `GET /me` | Bearer | None | `200`, profile `{ id, email, name, phone, role, ... }` |
| [ ] | `PATCH /me` | Bearer | Optional `name`, `phone` | `200`, updated profile |
| [~] | `POST /refresh` | Refresh cookie plus allowed origin | None | `200`, new `accessToken`; rotates refresh cookie |
| [ ] | `POST /logout` | Refresh cookie plus allowed origin | None | `204`; clears cookie |
| [ ] | `POST /forgot-password` | Public | `email` | `202`; intentionally generic response to prevent enumeration |
| [ ] | `POST /reset-password` | Public | `token`, `newPassword` | `204`; all sessions are revoked |
| [ ] | `POST /change-password` | Bearer plus allowed origin | `currentPassword`, `newPassword` | `204`; other sessions revoked |
| [ ] | `GET /sessions` | Bearer | None | `200`, active session array |
| [ ] | `DELETE /sessions/:sessionId` | Bearer plus allowed origin | Path `sessionId` | `204` |

### Frontend coverage

- [x] Login page calls `POST /auth/login` and redirects to `/dashboard` on success.
- [x] Register page calls `POST /auth/register` and redirects to `/onboarding` on success.
- [~] Refresh is implemented in the Axios interceptor but has no end-to-end browser test.
- [ ] Forgot-password page still uses a timeout and does not call the API.
- [ ] Reset-password page still uses a timeout and does not read/send the reset token.
- [ ] Settings does not load or update `/auth/me`.
- [ ] No frontend logout action is connected to `/auth/logout`.
- [ ] No session list/revoke UI is connected.

## 2. Business and Onboarding

### Registered backend routes

All routes require a bearer token.

| Status | Method and route | Auth / role | Request | Response / notes |
| --- | --- | --- | --- | --- |
| [ ] | `GET /businesses/current` | Bearer | None | Full business profile, currency, target, currency lock, onboarding state |
| [ ] | `PATCH /businesses/current` | Bearer, owner/admin | Partial `name`, `industry`, `size`, `currency`, `monthlyCollectionTarget`; explicit `null` clears target | Updated business; currency can return `409` when locked |
| [ ] | `GET /onboarding/status` | Bearer | None | `completed`, `currentStep`, and derived business/customer/debt step flags |
| [ ] | `POST /onboarding/complete` | Bearer | `industry`, `size`, `currency`, optional nested `customer`, optional nested `debt` | `201`, business plus created `customerId`/`debtId`; debt requires a customer |

### Frontend coverage

- [ ] Onboarding is entirely local state and uses `setTimeout`.
- [ ] Onboarding must submit the one `POST /onboarding/complete` payload, not separately invent a frontend-only workflow.
- [ ] Add business API functions and query hooks.
- [ ] Add business/settings mutation hooks with owner/admin error handling.
- [ ] Load onboarding status on entry and resume the correct step.
- [ ] Route users based on `business.onboardingCompleted` or `/onboarding/status`.

## 3. Customers

All registered customer routes require a bearer token. Delete requires owner/admin.

| Status | Method and route | Query/body | Response / notes |
| --- | --- | --- | --- |
| [x] | `GET /customers` | `page`, `pageSize`, `search`, `riskLevel`, `sort` | Paginated `Customer[]` |
| [x] | `POST /customers` | `name`, `email`, `phone`, `companyName`, `address`, `riskLevel`, `creditLimit`, `notes` | `201`, customer |
| [~] | `GET /customers/:customerId` | UUID path | `200`, customer |
| [~] | `PATCH /customers/:customerId` | Partial customer fields | `200`, updated customer |
| [x] | `DELETE /customers/:customerId` | UUID path | `204` |
| [ ] | `GET /customers/:customerId/debts` | Pagination/query supported by debt handler | Customer debt list |
| [ ] | `GET /customers/:customerId/payments` | Pagination/query supported by payment handler | Customer payment list |

### Frontend coverage

- [x] Customer list fetches real data with search and risk filter query parameters.
- [x] Add-customer dialog calls the create mutation.
- [x] Delete action calls the delete mutation and invalidates customer lists.
- [~] API functions/hooks for detail and update exist, but customer detail page does not consume them.
- [ ] Customer list should display a meaningful financial value from debt data; `creditLimit` is currently shown under the old “Total debt” column.
- [ ] Customer detail must load the customer, nested debts, and nested payments.
- [ ] Customer edit form must use UUID customer IDs and `PATCH /customers/:customerId`.
- [ ] Add pagination controls that pass `page` and `pageSize` instead of only displaying local counts.

## 4. Debts

All routes require a bearer token. Update/delete require owner/admin.

| Status | Method and route | Query/body | Response / notes |
| --- | --- | --- | --- |
| [~] | `GET /debts` | `page`, `pageSize`, `status`, `customerId`, `overdue`, `sort` | Paginated `Debt[]` |
| [~] | `POST /debts` | `customerId` UUID, `amount`, optional `description`/`issuedDate`, required `dueDate` | `201`, debt |
| [~] | `GET /debts/:debtId` | UUID path | `200`, debt with paid/remaining amounts |
| [~] | `PATCH /debts/:debtId` | Partial `amount`, `description`, `dueDate` | `200`, updated debt |
| [~] | `DELETE /debts/:debtId` | UUID path | `204` |
| [~] | `POST /debts/:debtId/mark-paid` | UUID path | `200`, updated debt |
| [~] | `POST /debts/:debtId/payments` | `customerId`, `amount`, optional method/reference/notes/paidAt/idempotencyKey | `201`, payment |

### Frontend coverage

- [~] Typed API functions and query/mutation hooks exist.
- [ ] Debts list still renders a hard-coded array and timeout delete handler.
- [ ] Record-debt dialog must select a real customer UUID; its current customer field is a display string.
- [ ] Debt detail page must load `GET /debts/:debtId`.
- [ ] Add edit, delete, and mark-paid actions with role/error handling.
- [ ] Invalidate dashboard, customer detail, and payment queries after debt mutations.

## 5. Payments

All routes require a bearer token. Delete requires owner.

| Status | Method and route | Query/body | Response / notes |
| --- | --- | --- | --- |
| [~] | `GET /payments` | `page`, `pageSize`, `customerId`, `debtId`, `method`, `sort` | Paginated `Payment[]` |
| [~] | `POST /payments` | `customerId` UUID, optional `debtId`, `amount`, method/reference/notes/paidAt/idempotencyKey | `201`, payment |
| [~] | `GET /payments/:paymentId` | UUID path | `200`, payment |
| [~] | `DELETE /payments/:paymentId` | UUID path | `204` |
| [~] | `GET /customers/:customerId/payments` | Nested customer path | Payment list |
| [~] | `GET /debts/:debtId/payments` | No list route is registered; only create is registered | [!] Backend currently has no `GET /debts/:debtId/payments` route |

### Frontend coverage

- [~] Typed API functions and query/mutation hooks exist.
- [ ] Payments list still renders a hard-coded array and timeout delete handler.
- [ ] Record-payment dialog must select customer/debt UUIDs and send a backend-compatible payload.
- [ ] Payment detail page must load `GET /payments/:paymentId`.
- [ ] Add role-aware delete handling and invalidate debt/dashboard analytics after payment changes.
- [ ] Decide whether debt payment creation should be used from the debt detail flow or the generic payment flow.

## 6. Dashboard

All routes require a bearer token.

| Status | Method and route | Query | Response |
| --- | --- | --- | --- |
| [ ] | `GET /dashboard/summary` | None | Currency plus outstanding, overdue, customer, and collected metrics |
| [ ] | `GET /dashboard/recent-debts` | Optional `limit` | Recent debts with customer names |
| [ ] | `GET /dashboard/recent-payments` | Optional `limit` | Recent payments with customer names |
| [ ] | `GET /dashboard/risk-distribution` | None | Risk buckets with counts/percentages |
| [ ] | `GET /dashboard/collections-trend` | Optional `months` | Currency and monthly collections/outstanding points |

### Frontend coverage

- [ ] No dashboard API module or query hooks exist.
- [ ] Dashboard KPI values, chart data, recent debt rows, and recent payment rows are static.
- [ ] Add loading, error, and empty states for each dashboard data group.
- [ ] Mutations on debts/payments/customers must invalidate dashboard queries.

## 7. Analytics

All routes require a bearer token. Query parameter `months` is accepted where shown. Export is a CSV stream, not the normal JSON envelope.

| Status | Method and route | Query | Response |
| --- | --- | --- | --- |
| [ ] | `GET /analytics/collection-rate` | Optional `months` | Currency, target, monthly actual/target/rate |
| [ ] | `GET /analytics/risk-trend` | Optional `months` | Monthly low/medium/high counts plus history metadata |
| [ ] | `GET /analytics/customer-segments` | None | Currency and value segments with bounds/counts |
| [ ] | `GET /analytics/export` | Optional `format=csv`, `months` | CSV download; other formats return `400` |

### Frontend coverage

- [ ] Analytics page uses hard-coded KPI, collection, risk, segment, and insight arrays.
- [ ] Add analytics API and query modules.
- [ ] Replace static charts with API response mapping.
- [ ] Replace the export button with a CSV download that handles blob/text responses rather than `unwrap`.
- [ ] Remove unsupported fabricated KPIs/insights or derive them only from available backend fields.

## 8. Backend Routes Referenced in Documentation but Not Built

The following routes appear in `docs/endpoints.md` but are not registered in `cmd/server/main.go`. They are backend work, not frontend integration work yet.

### Authentication/security

- [B] `POST /api/auth/2fa/enable`
- [B] `POST /api/auth/2fa/disable`

### Onboarding/customer operations

- [B] `POST /api/onboarding/seed`
- [B] `GET/POST /api/customers/:customerId/notes`
- [B] `GET /api/customers/:customerId/activity`

### Debt operations

- [B] `POST /api/debts/:debtId/reschedule`
- [B] `POST /api/debts/:debtId/waive`
- [B] `GET /api/debts/:debtId/schedule`
- [B] `GET /api/debts/:debtId/activity`

### Payment operations

- [B] `PATCH /api/payments/:paymentId`
- [B] `GET /api/payments/:paymentId/receipt`
- [B] `POST /api/payments/:paymentId/send-receipt`
- [B] `GET /api/debts/:debtId/payments` list route

### Notifications and communications

- [B] `/api/notifications`
- [B] `/api/notification-preferences`
- [B] `/api/reminders/debts/:debtId`
- [B] `/api/communications`

### Files, reporting, and operations

- [B] `/api/uploads`
- [B] `/api/reports`
- [B] `/api/audit-logs`
- [B] `/api/search`
- [B] `/api/settings`

These should not receive mock frontend integrations. Either implement the backend routes or remove/defer the corresponding UI capabilities.

## Recommended Integration Order

1. Add business/onboarding API modules and connect onboarding completion/status.
2. Add dashboard API modules and replace dashboard static data.
3. Wire debts list/detail/create/delete/mark-paid, including customer UUID selection.
4. Wire payments list/detail/create/delete and debt-linked payment creation.
5. Add customer detail/update and nested customer debts/payments.
6. Add analytics API modules, chart mappings, loading/error/empty states, and CSV export.
7. Complete password recovery, profile, logout, sessions, settings, and route guards.
8. Resolve backend-not-built capabilities only when their product behavior is specified.

## Validation Checklist

- [x] `pnpm exec tsc --noEmit` passes after the current integration work.
- [ ] Run frontend lint after each feature batch; existing unrelated lint errors remain in landing footer/navbar.
- [ ] Start backend with database and verify CORS origin matches the frontend URL.
- [ ] Verify login/register set refresh cookie and store access token.
- [ ] Verify expired access token refreshes once and retries the original request.
- [ ] Verify `401`, `403`, `404`, `409`, and validation errors render useful UI messages.
- [ ] Verify empty list responses do not render stale mock rows.
- [ ] Verify all mutations invalidate affected list, detail, dashboard, and analytics queries.
- [ ] Verify UUIDs are passed for customer/debt/payment relationships.
- [ ] Verify CSV export uses a download response and does not assume JSON envelope data.