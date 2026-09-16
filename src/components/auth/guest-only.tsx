'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/components/providers/session-provider';
import { FullPageLoader } from '@/components/feedback/states';

/**
 * Redirects a signed-in user away from sign-in and registration. The form
 * renders while the session is still restoring — almost everyone here is signed
 * out, and making them wait on a round-trip to type would be the wrong trade.
 */
export function GuestOnly({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, business } = useSession();

  useEffect(() => {
    if (status !== 'authenticated') return;
    router.replace(business?.onboardingCompleted === false ? '/onboarding' : '/dashboard');
  }, [business?.onboardingCompleted, router, status]);

  if (status === 'authenticated') {
    return <FullPageLoader label="Taking you to your dashboard…" />;
  }

  return <>{children}</>;
}
