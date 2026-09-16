'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Mail } from 'lucide-react';

import { useRequestPasswordReset } from '@/api/auth/auth.queries';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/api/auth/auth.schema';
import { InlineError } from '@/components/feedback/states';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { validateForm, type FieldErrors } from '@/lib/form';

export default function ForgotPasswordPage() {
  const requestReset = useRequestPasswordReset();
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ForgotPasswordValues>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(forgotPasswordSchema, { email });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await requestReset.mutateAsync(result.data.email);
      // The API answers the same way whether or not the address is registered,
      // and so does this screen: branching here would turn it into an
      // account-enumeration oracle.
      setIsSubmitted(true);
    } catch {
      // Only transport-level problems reach here; shown below.
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-sm text-center"
        >
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
          >
            <Check className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Check your email.
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">
            If <span className="text-foreground">{email}</span> is registered, a reset link is on
            its way. The link expires in an hour.
          </p>

          <div className="mt-8 p-3 rounded-lg bg-muted/40 border border-border/60 text-xs text-muted-foreground text-left">
            <p>
              Didn&apos;t receive it? Check your spam folder, or{' '}
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-foreground hover:underline underline-offset-4"
              >
                try again
              </button>
              .
            </p>
          </div>

          <Button
            asChild
            className="w-full h-11 rounded-full mt-6 text-sm shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Link href="/login">
              Back to sign in
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    );
  }

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
            <Mail className="w-3 h-3 text-primary" strokeWidth={2.25} />
            <span className="text-xs font-medium text-primary tracking-wide">Password reset</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Forgot your password?
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormField label="Email" htmlFor="email" error={fieldErrors.email}>
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </FormField>

          <Button
            type="submit"
            disabled={requestReset.isPending}
            className="w-full h-11 rounded-full mt-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {requestReset.isPending ? 'Sending…' : 'Send reset link'}
            {!requestReset.isPending && <ArrowRight className="w-4 h-4" />}
          </Button>

          <InlineError
            error={requestReset.error}
            fallback="We could not send the reset link. Please try again."
            className="text-center"
          />
        </form>

        <Link
          href="/login"
          className="mt-8 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to sign in
        </Link>
      </motion.div>
    </div>
  );
}
