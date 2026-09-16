'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useSession } from '@/components/providers/session-provider';
import { FullPageLoader } from '@/components/feedback/states';

/**
 * Keeps a signed-in user off the sign-in and registration screens, sending
 * them wherever they actually belong: onboarding if it is unfinished, the
 * dashboard otherwise.
 *
 * The form renders immediately while the session is still being restored.
 * Almost everyone who opens these pages is signed out, and making them wait on
 * a round-trip to the API before they can start typing would be the wrong
 * trade for the rare case of an already-authenticated visitor.
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
