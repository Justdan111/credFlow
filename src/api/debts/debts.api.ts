import { apiClient, unwrap } from '@/api/client';
import type { ApiResponse, Paginated } from '@/api/types';

export interface Debt {
  id: string;
  businessId: string;
  customerId: string;
  amount: number;
  amountPaid: number;
  amountRemaining: number;
  description?: string;
  status: string;
  overdue: boolean;
  issuedDate: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DebtListParams {
  page?: number;
  pageSize?: number;
  status?: string;
  customerId?: string;
  overdue?: string;
  sort?: string;
}

export interface DebtInput {
  customerId: string;
  amount: number;
  description?: string;
  issuedDate?: string;
  dueDate: string;
}

export async function listDebts(params?: DebtListParams) {
  const response = await apiClient.get<ApiResponse<Debt[]>>('/debts', { params });
  return { items: unwrap(response), meta: response.data.meta } as Paginated<Debt>;
}

export async function getDebt(id: string) { return unwrap(await apiClient.get<ApiResponse<Debt>>(`/debts/${id}`)); }
export async function createDebt(input: DebtInput) { return unwrap(await apiClient.post<ApiResponse<Debt>>('/debts', input)); }
export async function updateDebt(id: string, input: Partial<Omit<DebtInput, 'customerId'>>) { return unwrap(await apiClient.patch<ApiResponse<Debt>>(`/debts/${id}`, input)); }
export async function deleteDebt(id: string) { await apiClient.delete(`/debts/${id}`); }
export async function markDebtPaid(id: string) { return unwrap(await apiClient.post<ApiResponse<Debt>>(`/debts/${id}/mark-paid`)); }