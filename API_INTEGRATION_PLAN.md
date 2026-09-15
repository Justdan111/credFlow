# CredFlow API Integration

## Backend Contract

The API base path is `/api`. Successful responses use `{ data, meta, error }`; paginated list endpoints put the page information in `meta`. Errors use the same envelope with `data: null` and an `error.message`. Authenticated routes require `Authorization: Bearer <accessToken>`. Login and registration also set an httpOnly refresh cookie; the frontend sends it with credentials to rotate access tokens through `/api/auth/refresh`.

## Route Map

| Feature | Routes | Frontend consumer |
| --- | --- | --- |
| Auth | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `PATCH /auth/me`, `POST /auth/refresh`, `POST /auth/logout`, password/session routes | Login, register, forgot/reset password, settings |
| Business/onboarding | `GET/PATCH /businesses/current`, `GET /onboarding/status`, `POST /onboarding/complete` | Onboarding, settings |
| Customers | `GET/POST /customers`, `GET/PATCH/DELETE /customers/:customerId`, nested debts/payments lists | Customers and customer detail |
| Debts | `GET/POST /debts`, `GET/PATCH/DELETE /debts/:debtId`, `POST /debts/:debtId/mark-paid`, nested payment create | Debts and debt detail |
| Payments | `GET/POST /payments`, `GET/DELETE /payments/:paymentId`, nested customer/debt routes | Payments and payment detail |
| Dashboard | `GET /dashboard/summary`, recent debts/payments, risk distribution, collections trend | Dashboard |
| Analytics | collection rate, risk trend, customer segments, export | Analytics |

## Frontend Structure

`src/api/client.ts` owns Axios configuration, bearer injection, refresh/retry behavior, and response unwrapping. Each backend feature gets an `*.api.ts` module for HTTP calls and an `*.queries.ts` module for TanStack Query keys/hooks. Pages remain responsible for presentation and use mutations to invalidate related list/detail queries.