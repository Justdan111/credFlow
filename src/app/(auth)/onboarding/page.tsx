'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Step = 'business' | 'customer' | 'debt' | 'complete';

const STEPS: { id: Step; label: string; title: string; description: string }[] = [
  {
    id: 'business',
    label: 'Business',
    title: 'Tell us about your business.',
    description: 'A few details help us tailor CredFlow to you.',
  },
  {
    id: 'customer',
    label: 'Customer',
    title: 'Add your first customer.',
    description: 'Someone who owes you — or will, soon.',
  },
  {
    id: 'debt',
    label: 'Debt',
    title: 'Record your first debt.',
    description: 'The amount, and when they said they&apos;d pay.',
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<Step>('business');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    industry: '',
    businessSize: '',
    customerName: '',
    customerEmail: '',
    debtAmount: '',
    dueDate: '',
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);
  const currentStepInfo = STEPS[currentStepIndex];

  const handleNext = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const steps: Step[] = ['business', 'customer', 'debt', 'complete'];
      const nextIndex = steps.indexOf(currentStep) + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex] as Step);
      }
    }, 400);
  };

  const handlePrev = () => {
    const steps: Step[] = ['business', 'customer', 'debt', 'complete'];
    const prevIndex = steps.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex] as Step);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (currentStep === 'complete') {
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
            <span className="text-xs font-medium text-primary tracking-wide">
              You&apos;re all set
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
            Welcome to CredFlow.
          </h1>
          <p className="text-sm text-muted-foreground mt-3 max-w-sm mx-auto">
            Your business is ready. Start tracking debts, recording payments, and
            watching your cash flow come alive.
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-24 sm:py-32">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-center gap-2 mb-8"
        >
          {STEPS.map((step, i) => (
            <div key={step.id} className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    i < currentStepIndex
                      ? 'w-1.5 bg-primary'
                      : i === currentStepIndex
                      ? 'w-8 bg-primary'
                      : 'w-1.5 bg-border'
                  }`}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Step label */}
        <div className="text-center mb-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium mb-3">
            Step {currentStepIndex + 1} of 3 · {currentStepInfo.label}
          </p>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl sm:text-4xl font-semibold leading-[1.05] tracking-[-0.02em]">
                {currentStepInfo.title}
              </h1>
              <p className="text-sm text-muted-foreground mt-3">
                {currentStepInfo.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Form panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35 }}
            className="rounded-2xl border border-border bg-card/80 backdrop-blur-sm p-6 sm:p-7 shadow-lg shadow-primary/5"
          >
            {currentStep === 'business' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Industry
                  </Label>
                  <select
                    value={formData.industry}
                    onChange={(e) => handleInputChange('industry', e.target.value)}
                    className="w-full h-11 rounded-lg border border-border bg-background/80 backdrop-blur-xs px-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">Select your industry</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="agriculture">Agriculture</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Team size
                  </Label>
                  <select
                    value={formData.businessSize}
                    onChange={(e) =>
                      handleInputChange('businessSize', e.target.value)
                    }
                    className="w-full h-11 rounded-lg border border-border bg-background/80 backdrop-blur-xs px-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
                  >
                    <option value="">How many people work with you?</option>
                    <option value="1">Just me</option>
                    <option value="2-10">2–10</option>
                    <option value="11-50">11–50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 'customer' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Customer name
                  </Label>
                  <Input
                    value={formData.customerName}
                    onChange={(e) =>
                      handleInputChange('customerName', e.target.value)
                    }
                    placeholder="e.g. Chinedu Okafor"
                    className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Phone or email
                  </Label>
                  <Input
                    value={formData.customerEmail}
                    onChange={(e) =>
                      handleInputChange('customerEmail', e.target.value)
                    }
                    placeholder="+234 800 000 0000"
                    className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
                  />
                </div>
              </div>
            )}

            {currentStep === 'debt' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Amount owed
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                      ₦
                    </span>
                    <Input
                      type="number"
                      value={formData.debtAmount}
                      onChange={(e) =>
                        handleInputChange('debtAmount', e.target.value)
                      }
                      placeholder="0.00"
                      className="pl-8 h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">
                    Due date
                  </Label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    className="h-11 rounded-lg bg-background/80 backdrop-blur-xs border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            onClick={handlePrev}
            disabled={currentStep === 'business'}
            variant="ghost"
            className="rounded-full h-11 px-4 text-sm text-muted-foreground disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={isLoading}
            className="rounded-full h-11 px-6 text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all ring-1 ring-inset ring-white/10"
          >
            {isLoading
              ? 'Just a moment…'
              : currentStep === 'debt'
              ? 'Finish setup'
              : 'Continue'}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>

        {/* Skip */}
        <div className="text-center mt-6">
          <Link
            href="/dashboard"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
