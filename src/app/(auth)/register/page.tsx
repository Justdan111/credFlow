'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff } from 'lucide-react';

import { PASSWORD_MIN_LENGTH } from '@/api/auth/auth.api';
import { useRegister } from '@/api/auth/auth.queries';
import { registerSchema, type RegisterValues } from '@/api/auth/auth.schema';
import { GuestOnly } from '@/components/auth/guest-only';
import { InlineError } from '@/components/feedback/states';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { validateForm, type FieldErrors } from '@/lib/form';

const PERKS = [
  'Free forever plan · No credit card',
  '14-day Growth trial included',
  'Cancel anytime',
];

export default function RegisterPage() {
  return (
    <GuestOnly>
      <RegisterForm />
    </GuestOnly>
  );
}

function RegisterForm() {
  const router = useRouter();
  const register = useRegister();

  const [showPassword, setShowPassword] = useState(false);
  const [values, setValues] = useState({
    businessName: '',
    name: '',
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<RegisterValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(registerSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      // Industry and size are collected during onboarding, where they are
      // shown with the currency they affect. Sending them empty here leaves
      // the business profile step legitimately incomplete.
      await register.mutateAsync({ ...result.data, industry: '', size: '' });
      router.replace('/onboarding');
    } catch {
      // Rendered below from the mutation's error state.
    }
  };

  const update = (field: keyof RegisterValues) => (event: React.ChangeEvent<HTMLInputElement>) =>
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
            <span className="text-xs font-medium text-primary tracking-wide">
              Create your account
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Start collecting smarter.
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Set up your business in under 5 minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Business name" htmlFor="businessName" error={fieldErrors.businessName}>
            <Input
              placeholder="e.g. Bello Traders Ltd"
              autoComplete="organization"
              value={values.businessName}
              onChange={update('businessName')}
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </FormField>

          <FormField label="Your name" htmlFor="name" error={fieldErrors.name}>
            <Input
              placeholder="Amina Bello"
              autoComplete="name"
              value={values.name}
              onChange={update('name')}
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </FormField>

          <FormField label="Work email" htmlFor="email" error={fieldErrors.email}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@business.com"
              value={values.email}
              onChange={update('email')}
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </FormField>

          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">Password</span>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
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

          <label className="flex items-start gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              required
              className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-2 focus:ring-primary/30 mt-0.5 accent-primary"
            />
            <span className="text-xs text-muted-foreground">
              I agree to the{' '}
              <Link href="#" className="text-foreground hover:underline underline-offset-4">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="#" className="text-foreground hover:underline underline-offset-4">
                Privacy Policy
              </Link>
            </span>
          </label>

          <Button
            type="submit"
            disabled={register.isPending}
            className="w-full h-11 rounded-full mt-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {register.isPending ? 'Creating account…' : 'Create account'}
            {!register.isPending && <ArrowRight className="w-4 h-4" />}
          </Button>

          <InlineError
            error={register.error}
            fallback="We could not create your account. Please try again."
            className="text-center"
          />
        </form>

        <ul className="mt-6 space-y-1.5">
          {PERKS.map((perk) => (
            <li key={perk} className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="w-3.5 h-3.5 rounded-full bg-primary/10 flex items-center justify-center">
                <Check className="w-2 h-2 text-primary" strokeWidth={3} />
              </div>
              {perk}
            </li>
          ))}
        </ul>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-foreground font-medium hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
