import { z } from 'zod';

import { NOTE_CHANNELS } from '@/api/notes/notes.api';

/** `maxBodyLength` in the backend notes service. */
const MAX_BODY_LENGTH = 5000;

export const noteSchema = z.object({
  body: z
    .string()
    .trim()
    .min(1, 'Write something before saving')
    .max(MAX_BODY_LENGTH, `Keep it under ${MAX_BODY_LENGTH} characters`),
  channel: z.enum(NOTE_CHANNELS, { message: 'Select a channel' }),
});

export type NoteValues = z.infer<typeof noteSchema>;
