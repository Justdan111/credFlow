'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createDebtPayment, createPayment, deletePayment, getPayment, listPayments, type PaymentInput, type PaymentListParams } from '@/api/payments/payments.api';
import { debtKeys } from '@/api/debts/debts.queries';

export const paymentKeys = { all: ['payments'] as const, lists: () => [...paymentKeys.all, 'list'] as const, list: (params?: PaymentListParams) => [...paymentKeys.lists(), params] as const, detail: (id: string) => [...paymentKeys.all, 'detail', id] as const };
export function usePayments(params?: PaymentListParams) { return useQuery({ queryKey: paymentKeys.list(params), queryFn: () => listPayments(params) }); }
export function usePayment(id: string) { return useQuery({ queryKey: paymentKeys.detail(id), queryFn: () => getPayment(id), enabled: Boolean(id) }); }
function invalidatePayments(queryClient: ReturnType<typeof useQueryClient>) { queryClient.invalidateQueries({ queryKey: paymentKeys.all }); queryClient.invalidateQueries({ queryKey: debtKeys.all }); }
export function useCreatePayment() { const queryClient = useQueryClient(); return useMutation({ mutationFn: createPayment, onSuccess: () => invalidatePayments(queryClient) }); }
export function useCreateDebtPayment(debtId: string) { const queryClient = useQueryClient(); return useMutation({ mutationFn: (input: Omit<PaymentInput, 'debtId'>) => createDebtPayment(debtId, input), onSuccess: () => invalidatePayments(queryClient) }); }
export function useDeletePayment() { const queryClient = useQueryClient(); return useMutation({ mutationFn: deletePayment, onSuccess: () => invalidatePayments(queryClient) }); }