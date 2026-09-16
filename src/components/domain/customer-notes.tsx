'use client';

import { useState } from 'react';
import { Send, Trash2 } from 'lucide-react';

import {
  NOTE_CHANNELS,
  NOTE_CHANNEL_LABELS,
  type NoteChannel,
} from '@/api/notes/notes.api';
import { useCreateNote, useCustomerNotes, useDeleteNote } from '@/api/notes/notes.queries';
import { noteSchema, type NoteValues } from '@/api/notes/notes.schema';
import { MAX_PAGE_SIZE } from '@/api/types';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { EmptyState, ErrorState, InlineError, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime, initials } from '@/lib/format';
import { validateForm, type FieldErrors } from '@/lib/form';

/** Follow-up history for one customer: calls, visits and messages. */
export function CustomerNotes({ customerId, customerName }: { customerId: string; customerName: string }) {
  const { canAdminister } = useSession();

  const notesQuery = useCustomerNotes(customerId, { pageSize: MAX_PAGE_SIZE });
  const createNote = useCreateNote(customerId);
  const deleteNote = useDeleteNote();

  const [values, setValues] = useState({ body: '', channel: 'note' as NoteChannel });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<NoteValues>>({});
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const notes = notesQuery.data?.items ?? [];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(noteSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await createNote.mutateAsync(result.data);
      setValues({ body: '', channel: values.channel });
      setFieldErrors({});
    } catch {
    }
  };

  const handleDelete = async () => {
    if (!pendingDeleteId) return;
    try {
      await deleteNote.mutateAsync(pendingDeleteId);
      setPendingDeleteId(null);
    } catch {
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-semibold">Follow-up history</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Calls, visits and messages, newest first.
          </p>
        </div>
        {notesQuery.data && (
          <span className="text-xs text-muted-foreground shrink-0">
            {notesQuery.data.meta.total} recorded
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-2 mb-5">
        <Textarea
          value={values.body}
          onChange={(event) => setValues({ ...values, body: event.target.value })}
          placeholder={`What happened with ${customerName}?`}
          aria-label="Note"
          aria-invalid={fieldErrors.body ? true : undefined}
          className="rounded-lg bg-background/80 min-h-16"
        />
        {fieldErrors.body && (
          <p role="alert" className="text-xs text-destructive">
            {fieldErrors.body}
          </p>
        )}
        <div className="flex items-center gap-2">
          <Select
            aria-label="Channel"
            value={values.channel}
            onChange={(event) =>
              setValues({ ...values, channel: event.target.value as NoteChannel })
            }
            className="h-9 w-32 text-xs rounded-lg"
          >
            {NOTE_CHANNELS.map((channel) => (
              <option key={channel} value={channel}>
                {NOTE_CHANNEL_LABELS[channel]}
              </option>
            ))}
          </Select>
          <Button
            type="submit"
            size="sm"
            disabled={createNote.isPending}
            className="rounded-full h-9 text-xs ml-auto ring-1 ring-inset ring-white/10"
          >
            {createNote.isPending ? 'Saving…' : 'Add note'}
            {!createNote.isPending && <Send className="w-3.5 h-3.5" />}
          </Button>
        </div>
        <InlineError error={createNote.error} fallback="We could not save that note." className="text-xs" />
      </form>

      {notesQuery.isPending ? (
        <LoadingState label="Loading history…" />
      ) : notesQuery.isError ? (
        <ErrorState
          error={notesQuery.error}
          fallback="We could not load the follow-up history."
          onRetry={() => notesQuery.refetch()}
        />
      ) : notes.length === 0 ? (
        <EmptyState
          title="Nothing recorded yet"
          description="Add the first note so the next person picking this up has the context."
        />
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li key={note.id} className="flex gap-3 group">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground shrink-0">
                {initials(note.authorName)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-medium">{note.authorName}</span>
                  <span className="text-[10px] font-medium uppercase tracking-widest bg-muted text-muted-foreground px-1.5 py-0.5 rounded">
                    {NOTE_CHANNEL_LABELS[note.channel as NoteChannel] ?? note.channel}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {formatDateTime(note.createdAt)}
                  </span>
                </div>
                <p className="text-sm mt-1 whitespace-pre-wrap break-words">{note.body}</p>
              </div>
              {/* Retracting somebody's record of a conversation is admin-only,
                  matching what the API will accept. */}
              {canAdminister && (
                <button
                  type="button"
                  onClick={() => setPendingDeleteId(note.id)}
                  aria-label="Retract note"
                  className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 focus:opacity-100 hover:text-destructive hover:bg-muted/60 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <DeleteConfirmationDialog
        open={pendingDeleteId !== null}
        onOpenChange={(open) => !open && setPendingDeleteId(null)}
        title="Retract note"
        description="This removes the note from the follow-up history. It cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteNote.isPending}
        error={deleteNote.error}
        confirmLabel="Retract"
      />
    </div>
  );
}
