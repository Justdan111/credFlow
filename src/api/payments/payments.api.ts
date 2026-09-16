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

/** Every key is optional; an omitted field is left unchanged by the API. */
export interface UpdatePaymentInput {
  amount?: number;
  method?: PaymentMethod;
  /** An empty string clears the field; omitting the key leaves it alone. */
  reference?: string;
  notes?: string;
  /** RFC 3339. */
  paidAt?: string;
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
 * `GET /debts/:debtId/payments`.
 *
 * The nested route confirms the debt belongs to this tenant, so an unknown id
 * answers 404 rather than an empty list — which would read as "this debt has no
 * payments" and hide the mistake.
 */
export async function listDebtPayments(
  debtId: string,
  params?: Omit<PaymentListParams, 'debtId'>,
): Promise<Paginated<Payment>> {
  const response = await apiClient.get<ApiEnvelope<Payment[]>>(`/debts/${debtId}/payments`, {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
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

/**
 * Corrects a recorded payment. Requires the owner or admin role.
 *
 * The linked debt's status is recomputed in the same transaction, so raising an
 * amount can settle a debt and lowering it can reopen one.
 *
 * `customerId` and `debtId` are deliberately absent: re-pointing a payment at a
 * different debt would move two balances under one opaque edit. Void it and
 * record it again, which leaves both actions in the audit trail.
 */
export async function updatePayment(
  paymentId: string,
  input: UpdatePaymentInput,
): Promise<Payment> {
  return unwrap(await apiClient.patch<ApiEnvelope<Payment>>(`/payments/${paymentId}`, input));
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
