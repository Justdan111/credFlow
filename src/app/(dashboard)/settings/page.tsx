'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Building2, Check, History, Palette, Shield, User, Users } from 'lucide-react';

import type { User as SessionUser } from '@/api/auth/auth.api';
import {
  useChangePassword,
  useRevokeSession,
  useSessions,
  useUpdatedProfile,
  useUpdateProfile,
} from '@/api/auth/auth.queries';
import {
  changePasswordSchema,
  profileSchema,
  type ChangePasswordValues,
  type ProfileValues,
} from '@/api/auth/auth.schema';
import {
  BUSINESS_SIZES,
  INDUSTRIES,
  SUPPORTED_CURRENCIES,
  type Business,
} from '@/api/businesses/businesses.api';
import { useCurrentBusiness, useUpdateBusiness } from '@/api/businesses/businesses.queries';
import {
  businessProfileSchema,
  type BusinessProfileValues,
} from '@/api/businesses/businesses.schema';
import { ActivityPanel } from '@/components/domain/activity-panel';
import { TeamPanel } from '@/components/domain/team-panel';
import { ErrorState, InlineError, InlineSuccess, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useIsMounted } from '@/hooks/use-is-mounted';
import { parseAmount, validateForm, type FieldErrors } from '@/lib/form';
import { formatDateTime } from '@/lib/format';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'business', label: 'Business', icon: Building2 },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'activity', label: 'Activity', icon: History },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('profile');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
          Settings
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">Preferences</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, your business, and how CredFlow looks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        <aside className="space-y-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" strokeWidth={isActive ? 2 : 1.75} />
                {tab.label}
              </button>
            );
          })}
        </aside>

        <div>
          {activeTab === 'profile' && <ProfilePanel />}
          {activeTab === 'business' && <BusinessPanel />}
          {activeTab === 'team' && <TeamPanel />}
          {activeTab === 'activity' && <ActivityPanel />}
          {activeTab === 'security' && <SecurityPanel />}
          {activeTab === 'appearance' && <AppearancePanel />}
        </div>
      </div>
    </motion.div>
  );
}

function ProfilePanel() {
  const { user, business } = useSession();

  // The form is mounted only once the user has arrived, so its initial state
  // is the real record rather than blanks patched up afterwards.
  if (!user) return <LoadingState label="Loading your profile…" />;

  return (
    <div className="space-y-5">
      <ProfileForm user={user} />

      {business && (
        <Section title="Workspace" description="The business this account belongs to.">
          <div className="p-4 rounded-lg border border-border bg-muted/30">
            <p className="text-sm font-medium">{business.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {business.industry ?? 'Industry not set'} · {business.currency}
            </p>
          </div>
        </Section>
      )}
    </div>
  );
}

function ProfileForm({ user }: { user: SessionUser }) {
  const updateProfile = useUpdateProfile();
  // `GET /auth/me` does not return the phone number; the only place it appears
  // is the response to an update, which is cached under its own key.
  const updatedProfile = useUpdatedProfile();

  const [values, setValues] = useState(() => ({
    name: user.name,
    phone: updatedProfile.data?.phone ?? '',
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ProfileValues>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavedMessage(null);

    const result = validateForm(profileSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      // `phone` is omitted while blank. The field cannot show a stored number,
      // so sending an empty string would silently clear one the user never saw.
      await updateProfile.mutateAsync({
        name: result.data.name,
        ...(result.data.phone ? { phone: result.data.phone } : {}),
      });
      setSavedMessage('Profile updated.');
    } catch {
      // Rendered below from the mutation's error state.
    }
  };

  return (
    <Section title="Profile" description="Your account details.">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Full name" htmlFor="profile-name" error={fieldErrors.name}>
            <Input
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              className="h-10 rounded-lg"
            />
          </FormField>

          <FormField
            label="Phone"
            htmlFor="profile-phone"
            error={fieldErrors.phone}
            hint="Entering a number replaces the one on file"
          >
            <Input
              type="tel"
              value={values.phone}
              onChange={(event) => setValues({ ...values, phone: event.target.value })}
              className="h-10 rounded-lg"
            />
          </FormField>

          {/* Changing a sign-in identifier needs its own verification flow, so
              the API deliberately does not accept it here. */}
          <FormField
            label="Email"
            htmlFor="profile-email"
            hint="Contact support to change your sign-in email"
          >
            <Input value={user.email} disabled className="h-10 rounded-lg" />
          </FormField>

          <FormField label="Role" htmlFor="profile-role">
            <Input value={user.role} disabled className="h-10 rounded-lg capitalize" />
          </FormField>
        </div>

        <FormActions
          isSubmitting={updateProfile.isPending}
          error={updateProfile.error}
          errorFallback="We could not save your profile."
          savedMessage={savedMessage}
          label="Save changes"
        />
      </form>
    </Section>
  );
}

function BusinessPanel() {
  const { canAdminister } = useSession();
  // The session carries a trimmed business view; the settings form needs the
  // full profile, including the collection target and the currency lock.
  const businessQuery = useCurrentBusiness();

  if (businessQuery.isPending) return <LoadingState label="Loading your business…" />;
  if (businessQuery.isError || !businessQuery.data) {
    return (
      <ErrorState
        error={businessQuery.error}
        fallback="We could not load your business profile."
        onRetry={() => businessQuery.refetch()}
      />
    );
  }

  return <BusinessForm business={businessQuery.data} canAdminister={canAdminister} />;
}

function BusinessForm({
  business,
  canAdminister,
}: {
  business: Business;
  canAdminister: boolean;
}) {
  const updateBusiness = useUpdateBusiness();

  const [values, setValues] = useState(() => ({
    name: business.name,
    industry: business.industry ?? '',
    size: business.size ?? '',
    currency: business.currency,
    monthlyCollectionTarget:
      business.monthlyCollectionTarget === null ? '' : String(business.monthlyCollectionTarget),
  }));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<BusinessProfileValues>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavedMessage(null);

    // A blank target field means "no target", which the API expresses as an
    // explicit null rather than an omitted key. NaN keeps a non-numeric entry
    // in the validation path instead of silently clearing the target.
    const target =
      values.monthlyCollectionTarget.trim() === ''
        ? null
        : (parseAmount(values.monthlyCollectionTarget) ?? Number.NaN);

    const result = validateForm(businessProfileSchema, {
      ...values,
      monthlyCollectionTarget: target,
    });
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await updateBusiness.mutateAsync(result.data);
      setSavedMessage('Business profile updated.');
    } catch {
      // Rendered below — a currency change after the lock comes back as a 409.
    }
  };

  return (
    <Section title="Business profile" description="Shown across reports and exports.">
      {!canAdminister && (
        <p className="mb-4 text-xs text-muted-foreground rounded-lg border border-border bg-muted/30 p-3">
          Only an owner or admin can change these details.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <fieldset disabled={!canAdminister} className="space-y-4 disabled:opacity-60">
          <FormField label="Business name" htmlFor="business-name" error={fieldErrors.name}>
            <Input
              value={values.name}
              onChange={(event) => setValues({ ...values, name: event.target.value })}
              className="h-10 rounded-lg"
            />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Industry" htmlFor="business-industry" error={fieldErrors.industry}>
              <Select
                value={values.industry}
                onChange={(event) => setValues({ ...values, industry: event.target.value })}
                className="h-10 rounded-lg"
              >
                <option value="">Select an industry</option>
                {INDUSTRIES.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField label="Team size" htmlFor="business-size" error={fieldErrors.size}>
              <Select
                value={values.size}
                onChange={(event) => setValues({ ...values, size: event.target.value })}
                className="h-10 rounded-lg"
              >
                <option value="">Select a size</option>
                {BUSINESS_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size === '1' ? 'Just me' : size}
                  </option>
                ))}
              </Select>
            </FormField>

            {/* The selector disables itself once financial records exist: the
                API answers 409, and changing the currency converts nothing, so
                every stored amount would silently be reinterpreted. */}
            <FormField
              label="Currency"
              htmlFor="business-currency"
              error={fieldErrors.currency}
              hint={
                business.currencyLocked ? 'Locked — debts or payments already exist' : undefined
              }
            >
              <Select
                value={values.currency}
                disabled={business.currencyLocked}
                onChange={(event) => setValues({ ...values, currency: event.target.value })}
                className="h-10 rounded-lg"
              >
                {SUPPORTED_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label={`Monthly collection target (${values.currency})`}
              htmlFor="business-target"
              error={fieldErrors.monthlyCollectionTarget}
              hint="Leave blank for no target"
            >
              <Input
                type="number"
                min="0"
                step="0.01"
                value={values.monthlyCollectionTarget}
                onChange={(event) =>
                  setValues({ ...values, monthlyCollectionTarget: event.target.value })
                }
                className="h-10 rounded-lg"
              />
            </FormField>
          </div>
        </fieldset>

        {canAdminister && (
          <FormActions
            isSubmitting={updateBusiness.isPending}
            error={updateBusiness.error}
            errorFallback="We could not save your business profile."
            savedMessage={savedMessage}
            label="Save changes"
          />
        )}
      </form>
    </Section>
  );
}

function SecurityPanel() {
  const changePassword = useChangePassword();
  const sessionsQuery = useSessions();
  const revokeSession = useRevokeSession();

  const [values, setValues] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<ChangePasswordValues>>({});
  const [savedMessage, setSavedMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavedMessage(null);

    const result = validateForm(changePasswordSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await changePassword.mutateAsync({
        currentPassword: result.data.currentPassword,
        newPassword: result.data.newPassword,
      });
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSavedMessage('Password updated. Every other session was signed out.');
    } catch {
      // Rendered below from the mutation's error state.
    }
  };

  return (
    <div className="space-y-5">
      <Section title="Password" description="Changing it signs out every other device.">
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              label="Current password"
              htmlFor="current-password"
              error={fieldErrors.currentPassword}
              className="sm:col-span-2"
            >
              <Input
                type="password"
                autoComplete="current-password"
                value={values.currentPassword}
                onChange={(event) => setValues({ ...values, currentPassword: event.target.value })}
                className="h-10 rounded-lg"
              />
            </FormField>

            <FormField label="New password" htmlFor="new-password" error={fieldErrors.newPassword}>
              <Input
                type="password"
                autoComplete="new-password"
                value={values.newPassword}
                onChange={(event) => setValues({ ...values, newPassword: event.target.value })}
                className="h-10 rounded-lg"
              />
            </FormField>

            <FormField
              label="Confirm password"
              htmlFor="confirm-new-password"
              error={fieldErrors.confirmPassword}
            >
              <Input
                type="password"
                autoComplete="new-password"
                value={values.confirmPassword}
                onChange={(event) => setValues({ ...values, confirmPassword: event.target.value })}
                className="h-10 rounded-lg"
              />
            </FormField>
          </div>

          <FormActions
            isSubmitting={changePassword.isPending}
            error={changePassword.error}
            errorFallback="We could not update your password."
            savedMessage={savedMessage}
            label="Update password"
          />
        </form>
      </Section>

      <Section title="Active sessions" description="Devices currently signed in to your account.">
        {sessionsQuery.isPending ? (
          <LoadingState label="Loading sessions…" />
        ) : sessionsQuery.isError ? (
          <ErrorState
            error={sessionsQuery.error}
            fallback="We could not load your sessions."
            onRetry={() => sessionsQuery.refetch()}
          />
        ) : (
          <div className="space-y-2">
            {(sessionsQuery.data ?? []).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {session.userAgent || 'Unknown device'}
                    </p>
                    {session.current && (
                      <span className="text-[10px] font-medium uppercase tracking-widest bg-success/10 text-success px-1.5 py-0.5 rounded shrink-0">
                        This device
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Last active {formatDateTime(session.lastActiveAt)}
                  </p>
                </div>
                {!session.current && (
                  <button
                    type="button"
                    onClick={() => revokeSession.mutate(session.id)}
                    disabled={revokeSession.isPending}
                    className="text-xs text-destructive hover:underline underline-offset-4 shrink-0 disabled:opacity-50"
                  >
                    Sign out
                  </button>
                )}
              </div>
            ))}
            <InlineError
              error={revokeSession.error}
              fallback="We could not revoke that session."
              className="text-xs"
            />
          </div>
        )}
      </Section>
    </div>
  );
}

const THEME_OPTIONS = [
  { id: 'light', label: 'Light', preview: 'bg-white' },
  { id: 'dark', label: 'Dark', preview: 'bg-neutral-900' },
  { id: 'system', label: 'System', preview: 'bg-linear-to-br from-white to-neutral-900' },
];

function AppearancePanel() {
  const { theme, setTheme } = useTheme();
  // The resolved theme is browser-only state, so the selection is rendered
  // after hydration to avoid a server/client mismatch.
  const isMounted = useIsMounted();

  return (
    <div className="space-y-5">
      <Section title="Theme" description="Pick how CredFlow looks on this device.">
        <div className="grid grid-cols-3 gap-3">
          {THEME_OPTIONS.map((option) => {
            const isActive = isMounted && theme === option.id;
            return (
              <button
                key={option.id}
                onClick={() => setTheme(option.id)}
                className={`group relative rounded-xl border p-3 transition-all ${
                  isActive
                    ? 'border-primary shadow-sm shadow-primary/10'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div
                  className={`w-full h-16 rounded-lg mb-2 border border-border ${option.preview}`}
                />
                <p className="text-xs font-medium text-left">{option.label}</p>
                {isActive && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

/** Save button plus the one place a panel reports success or failure. */
function FormActions({
  isSubmitting,
  error,
  errorFallback,
  savedMessage,
  label,
}: {
  isSubmitting: boolean;
  error: unknown;
  errorFallback: string;
  savedMessage: string | null;
  label: string;
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-4">
      <div>
        <InlineError error={error} fallback={errorFallback} className="text-xs" />
        <InlineSuccess message={savedMessage} className="text-xs" />
      </div>
      <Button
        type="submit"
        size="sm"
        disabled={isSubmitting}
        className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10"
      >
        {isSubmitting ? 'Saving…' : label}
      </Button>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
      <div className="mb-6">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}
