import { apiClient, unwrap } from '@/api/client';
import type { ApiEnvelope } from '@/api/types';

/** Mirrors the CHECK constraint on `businesses.currency`. */
export const SUPPORTED_CURRENCIES = ['NGN', 'GHS', 'KES', 'ZAR', 'USD'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const INDUSTRIES = [
  'Retail',
  'Wholesale',
  'Services',
  'Manufacturing',
  'Agriculture',
  'Technology',
  'Other',
] as const;

export const BUSINESS_SIZES = ['1', '2-10', '11-50', '50+'] as const;

export const ONBOARDING_STEPS = ['business', 'customer', 'debt'] as const;
export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export interface Business {
  id: string;
  name: string;
  industry: string | null;
  size: string | null;
  currency: string;
  monthlyCollectionTarget: number | null;
  /**
   * True once debts or payments exist: the currency can no longer change,
   * because switching it would silently reinterpret every stored amount.
   */
  currencyLocked: boolean;
  onboardingCompleted: boolean;
  onboardingCompletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateBusinessInput {
  name?: string;
  industry?: string;
  size?: string;
  currency?: string;
  /** `null` clears the target; omitting the key leaves it unchanged. */
  monthlyCollectionTarget?: number | null;
}

export interface OnboardingStatus {
  completed: boolean;
  /** Empty once onboarding is complete. */
  currentStep: OnboardingStep | '';
  steps: {
    business: boolean;
    customer: boolean;
    debt: boolean;
  };
}

export interface CompleteOnboardingInput {
  industry: string;
  size: string;
  currency: string;
  customer?: {
    name: string;
    email?: string;
    phone?: string;
  };
  /** Requires `customer`: the API rejects a debt with nobody to owe it. */
  debt?: {
    amount: number;
    /** `YYYY-MM-DD`. */
    dueDate: string;
  };
}

export interface CompleteOnboardingResult {
  business: Business;
  customerId: string | null;
  debtId: string | null;
}

export async function getCurrentBusiness(): Promise<Business> {
  return unwrap(await apiClient.get<ApiEnvelope<Business>>('/businesses/current'));
}

/** Requires the owner or admin role; other members get a 403. */
export async function updateCurrentBusiness(input: UpdateBusinessInput): Promise<Business> {
  return unwrap(await apiClient.patch<ApiEnvelope<Business>>('/businesses/current', input));
}

export async function getOnboardingStatus(): Promise<OnboardingStatus> {
  return unwrap(await apiClient.get<ApiEnvelope<OnboardingStatus>>('/onboarding/status'));
}

/**
 * Submits the whole onboarding payload in one call. The server writes it in a
 * single transaction, so a partial failure leaves nothing behind to clean up.
 */
export async function completeOnboarding(
  input: CompleteOnboardingInput,
): Promise<CompleteOnboardingResult> {
  return unwrap(
    await apiClient.post<ApiEnvelope<CompleteOnboardingResult>>('/onboarding/complete', input),
  );
}
