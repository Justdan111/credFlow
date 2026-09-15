'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDebt, deleteDebt, getDebt, listDebts, markDebtPaid, updateDebt, type DebtInput, type DebtListParams } from '@/api/debts/debts.api';
import { customerKeys } from '@/api/customers/customers.queries';

export const debtKeys = { all: ['debts'] as const, lists: () => [...debtKeys.all, 'list'] as const, list: (params?: DebtListParams) => [...debtKeys.lists(), params] as const, detail: (id: string) => [...debtKeys.all, 'detail', id] as const };
export function useDebts(params?: DebtListParams) { return useQuery({ queryKey: debtKeys.list(params), queryFn: () => listDebts(params) }); }
export function useDebt(id: string) { return useQuery({ queryKey: debtKeys.detail(id), queryFn: () => getDebt(id), enabled: Boolean(id) }); }
function invalidateDebts(queryClient: ReturnType<typeof useQueryClient>) { queryClient.invalidateQueries({ queryKey: debtKeys.all }); queryClient.invalidateQueries({ queryKey: customerKeys.all }); }
export function useCreateDebt() { const queryClient = useQueryClient(); return useMutation({ mutationFn: (input: DebtInput) => createDebt(input), onSuccess: () => invalidateDebts(queryClient) }); }
export function useUpdateDebt(id: string) { const queryClient = useQueryClient(); return useMutation({ mutationFn: (input: Partial<Omit<DebtInput, 'customerId'>>) => updateDebt(id, input), onSuccess: () => { invalidateDebts(queryClient); queryClient.invalidateQueries({ queryKey: debtKeys.detail(id) }); } }); }
export function useDeleteDebt() { const queryClient = useQueryClient(); return useMutation({ mutationFn: deleteDebt, onSuccess: () => invalidateDebts(queryClient) }); }
export function useMarkDebtPaid() { const queryClient = useQueryClient(); return useMutation({ mutationFn: markDebtPaid, onSuccess: () => invalidateDebts(queryClient) }); }