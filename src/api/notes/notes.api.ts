import { apiClient, cleanParams, unwrap, unwrapPage } from '@/api/client';
import type { ApiEnvelope, PageParams, Paginated } from '@/api/types';

/** Mirrors the CHECK constraint on `customer_notes.channel`. */
export const NOTE_CHANNELS = ['note', 'call', 'sms', 'email', 'visit'] as const;
export type NoteChannel = (typeof NOTE_CHANNELS)[number];

export const NOTE_CHANNEL_LABELS: Record<NoteChannel, string> = {
  note: 'Note',
  call: 'Call',
  sms: 'SMS',
  email: 'Email',
  visit: 'Visit',
};

export interface Note {
  id: string;
  businessId: string;
  customerId: string;
  /** Null once that teammate is removed; `authorName` survives them. */
  authorId: string | null;
  authorName: string;
  body: string;
  channel: NoteChannel | string;
  createdAt: string;
  updatedAt: string;
}

export interface NoteListParams extends PageParams {
  channel?: NoteChannel;
}

export interface CreateNoteInput {
  body: string;
  channel?: NoteChannel;
}

export async function listCustomerNotes(
  customerId: string,
  params?: NoteListParams,
): Promise<Paginated<Note>> {
  const response = await apiClient.get<ApiEnvelope<Note[]>>(`/customers/${customerId}/notes`, {
    params: cleanParams(params),
  });
  return unwrapPage(response, params);
}

export async function createCustomerNote(
  customerId: string,
  input: CreateNoteInput,
): Promise<Note> {
  return unwrap(
    await apiClient.post<ApiEnvelope<Note>>(`/customers/${customerId}/notes`, input),
  );
}

/**
 * Retracts a note. Requires the owner or admin role — a note is somebody's
 * record of a conversation, so removing it is administrative.
 */
export async function deleteNote(noteId: string): Promise<void> {
  await apiClient.delete(`/notes/${noteId}`);
}
