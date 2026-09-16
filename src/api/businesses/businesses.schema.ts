import { z } from 'zod';

import { BUSINESS_SIZES, INDUSTRIES, SUPPORTED_CURRENCIES } from '@/api/businesses/businesses.api';

const currency = z.enum(SUPPORTED_CURRENCIES, {
  message: `Currency must be one of ${SUPPORTED_CURRENCIES.join(', ')}`,
});

const isoDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid date')
  .refine((value) => !Number.isNaN(Date.parse(value)), 'Use a valid date');

export const businessProfileSchema = z.object({
  name: z.string().trim().min(1, 'Business name cannot be empty'),
  industry: z.enum(INDUSTRIES, { message: 'Select an industry' }),
  size: z.enum(BUSINESS_SIZES, { message: 'Select a team size' }),
  currency,
  monthlyCollectionTarget: z
    .number({ message: 'Enter a number' })
    .nonnegative('Target cannot be negative')
    .nullable(),
});

/** Step one of onboarding: the business profile itself. */
export const onboardingBusinessSchema = z.object({
  industry: z.enum(INDUSTRIES, { message: 'Select an industry' }),
  size: z.enum(BUSINESS_SIZES, { message: 'Select a team size' }),
  currency,
});

/** Step two: optional, but once a name is typed the contact details must parse. */
export const onboardingCustomerSchema = z.object({
  name: z.string().trim().min(1, 'Customer name is required'),
  email: z.union([z.literal(''), z.string().trim().email('Enter a valid email address')]),
  phone: z.string().trim().max(32, 'Phone number is too long'),
});

/** Step three: only reachable when a customer was supplied. */
export const onboardingDebtSchema = z.object({
  amount: z.number({ message: 'Enter an amount' }).positive('Amount must be greater than zero'),
  dueDate: isoDate,
});

export type BusinessProfileValues = z.infer<typeof businessProfileSchema>;
export type OnboardingBusinessValues = z.infer<typeof onboardingBusinessSchema>;
export type OnboardingCustomerValues = z.infer<typeof onboardingCustomerSchema>;
export type OnboardingDebtValues = z.infer<typeof onboardingDebtSchema>;
