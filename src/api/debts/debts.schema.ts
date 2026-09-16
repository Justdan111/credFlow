import { z } from 'zod';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Use a valid date');

const baseDebt = z.object({
  customerId: z.string().uuid('Select a customer'),
  amount: z.number({ message: 'Enter an amount' }).positive('Amount must be greater than zero'),
  description: z.string().trim().max(1000, 'Description is too long'),
  issuedDate: z.union([z.literal(''), isoDate]),
  dueDate: isoDate,
});

/** A debt cannot come due before it was issued; checked here to skip a round-trip. */
const dueAfterIssued = (values: { issuedDate: string; dueDate: string }) =>
  !values.issuedDate || values.dueDate >= values.issuedDate;

export const debtSchema = baseDebt.refine(dueAfterIssued, {
  message: 'Due date cannot be before the issue date',
  path: ['dueDate'],
});

/** Editing a debt cannot move it to another customer. */
export const updateDebtSchema = baseDebt.omit({ customerId: true }).refine(dueAfterIssued, {
  message: 'Due date cannot be before the issue date',
  path: ['dueDate'],
});

export type DebtValues = z.infer<typeof debtSchema>;
export type UpdateDebtValues = z.infer<typeof updateDebtSchema>;
