'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createDebt,
  deleteDebt,
  getDebt,
  listCustomerDebts,
  listDebts,
  markDebtPaid,
  updateDebt,
  type CreateDebtInput,
  type DebtListParams,
  type UpdateDebtInput,
} from '@/api/debts/debts.api';
import { invalidateFinancials } from '@/api/invalidate';
import { queryKeys } from '@/api/query-keys';

export function useDebts(params?: DebtListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.debts.list(params),
    queryFn: () => listDebts(params),
    enabled,
    placeholderData: (previous) => previous,
  });
}

export function useCustomerDebts(
  customerId: string,
  params?: Omit<DebtListParams, 'customerId'>,
  enabled = true,
) {
  return useQuery({
    queryKey: queryKeys.debts.byCustomer(customerId, params),
    queryFn: () => listCustomerDebts(customerId, params),
    enabled: enabled && Boolean(customerId),
  });
}

export function useDebt(debtId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.debts.detail(debtId),
    queryFn: () => getDebt(debtId),
    enabled: enabled && Boolean(debtId),
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateDebtInput) => createDebt(input),
    onSuccess: (debt) => {
      queryClient.setQueryData(queryKeys.debts.detail(debt.id), debt);
      invalidateFinancials(queryClient);
    },
  });
}

/** Owner/admin only. */
export function useUpdateDebt(debtId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateDebtInput) => updateDebt(debtId, input),
    onSuccess: (debt) => {
      queryClient.setQueryData(queryKeys.debts.detail(debtId), debt);
      invalidateFinancials(queryClient);
    },
  });
}

/** Owner/admin only. */
export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (debtId: string) => deleteDebt(debtId),
    onSuccess: (_result, debtId) => {
      queryClient.removeQueries({ queryKey: queryKeys.debts.detail(debtId) });
      invalidateFinancials(queryClient);
    },
  });
}

export function useMarkDebtPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (debtId: string) => markDebtPaid(debtId),
    onSuccess: (debt) => {
      queryClient.setQueryData(queryKeys.debts.detail(debt.id), debt);
      invalidateFinancials(queryClient);
    },
  });
}
