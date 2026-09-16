'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  completeOnboarding,
  getCurrentBusiness,
  getOnboardingStatus,
  updateCurrentBusiness,
  type CompleteOnboardingInput,
  type UpdateBusinessInput,
} from '@/api/businesses/businesses.api';
import { invalidateAfterOnboarding } from '@/api/invalidate';
import { queryKeys } from '@/api/query-keys';

export function useCurrentBusiness(enabled = true) {
  return useQuery({
    queryKey: queryKeys.businesses.current(),
    queryFn: getCurrentBusiness,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useOnboardingStatus(enabled = true) {
  return useQuery({
    queryKey: queryKeys.businesses.onboardingStatus(),
    queryFn: getOnboardingStatus,
    enabled,
  });
}

/** Owner/admin only — a member's call comes back as a 403. */
export function useUpdateBusiness() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateBusinessInput) => updateCurrentBusiness(input),
    onSuccess: (business) => {
      queryClient.setQueryData(queryKeys.businesses.current(), business);
      void queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CompleteOnboardingInput) => completeOnboarding(input),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.businesses.current(), result.business);
      invalidateAfterOnboarding(queryClient);
    },
  });
}
