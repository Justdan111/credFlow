'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
  type CreateCustomerInput,
  type CustomerListParams,
  type UpdateCustomerInput,
} from '@/api/customers/customers.api';
import { invalidateFinancials } from '@/api/invalidate';
import { queryKeys } from '@/api/query-keys';

export function useCustomers(params?: CustomerListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customers.list(params),
    queryFn: () => listCustomers(params),
    enabled,
    // Keeps the previous page on screen while the next one loads, so the table
    // does not collapse to a spinner on every page change.
    placeholderData: (previous) => previous,
  });
}

export function useCustomer(customerId: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.customers.detail(customerId),
    queryFn: () => getCustomer(customerId),
    enabled: enabled && Boolean(customerId),
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateCustomerInput) => createCustomer(input),
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customers.detail(customer.id), customer);
      invalidateFinancials(queryClient);
    },
  });
}

export function useUpdateCustomer(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCustomerInput) => updateCustomer(customerId, input),
    onSuccess: (customer) => {
      queryClient.setQueryData(queryKeys.customers.detail(customerId), customer);
      // Risk level and credit limit feed the analytics segments.
      invalidateFinancials(queryClient);
    },
  });
}

/** Owner/admin only. */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: (_result, customerId) => {
      queryClient.removeQueries({ queryKey: queryKeys.customers.detail(customerId) });
      invalidateFinancials(queryClient);
    },
  });
}
