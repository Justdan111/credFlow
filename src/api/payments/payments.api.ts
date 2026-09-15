import { apiClient, unwrap } from '@/api/client';
import type { ApiResponse, Paginated } from '@/api/types';

export interface Payment { id: string; businessId: string; customerId: string; debtId?: string; amount: number; method: string; reference?: string; notes?: string; paidAt: string; createdAt: string; updatedAt: string; }
export interface PaymentListParams { page?: number; pageSize?: number; customerId?: string; debtId?: string; method?: string; sort?: string; }
export interface PaymentInput { customerId: string; debtId?: string; amount: number; method?: string; reference?: string; notes?: string; paidAt?: string; idempotencyKey?: string; }
export async function listPayments(params?: PaymentListParams) { const response = await apiClient.get<ApiResponse<Payment[]>>('/payments', { params }); return { items: unwrap(response), meta: response.data.meta } as Paginated<Payment>; }
export async function getPayment(id: string) { return unwrap(await apiClient.get<ApiResponse<Payment>>(`/payments/${id}`)); }
export async function createPayment(input: PaymentInput) { return unwrap(await apiClient.post<ApiResponse<Payment>>('/payments', input)); }
export async function createDebtPayment(debtId: string, input: Omit<PaymentInput, 'debtId'>) { return unwrap(await apiClient.post<ApiResponse<Payment>>(`/debts/${debtId}/payments`, input)); }
export async function deletePayment(id: string) { await apiClient.delete(`/payments/${id}`); }