import { z } from 'zod';

import { RISK_LEVELS } from '@/api/customers/customers.api';

const optionalEmail = z.union([
  z.literal(''),
  z.string().trim().email('Enter a valid email address'),
]);

/** Mirrors the backend's own customer validation. */
export const customerSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required'),
  email: optionalEmail,
  phone: z.string().trim().max(32, 'Phone number is too long'),
  companyName: z.string().trim().max(200, 'Company name is too long'),
  address: z.string().trim().max(500, 'Address is too long'),
  riskLevel: z.enum(RISK_LEVELS, { message: 'Select a risk level' }),
  creditLimit: z
    .number({ message: 'Enter a number' })
    .nonnegative('Credit limit cannot be negative'),
  notes: z.string().trim().max(2000, 'Notes are too long'),
});

/** The quick-add dialog collects only what is needed to start tracking debts. */
export const quickAddCustomerSchema = customerSchema.pick({
  name: true,
  email: true,
  phone: true,
  riskLevel: true,
});

export type CustomerValues = z.infer<typeof customerSchema>;
export type QuickAddCustomerValues = z.infer<typeof quickAddCustomerSchema>;
