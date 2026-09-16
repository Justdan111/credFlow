import { z } from 'zod';

import { USER_ROLES } from '@/api/auth/auth.api';

/** Mirrors the backend's own invite validation, so the form and the API agree. */
export const inviteMemberSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  role: z.enum(USER_ROLES, { message: 'Select a role' }),
});

export const updateMemberSchema = z.object({
  role: z.enum(USER_ROLES, { message: 'Select a role' }),
});

export type InviteMemberValues = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberValues = z.infer<typeof updateMemberSchema>;
