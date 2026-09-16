import { z } from 'zod';

import { PAYMENT_METHODS } from '@/api/payments/payments.api';

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Use a valid date');

export const paymentSchema = z.object({
  customerId: z.string().uuid('Select a customer'),
  /** Empty means the payment is recorded without attributing it to a debt. */
  debtId: z.union([z.literal(''), z.string().uuid('Select a valid debt')]),
  amount: z.number({ message: 'Enter an amount' }).positive('Amount must be greater than zero'),
  method: z.enum(PAYMENT_METHODS, { message: 'Select a payment method' }),
  reference: z.string().trim().max(120, 'Reference is too long'),
  notes: z.string().trim().max(1000, 'Notes are too long'),
  paidAt: isoDate,
});

/**
 * Correcting a payment. The customer and debt are absent because the API does
 * not accept them — see `updatePayment`.
 */
export const updatePaymentSchema = paymentSchema.omit({ customerId: true, debtId: true });

/** From a debt's own page the debt and customer come from the URL. */
export const debtPaymentSchema = paymentSchema.omit({ customerId: true, debtId: true });

export type PaymentValues = z.infer<typeof paymentSchema>;
export type UpdatePaymentValues = z.infer<typeof updatePaymentSchema>;
export type DebtPaymentValues = z.infer<typeof debtPaymentSchema>;
