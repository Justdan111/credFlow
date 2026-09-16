import { apiClient, cleanParams, unwrap, unwrapPage } from '@/api/client';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

export const PAYMENT_METHODS = [
  'cash',
  'card',
  'bank_transfer',
  'check',
  'mobile_money',
  'other',
] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Cash',
  card: 'Card',
  bank_transfer: 'Bank transfer',
  check: 'Cheque',
  mobile_money: 'Mobile money',
  other: 'Other',
};

export const PAYMENT_SORT_FIELDS = ['createdAt', 'paidAt', 'amount', 'method'] as const;
export type PaymentSortField = (typeof PAYMENT_SORT_FIELDS)[number];
export type PaymentSort = PaymentSortField | `-${PaymentSortField}`;

export interface Payment {
  id: string;
  businessId: string;
  customerId: string;
  /** Null when the payment is not attributed to a specific debt. */
  debtId?: string | null;
  amount: number;
  method: PaymentMethod | string;
  reference?: string | null;
  notes?: string | null;
  paidAt: string;
  idempotencyKey?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentListParams extends PageParams {
  customerId?: string;
  debtId?: string;
  method?: PaymentMethod;
  sort?: PaymentSort;
}

export interface CreatePaymentInput {
  customerId: string;
  debtId?: string;
  amount: number;
  method?: PaymentMethod;
  reference?: string;
  notes?: string;
  /** RFC 3339; defaults to now when omitted. */
  paidAt?: string;
  /**
   * Guards against a double submit creating two payments. The server replays
   * the original record instead of inserting a second one.
   */
  idempotencyKey?: string;
}

export async function listPayments(params?: PaymentListParams): Promise<Paginated<Payment>> {
  const response = await apiClient.get<ApiEnvelope<Payment[]>>('/payments', {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

/** `GET /customers/:customerId/payments`. */
export async function listCustomerPayments(
  customerId: string,
  params?: Omit<PaymentListParams, 'customerId'>,
): Promise<Paginated<Payment>> {
  const response = await apiClient.get<ApiEnvelope<Payment[]>>(
    `/customers/${customerId}/payments`,
    { params: cleanParams(params) },
  );
  return unwrapPage(response, params);
}

/**
 * Payments for one debt.
 *
 * The API exposes no nested list route, so this filters the collection
 * endpoint by `debtId` — same result, one documented place.
 */
export async function listDebtPayments(
  debtId: string,
  params?: Omit<PaymentListParams, 'debtId'>,
): Promise<Paginated<Payment>> {
  return listPayments({ ...params, debtId });
}

export async function getPayment(paymentId: string): Promise<Payment> {
  return unwrap(await apiClient.get<ApiEnvelope<Payment>>(`/payments/${paymentId}`));
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  return unwrap(await apiClient.post<ApiEnvelope<Payment>>('/payments', input));
}

/**
 * Records a payment against one debt. The customer is taken from the debt
 * server-side, so it never has to be supplied (or trusted) by the client.
 */
export async function createDebtPayment(
  debtId: string,
  input: Omit<CreatePaymentInput, 'customerId' | 'debtId'>,
): Promise<Payment> {
  return unwrap(await apiClient.post<ApiEnvelope<Payment>>(`/debts/${debtId}/payments`, input));
}

/** Voids the payment and recomputes the linked debt. Owner role only. */
export async function deletePayment(paymentId: string): Promise<void> {
  await apiClient.delete(`/payments/${paymentId}`);
}

/**
 * A key unique to one submission attempt, so a retry or double click cannot
 * record the same money twice.
 */
export function newIdempotencyKey(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
