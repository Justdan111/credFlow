'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import { useLogin } from '@/api/auth/auth.queries';
import { loginSchema, type LoginValues } from '@/api/auth/auth.schema';
import { GuestOnly } from '@/components/auth/guest-only';
import { FullPageLoader, InlineError } from '@/components/feedback/states';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { validateForm, type FieldErrors } from '@/lib/form';

export default function LoginPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <GuestOnly>
        <LoginForm />
      </GuestOnly>
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useLogin();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<LoginValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(loginSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await login.mutateAsync(result.data);
      // Only same-site paths are honoured, so a crafted ?next= cannot bounce a
      // freshly signed-in user to an attacker's origin.
      const next = searchParams.get('next');
      router.replace(next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard');
    } catch {
      // Rendered below from the mutation's error state.
    }
  };

  const update = (field: keyof LoginValues) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((previous) => ({ ...previous, [field]: event.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-6">
            <span className="text-xs font-medium text-primary tracking-wide">Welcome back</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Sign in to CredFlow.
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Track debts, get paid, and see your cash flow — all in one place.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={values.email}
              onChange={update('email')}
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </FormField>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <Link
                href="/forgot-password"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={values.password}
                onChange={update('password')}
                aria-invalid={fieldErrors.password ? true : undefined}
                className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border pr-10 focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {fieldErrors.password && (
              <p role="alert" className="text-xs text-destructive">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full h-11 rounded-full mt-6 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {login.isPending ? 'Signing in…' : 'Sign in'}
            {!login.isPending && <ArrowRight className="w-4 h-4" />}
          </Button>

          <InlineError
            error={login.error}
            fallback="We could not sign you in. Please try again."
            className="text-center"
          />
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          New to CredFlow?{' '}
          <Link
            href="/register"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
