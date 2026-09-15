'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCustomer,
  deleteCustomer,
  getCustomer,
  listCustomers,
  updateCustomer,
  type CustomerInput,
  type CustomerListParams,
} from '@/api/customers/customers.api';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (params?: CustomerListParams) => [...customerKeys.lists(), params] as const,
  detail: (id: string) => [...customerKeys.all, 'detail', id] as const,
};

export function useCustomers(params?: CustomerListParams) {
  return useQuery({ queryKey: customerKeys.list(params), queryFn: () => listCustomers(params) });
}

export function useCustomer(id: string) {
  return useQuery({ queryKey: customerKeys.detail(id), queryFn: () => getCustomer(id), enabled: Boolean(id) });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: CustomerInput) => createCustomer(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.lists() }) });
}

export function useUpdateCustomer(id: string) {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: Partial<CustomerInput>) => updateCustomer(id, input), onSuccess: () => { queryClient.invalidateQueries({ queryKey: customerKeys.lists() }); queryClient.invalidateQueries({ queryKey: customerKeys.detail(id) }); } });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: deleteCustomer, onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.lists() }) });
}