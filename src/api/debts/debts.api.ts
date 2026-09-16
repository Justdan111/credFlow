import { apiClient, cleanParams, unwrap, unwrapPage } from '@/api/client';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

export const DEBT_STATUSES = ['pending', 'partial', 'paid'] as const;
export type DebtStatus = (typeof DEBT_STATUSES)[number];

export const DEBT_SORT_FIELDS = ['createdAt', 'updatedAt', 'dueDate', 'amount', 'status'] as const;
export type DebtSortField = (typeof DEBT_SORT_FIELDS)[number];
export type DebtSort = DebtSortField | `-${DebtSortField}`;

export interface Debt {
  id: string;
  businessId: string;
  customerId: string;
  amount: number;
  /** Sum of active payments recorded against this debt. */
  amountPaid: number;
  amountRemaining: number;
  description?: string | null;
  status: DebtStatus | string;
  /** Server-derived: unpaid and past its due date. */
  overdue: boolean;
  issuedDate: string;
  dueDate: string;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DebtListParams extends PageParams {
  status?: DebtStatus;
  customerId?: string;
  /** `'true'` filters to overdue debts only. */
  overdue?: 'true';
  sort?: DebtSort;
}

export interface CreateDebtInput {
  customerId: string;
  amount: number;
  description?: string;
  /** `YYYY-MM-DD`; defaults to today when omitted. */
  issuedDate?: string;
  /** `YYYY-MM-DD`; required, and never before `issuedDate`. */
  dueDate: string;
}

/** The customer a debt belongs to is fixed at creation and cannot be moved. */
export interface UpdateDebtInput {
  amount?: number;
  description?: string;
  dueDate?: string;
}

export async function listDebts(params?: DebtListParams): Promise<Paginated<Debt>> {
  const response = await apiClient.get<ApiEnvelope<Debt[]>>('/debts', {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

/** `GET /customers/:customerId/debts` — 404s when the customer is unknown. */
export async function listCustomerDebts(
  customerId: string,
  params?: Omit<DebtListParams, 'customerId'>,
): Promise<Paginated<Debt>> {
  const response = await apiClient.get<ApiEnvelope<Debt[]>>(`/customers/${customerId}/debts`, {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

export async function getDebt(debtId: string): Promise<Debt> {
  return unwrap(await apiClient.get<ApiEnvelope<Debt>>(`/debts/${debtId}`));
}

export async function createDebt(input: CreateDebtInput): Promise<Debt> {
  return unwrap(await apiClient.post<ApiEnvelope<Debt>>('/debts', input));
}

/** Requires the owner or admin role. */
export async function updateDebt(debtId: string, input: UpdateDebtInput): Promise<Debt> {
  return unwrap(await apiClient.patch<ApiEnvelope<Debt>>(`/debts/${debtId}`, input));
}

/** Soft-deletes the debt; requires the owner or admin role. */
export async function deleteDebt(debtId: string): Promise<void> {
  await apiClient.delete(`/debts/${debtId}`);
}

/** Closes the debt without recording money movement. 409 if it is already paid. */
export async function markDebtPaid(debtId: string): Promise<Debt> {
  return unwrap(await apiClient.post<ApiEnvelope<Debt>>(`/debts/${debtId}/mark-paid`));
}
