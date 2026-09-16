'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { invalidateFinancials } from '@/api/invalidate';
import {
  createDebtPayment,
  createPayment,
  deletePayment,
  getPayment,
  listCustomerPayments,
  listDebtPayments,
  listPayments,
  updatePayment,
  type CreatePaymentInput,
  type PaymentListParams,
  type UpdatePaymentInput,
} from '@/api/payments/payments.api';
import { queryKeys } from '@/api/query-keys';

export function usePayments(params?: PaymentListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.payments.list(params),
    queryFn: () => listPayments(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useCustomerPayments(
  customerId: string,
  params?: Omit<PaymentListParams, 'customerId'>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.payments.byCustomer(customerId, params),
    queryFn: () => listCustomerPayments(customerId, params),
    enabled: enabled && Boolean(customerId),
  });
}

export function useDebtPayments(
  debtId: string,
  params?: Omit<PaymentListParams, 'debtId'>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.payments.byDebt(debtId, params),
    queryFn: () => listDebtPayments(debtId, params),
    enabled: enabled && Boolean(debtId),
  });
}

export function usePayment(paymentId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => getPayment(paymentId),
    enabled: enabled && Boolean(paymentId),
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => createPayment(input),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
      invalidateFinancials(queryClient);
    },
  });
}

/** Records a payment against one debt; the server derives the customer. */
export function useCreateDebtPayment(debtId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<CreatePaymentInput, 'customerId' | 'debtId'>) =>
      createDebtPayment(debtId, input),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(payment.id), payment);
      invalidateFinancials(queryClient);
    },
  });
}

/**
 * Owner/admin only. Correcting an amount moves the linked debt between pending,
 * partial and paid, so the whole financial cluster is invalidated.
 */
export function useUpdatePayment(paymentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePaymentInput) => updatePayment(paymentId, input),
    onSuccess: (payment) => {
      queryClient.setQueryData(queryKeys.payments.detail(paymentId), payment);
      invalidateFinancials(queryClient);
    },
  });
}

/** Owner only. Voiding a payment recomputes the linked debt's status. */
export function useDeletePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentId: string) => deletePayment(paymentId),
    onSuccess: (_result, paymentId) => {
      queryClient.removeQueries({ queryKey: queryKeys.payments.detail(paymentId) });
      invalidateFinancials(queryClient);
    },
  });
}
