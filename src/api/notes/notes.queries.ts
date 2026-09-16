'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createCustomerNote,
  deleteNote,
  listCustomerNotes,
  type CreateNoteInput,
  type NoteListParams,
} from '@/api/notes/notes.api';
import { queryKeys } from '@/api/query-keys';

export function useCustomerNotes(customerId: string, params?: NoteListParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.notes.byCustomer(customerId, params),
    queryFn: () => listCustomerNotes(customerId, params),
    enabled: enabled && Boolean(customerId),
  });
}

export function useCreateNote(customerId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateNoteInput) => createCustomerNote(customerId, input),
    // Notes do not affect any balance, so only this customer's timeline is
    // stale — no reason to invalidate the financial cluster.
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}

/** Owner/admin only. */
export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (noteId: string) => deleteNote(noteId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.notes.all }),
  });
}
