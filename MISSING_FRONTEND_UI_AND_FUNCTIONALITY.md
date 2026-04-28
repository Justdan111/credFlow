# CredFlow Missing Frontend, UI, and Functionality

## Diagnosis

The app already has a strong visual shell: landing page, auth pages, onboarding, dashboard, analytics, and settings. What is missing is the real product depth that makes those surfaces usable in day-to-day operations.

Right now most screens are presentation layers with hard-coded data. The app needs detail pages, CRUD flows, state management, empty/error/loading states, and operational tools like reminders, notes, exports, and audit trails.

## What Exists Today

- Landing page with marketing sections and CTA buttons.
- Auth pages for login, registration, forgot password, reset password, and onboarding.
- Dashboard list views for customers, debts, payments, analytics, and settings.
- Visual charting and animated cards, but mostly with mock data.

## Major Missing Areas

### Detail pages that should exist

These are the biggest missing UX gaps in the app:

| Route | What it should contain |
| --- | --- |
| `/customers/[id]` | Customer profile, contact details, credit history, total exposure, linked debts, linked payments, notes, communication history, and risk score history. |
| `/debts/[id]` | Debt summary, repayment terms, balance, due date, accrued interest, status timeline, linked customer, linked payments, reminders sent, and actions like edit, reschedule, waive, or close. |
| `/payments/[id]` | Payment summary, receipt/reference data, linked debt, allocation breakdown, proof of payment, reconciliation status, and refund/void controls. |
| `/analytics/[segment]` or `/reports/[id]` | Drill-down views for chart points, filtered report results, and export history. |
| `/notifications` | Notification inbox with read/unread states, filters, and reminder actions. |

### Missing CRUD flows

- Add customer form or drawer.
- Edit customer form or drawer.
- Record debt modal or wizard.
- Edit debt form.
- Record payment flow with debt lookup and payment method selection.
- Payment correction or refund flow.
- Customer note and call-log composer.
- Attachment upload for receipts or supporting documents.

### Missing dashboard interactions

- Clickable metric cards that drill into filtered views.
- Clickable table rows that open detail pages.
- Chart interactions that open pre-filtered analytics or reports.
- Live filters for date range, customer segment, risk level, and payment method.
- Real pagination instead of the static next/previous controls.

### Missing operational features

- Collections reminder center.
- Overdue follow-up queue.
- Communication history for SMS, email, and in-app reminders.
- Audit log and activity trail for financial actions.
- Saved reports and scheduled exports.
- Global search across customers, debts, and payments.
- Multi-user/team roles and permission controls.
- Session management and security controls connected to the settings screen.

## Screen-by-Screen Gaps

### Landing page

The marketing page is fine as a first pass, but it still lacks product proof and conversion depth:

- No pricing section.
- No testimonials or trust indicators beyond generic copy.
- No FAQ or support links.
- No product screenshots or live data previews.

### Auth pages

The auth screens look complete visually, but they are not functional:

- Form submission does not hit a backend.
- No validation feedback or field-level error states.
- No account lockout, rate-limit, or recovery state handling.
- No email verification flow.
- No session persistence after login.

### Onboarding

Onboarding currently collects data in local state only.

- No persistence across refreshes.
- No backend save or completion signal.
- No business setup validation.
- No option to skip, resume, or revisit onboarding steps.

### Dashboard

The dashboard should be the operational command center, but it is still static.

- Summary metrics are hard-coded.
- Recent debts are hard-coded.
- Charts are hard-coded.
- No real-time refresh or last-updated indicator.
- No drill-down links into customers, debts, or payments.

### Customers

The current customer list is missing the complete management surface.

- No customer profile page.
- No customer creation/edit modal.
- No customer notes, call log, or communication timeline.
- No risk history or credit-limit management.
- No linked debts/payments tab view.
- No bulk actions or CSV import.

### Debts

The debts list needs a much richer workflow.

- No debt detail page.
- No installment schedule or interest breakdown.
- No overdue escalation controls.
- No payment allocation view.
- No write-off or waiver workflow.
- No reminder history.

### Payments

The payments area needs reconciliation features, not just a table.

- No payment detail page.
- No receipt viewer or export.
- No proof-of-payment attachment.
- No reverse/refund path.
- No bank reconciliation or matching status.
- No filtering by method, source, or date range.

### Analytics

Analytics currently shows charts, but not analysis workflows.

- No report builder.
- No date range switcher.
- No segment drill-down.
- No export action wired to a backend.
- No saved insights or scheduled reports.

### Settings

Settings looks broad, but a production app needs more structure.

- Profile settings should persist to the backend.
- Notifications settings should be connected to real preferences.
- Security should include password change, session management, and 2FA state.
- Appearance should integrate with the theme system instead of only local toggles.
- Billing, plan management, and subscription history are missing.

## Suggested Route Map

If this app is taken to production, these routes should be added next:

- `/customers/new`
- `/customers/[id]`
- `/customers/[id]/edit`
- `/customers/[id]/notes`
- `/debts/new`
- `/debts/[id]`
- `/debts/[id]/edit`
- `/payments/new`
- `/payments/[id]`
- `/reports`
- `/reports/[id]`
- `/notifications`
- `/audit-logs`
- `/team`
- `/billing`

## Prioritized Build Order

1. Connect auth, onboarding, and session state to real APIs.
2. Add customer, debt, and payment detail pages.
3. Wire create/edit/delete flows with validation and optimistic UI.
4. Replace mock dashboard data with API-driven summary and chart data.
5. Add notifications, reminders, audit logs, and exports.
6. Finish settings, billing, and team/admin features.

## Bottom Line

The app is visually credible, but functionally incomplete. The missing work is not cosmetic polish; it is the operational core: persistence, detail views, CRUD, reconciliation, reporting, and workflow state.