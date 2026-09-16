'use client';

import React, { Suspense, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Eye, EyeOff, KeyRound } from 'lucide-react';

import { PASSWORD_MIN_LENGTH } from '@/api/auth/auth.api';
import { useResetPassword } from '@/api/auth/auth.queries';
import { resetPasswordSchema, type ResetPasswordValues } from '@/api/auth/auth.schema';
import { FullPageLoader, InlineError } from '@/components/feedback/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { validateForm, type FieldErrors } from '@/lib/form';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  // The emailed link carries the token: `/reset-password?token=…`.
  const token = searchParams.get('token') ?? '';

  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [values, setValues] = useState({ newPassword: '', confirmPassword: '' });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ResetPasswordValues>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const rules = [
    { label: `At least ${PASSWORD_MIN_LENGTH} characters`, valid: values.newPassword.length >= PASSWORD_MIN_LENGTH },
    { label: 'One uppercase letter', valid: /[A-Z]/.test(values.newPassword) },
    { label: 'One number', valid: /\d/.test(values.newPassword) },
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(resetPasswordSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await resetPassword.mutateAsync({ token, newPassword: result.data.newPassword });
      setIsSuccess(true);
    } catch {
      // Rendered below: an expired or already-used token comes back as a 400.
    }
  };

  const update = (field: keyof ResetPasswordValues) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((previous) => ({ ...previous, [field]: event.target.value }));

  if (!token) {
    return (
      <CenteredMessage
        title="This link is incomplete."
        description="Reset links expire after an hour and can only be used once. Request a new one to continue."
        actionHref="/forgot-password"
        actionLabel="Request a new link"
      />
    );
  }

  if (isSuccess) {
    return (
      <CenteredMessage
        icon
        title="Password reset."
        description="Your password has been updated and every other session was signed out. Sign in with your new password."
        actionHref="/login"
        actionLabel="Go to sign in"
      />
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
            <KeyRound className="w-3 h-3 text-primary" strokeWidth={2.25} />
            <span className="text-xs font-medium text-primary tracking-wide">New password</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Set a new password.
          </h1>
          <p className="text-sm text-muted-foreground mt-3">
            Choose a password you haven&apos;t used before.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <PasswordField
            id="newPassword"
            label="New password"
            placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
            value={values.newPassword}
            onChange={update('newPassword')}
            error={fieldErrors.newPassword}
            visible={showPassword}
            onToggle={() => setShowPassword((shown) => !shown)}
          />

          <PasswordField
            id="confirmPassword"
            label="Confirm password"
            placeholder="Re-enter password"
            value={values.confirmPassword}
            onChange={update('confirmPassword')}
            error={fieldErrors.confirmPassword}
            visible={showConfirm}
            onToggle={() => setShowConfirm((shown) => !shown)}
          />

          <ul className="space-y-1.5 pt-1">
            {rules.map((rule) => (
              <li key={rule.label} className="flex items-center gap-2 text-xs">
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center transition-colors ${
                    rule.valid ? 'bg-primary/15' : 'bg-muted/60'
                  }`}
                >
                  <Check
                    className={`w-2 h-2 transition-colors ${
                      rule.valid ? 'text-primary' : 'text-muted-foreground/50'
                    }`}
                    strokeWidth={3}
                  />
                </div>
                <span className={rule.valid ? 'text-foreground/80' : 'text-muted-foreground'}>
                  {rule.label}
                </span>
              </li>
            ))}
          </ul>

          <Button
            type="submit"
            disabled={resetPassword.isPending}
            className="w-full h-11 rounded-full mt-4 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {resetPassword.isPending ? 'Resetting…' : 'Reset password'}
            {!resetPassword.isPending && <ArrowRight className="w-4 h-4" />}
          </Button>

          <InlineError
            error={resetPassword.error}
            fallback="We could not reset your password. The link may have expired."
            className="text-center"
          />
        </form>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Remembered it?{' '}
          <Link href="/login" className="text-foreground font-medium hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border pr-10 focus-visible:border-primary/40 focus-visible:ring-primary/15"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

function CenteredMessage({
  icon = false,
  title,
  description,
  actionHref,
  actionLabel,
}: {
  icon?: boolean;
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm text-center"
      >
        {icon && (
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
            <Check className="w-5 h-5 text-primary" strokeWidth={2.5} />
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-xs mx-auto">{description}</p>
        <Button
          asChild
          className="w-full h-11 rounded-full mt-8 text-sm shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Link href={actionHref}>
            {actionLabel}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
