'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

import {
  BUSINESS_SIZES,
  INDUSTRIES,
  SUPPORTED_CURRENCIES,
  type CompleteOnboardingInput,
} from '@/api/businesses/businesses.api';
import { useCompleteOnboarding, useOnboardingStatus } from '@/api/businesses/businesses.queries';
import {
  onboardingBusinessSchema,
  onboardingCustomerSchema,
  onboardingDebtSchema,
} from '@/api/businesses/businesses.schema';
import { ApiError } from '@/api/errors';
import { RequireAuth } from '@/components/auth/require-auth';
import { FullPageLoader, InlineError } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { optionalText, parseAmount, validateForm } from '@/lib/form';
import { todayAsDateInput } from '@/lib/format';

type Step = 'business' | 'customer' | 'debt';

const STEPS: { id: Step; label: string; title: string; description: string }[] = [
  {
    id: 'business',
    label: 'Business',
    title: 'Tell us about your business.',
    description: 'This sets the currency every amount in CredFlow is reported in.',
  },
  {
    id: 'customer',
    label: 'Customer',
    title: 'Add your first customer.',
    description: 'Someone who owes you — or will, soon. You can skip this.',
  },
  {
    id: 'debt',
    label: 'Debt',
    title: 'Record your first debt.',
    description: 'The amount, and when they said they would pay.',
  },
];

export default function OnboardingPage() {
  // Onboarding is the one authenticated screen that must not redirect to
  // itself when the business profile is incomplete.
  return (
    <RequireAuth requireOnboarding={false}>
      <OnboardingFlow />
    </RequireAuth>
  );
}

function OnboardingFlow() {
  const router = useRouter();
  const { business } = useSession();
  const statusQuery = useOnboardingStatus();
  const completeOnboarding = useCompleteOnboarding();

  // Null until the user navigates: the effective step is then derived from
  // the server's progress, so a refresh resumes where they left off without an
  // effect writing state after the status query resolves.
  const [chosenStep, setChosenStep] = useState<Step | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [businessValues, setBusinessValues] = useState({
    industry: '',
    size: '',
    currency: business?.currency ?? 'NGN',
  });
  const [customerValues, setCustomerValues] = useState({ name: '', email: '', phone: '' });
  const [debtValues, setDebtValues] = useState({ amount: '', dueDate: '' });

  const status = statusQuery.data;
  const step: Step = chosenStep ?? (status?.currentStep || 'business');
  const setStep = setChosenStep;

  const alreadyComplete = status?.completed === true || business?.onboardingCompleted === true;

  useEffect(() => {
    if (alreadyComplete && !isFinished) router.replace('/dashboard');
  }, [alreadyComplete, isFinished, router]);

  const stepIndex = STEPS.findIndex((entry) => entry.id === step);
  const stepInfo = STEPS[stepIndex];

  const hasCustomer = customerValues.name.trim() !== '';

  const payload = useMemo<CompleteOnboardingInput | null>(() => {
    const businessResult = validateForm(onboardingBusinessSchema, businessValues);
    if (!businessResult.success) return null;

    const input: CompleteOnboardingInput = businessResult.data;
    if (!hasCustomer) return input;

    input.customer = {
      name: customerValues.name.trim(),
      email: optionalText(customerValues.email),
      phone: optionalText(customerValues.phone),
    };

    const amount = parseAmount(debtValues.amount);
    // A debt needs somebody to owe it — the API rejects one without a customer.
    if (amount !== undefined && debtValues.dueDate) {
      input.debt = { amount, dueDate: debtValues.dueDate };
    }
    return input;
  }, [businessValues, customerValues, debtValues, hasCustomer]);

  const goBack = () => {
    if (stepIndex > 0) setStep(STEPS[stepIndex - 1].id);
  };

  const submit = async () => {
    if (!payload) return;
    try {
      await completeOnboarding.mutateAsync(payload);
      setIsFinished(true);
    } catch (error) {
      // A second submit of an already-onboarded business is a 409, and the
      // right answer is simply to move on.
      if (error instanceof ApiError && error.isConflict) {
        setIsFinished(true);
      }
    }
  };

  const handleNext = async () => {
    if (step === 'business') {
      const result = validateForm(onboardingBusinessSchema, businessValues);
      setFieldErrors(result.errors ?? {});
      if (!result.success) return;
      setStep('customer');
      return;
    }

    if (step === 'customer') {
      if (!hasCustomer) {
        // Skipping the customer means there is nothing to owe a debt, so the
        // debt step is skipped with it.
        await submit();
        return;
      }
      const result = validateForm(onboardingCustomerSchema, customerValues);
      setFieldErrors(result.errors ?? {});
      if (!result.success) return;
      setStep('debt');
      return;
    }

    const amount = parseAmount(debtValues.amount);
    const hasDebtInput = debtValues.amount.trim() !== '' || debtValues.dueDate !== '';
    if (hasDebtInput) {
      const result = validateForm(onboardingDebtSchema, { amount, dueDate: debtValues.dueDate });
      setFieldErrors(result.errors ?? {});
      if (!result.success) return;
    }
    setFieldErrors({});
    await submit();
  };

  if (statusQuery.isPending && !status) {
    return <FullPageLoader label="Loading your setup…" />;
  }

  if (isFinished) {
    return <OnboardingComplete />;
  }

  const isLastStep = step === 'debt' || (step === 'customer' && !hasCustomer);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {STEPS.map((entry, index) => (
            <div
              key={entry.id}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                index === stepIndex ? 'w-8 bg-primary' : index < stepIndex ? 'w-1.5 bg-primary' : 'w-1.5 bg-border'
              }`}
            />
          ))}
        </motion.div>

        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
            Step {stepIndex + 1} of {STEPS.length} · {stepInfo.label}
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
                {stepInfo.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-3">{stepInfo.description}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-7 shadow-lg shadow-primary/5"
          >
            {step === 'business' && (
              <div className="space-y-4">
                <FormField label="Industry" htmlFor="industry" error={fieldErrors.industry}>
                  <Select
                    value={businessValues.industry}
                    onChange={(event) =>
                      setBusinessValues((previous) => ({ ...previous, industry: event.target.value }))
                    }
                    className="h-11 rounded-lg bg-background/80"
                  >
                    <option value="">Select your industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField label="Team size" htmlFor="size" error={fieldErrors.size}>
                  <Select
                    value={businessValues.size}
                    onChange={(event) =>
                      setBusinessValues((previous) => ({ ...previous, size: event.target.value }))
                    }
                    className="h-11 rounded-lg bg-background/80"
                  >
                    <option value="">How many people work with you?</option>
                    {BUSINESS_SIZES.map((size) => (
                      <option key={size} value={size}>
                        {size === '1' ? 'Just me' : size}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <FormField
                  label="Currency"
                  htmlFor="currency"
                  error={fieldErrors.currency}
                  hint="This locks once you record your first debt or payment."
                >
                  <Select
                    value={businessValues.currency}
                    onChange={(event) =>
                      setBusinessValues((previous) => ({ ...previous, currency: event.target.value }))
                    }
                    className="h-11 rounded-lg bg-background/80"
                  >
                    {SUPPORTED_CURRENCIES.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </Select>
                </FormField>
              </div>
            )}

            {step === 'customer' && (
              <div className="space-y-4">
                <FormField label="Customer name" htmlFor="customerName" error={fieldErrors.name}>
                  <Input
                    value={customerValues.name}
                    onChange={(event) =>
                      setCustomerValues((previous) => ({ ...previous, name: event.target.value }))
                    }
                    placeholder="e.g. Chinedu Okafor"
                    className="h-11 rounded-lg bg-background/80 border-border"
                  />
                </FormField>

                <FormField label="Email" htmlFor="customerEmail" error={fieldErrors.email}>
                  <Input
                    type="email"
                    value={customerValues.email}
                    onChange={(event) =>
                      setCustomerValues((previous) => ({ ...previous, email: event.target.value }))
                    }
                    placeholder="customer@example.com"
                    className="h-11 rounded-lg bg-background/80 border-border"
                  />
                </FormField>

                <FormField label="Phone" htmlFor="customerPhone" error={fieldErrors.phone}>
                  <Input
                    type="tel"
                    value={customerValues.phone}
                    onChange={(event) =>
                      setCustomerValues((previous) => ({ ...previous, phone: event.target.value }))
                    }
                    placeholder="+234 800 000 0000"
                    className="h-11 rounded-lg bg-background/80 border-border"
                  />
                </FormField>
              </div>
            )}

            {step === 'debt' && (
              <div className="space-y-4">
                <FormField
                  label={`Amount owed (${businessValues.currency})`}
                  htmlFor="debtAmount"
                  error={fieldErrors.amount}
                >
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={debtValues.amount}
                    onChange={(event) =>
                      setDebtValues((previous) => ({ ...previous, amount: event.target.value }))
                    }
                    placeholder="0.00"
                    className="h-11 rounded-lg bg-background/80 border-border"
                  />
                </FormField>

                <FormField label="Due date" htmlFor="debtDueDate" error={fieldErrors.dueDate}>
                  <Input
                    type="date"
                    min={todayAsDateInput()}
                    value={debtValues.dueDate}
                    onChange={(event) =>
                      setDebtValues((previous) => ({ ...previous, dueDate: event.target.value }))
                    }
                    className="h-11 rounded-lg bg-background/80 border-border"
                  />
                </FormField>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <InlineError
          error={completeOnboarding.error}
          fallback="We could not save your setup. Please try again."
          className="mt-4 text-center"
        />

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            onClick={goBack}
            disabled={stepIndex === 0 || completeOnboarding.isPending}
            variant="ghost"
            className="rounded-full h-11 px-4 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={completeOnboarding.isPending}
            className="rounded-full h-11 px-6 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {completeOnboarding.isPending
              ? 'Saving…'
              : isLastStep
                ? 'Finish setup'
                : 'Continue'}
            {!completeOnboarding.isPending && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>

        {step === 'debt' && (
          <div className="text-center mt-6">
            <button
              type="button"
              onClick={() => {
                setDebtValues({ amount: '', dueDate: '' });
                void submit();
              }}
              disabled={completeOnboarding.isPending}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
            >
              Skip the first debt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function OnboardingComplete() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mx-auto w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6"
        >
          <Check className="w-6 h-6 text-primary" strokeWidth={2.5} />
        </motion.div>

        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-3.5 py-1.5 rounded-full mb-6">
          <span className="text-xs font-medium text-primary tracking-wide">You&apos;re all set</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
          Welcome to CredFlow.
        </h1>
        <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
          Your business is ready. Start tracking debts, recording payments, and watching your cash
          flow come alive.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            asChild
            className="rounded-full px-6 h-11 text-sm shadow-lg shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Link href="/dashboard">
              Go to dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="rounded-full px-6 h-11 text-sm bg-background/60 backdrop-blur-xs"
          >
            <Link href="/customers">Add another customer</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
