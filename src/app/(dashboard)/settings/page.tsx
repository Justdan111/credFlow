'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Bell, Shield, Palette, Check } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      {/* Header */}
      <div>
        <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
          Settings
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
          Preferences
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, notifications, and workspace preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
        {/* Left rail */}
        <aside className="space-y-1">
          {tabs.map((tab) => {
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

        {/* Panel */}
        <div>
          {activeTab === 'profile' && <ProfilePanel />}
          {activeTab === 'notifications' && <NotificationsPanel />}
          {activeTab === 'security' && <SecurityPanel />}
          {activeTab === 'appearance' && <AppearancePanel />}
        </div>
      </div>
    </motion.div>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
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

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ProfilePanel() {
  return (
    <div className="space-y-5">
      <Section title="Profile" description="Your account and business identity.">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-base font-semibold">
            AB
          </div>
          <div>
            <p className="text-sm font-medium">Amina Bello</p>
            <p className="text-xs text-muted-foreground">amina@bellotraders.ng</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto rounded-full text-xs h-8">
            Change photo
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Full name">
            <Input defaultValue="Amina Bello" className="h-10 rounded-lg" />
          </Field>
          <Field label="Email">
            <Input type="email" defaultValue="amina@bellotraders.ng" className="h-10 rounded-lg" />
          </Field>
          <Field label="Phone">
            <Input defaultValue="+234 801 234 5678" className="h-10 rounded-lg" />
          </Field>
          <Field label="Business name">
            <Input defaultValue="Bello Traders Ltd" className="h-10 rounded-lg" />
          </Field>
        </div>

        <div className="mt-6 flex justify-end">
          <Button size="sm" className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10">
            Save changes
          </Button>
        </div>
      </Section>

      <Section title="Plan" description="Your current subscription.">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30">
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Growth</p>
              <span className="text-[10px] font-medium uppercase tracking-widest bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                Active
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ₦9,900 / month · Renews Mar 15, 2026
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
            Manage
          </Button>
        </div>
      </Section>
    </div>
  );
}

function NotificationsPanel() {
  const emailPrefs = [
    { label: 'Overdue debts', hint: 'Get notified when a debt becomes overdue.' },
    { label: 'Payment received', hint: 'Confirmation each time a payment lands.' },
    { label: 'Weekly summary', hint: 'A digest of your week every Monday morning.' },
    { label: 'New customer added', hint: 'When someone joins your customer list.' },
  ];
  const inAppPrefs = [
    { label: 'Reminder due today', hint: 'A nudge when a follow-up is due.' },
    { label: 'Risk alerts', hint: 'When a customer moves to high risk.' },
    { label: 'Report ready', hint: 'When an export or report is ready to download.' },
  ];

  return (
    <div className="space-y-5">
      <Section title="Email notifications" description="What lands in your inbox.">
        <div className="space-y-1">
          {emailPrefs.map((p, i) => (
            <Toggle key={p.label} label={p.label} hint={p.hint} defaultOn={i < 3} />
          ))}
        </div>
      </Section>
      <Section title="In-app notifications" description="What you see inside CredFlow.">
        <div className="space-y-1">
          {inAppPrefs.map((p) => (
            <Toggle key={p.label} label={p.label} hint={p.hint} defaultOn />
          ))}
        </div>
      </Section>
    </div>
  );
}

function SecurityPanel() {
  return (
    <div className="space-y-5">
      <Section title="Password" description="Change your account password.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Current password">
            <Input type="password" className="h-10 rounded-lg" />
          </Field>
          <div />
          <Field label="New password">
            <Input type="password" className="h-10 rounded-lg" />
          </Field>
          <Field label="Confirm password">
            <Input type="password" className="h-10 rounded-lg" />
          </Field>
        </div>
        <div className="mt-6 flex justify-end">
          <Button size="sm" className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10">
            Update password
          </Button>
        </div>
      </Section>

      <Section title="Two-factor authentication" description="Add a layer of security.">
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div>
            <p className="text-sm font-medium">Not enabled</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              We&apos;ll ask for a code from an authenticator app when signing in.
            </p>
          </div>
          <Button variant="outline" size="sm" className="rounded-full text-xs h-8">
            Enable 2FA
          </Button>
        </div>
      </Section>

      <Section title="Active sessions" description="Devices signed in to your account.">
        <div className="space-y-2">
          {[
            { device: 'Chrome on macOS', location: 'Lagos, NG', when: 'Active now', current: true },
            { device: 'Safari on iPhone', location: 'Lagos, NG', when: '1 hour ago', current: false },
          ].map((s) => (
            <div
              key={s.device}
              className="flex items-center justify-between p-4 rounded-lg border border-border"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium">{s.device}</p>
                  {s.current && (
                    <span className="text-[10px] font-medium uppercase tracking-widest bg-success/10 text-success px-1.5 py-0.5 rounded">
                      This device
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {s.location} · {s.when}
                </p>
              </div>
              {!s.current && (
                <button className="text-xs text-destructive hover:underline underline-offset-4">
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

function AppearancePanel() {
  const [theme, setTheme] = useState('system');
  const options = [
    { id: 'light', label: 'Light', preview: 'bg-white' },
    { id: 'dark', label: 'Dark', preview: 'bg-neutral-900' },
    { id: 'system', label: 'System', preview: 'bg-linear-to-br from-white to-neutral-900' },
  ];

  return (
    <div className="space-y-5">
      <Section title="Theme" description="Pick how CredFlow looks.">
        <div className="grid grid-cols-3 gap-3">
          {options.map((o) => {
            const isActive = theme === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setTheme(o.id)}
                className={`group relative rounded-xl border p-3 transition-all ${
                  isActive
                    ? 'border-primary shadow-sm shadow-primary/10'
                    : 'border-border hover:border-foreground/20'
                }`}
              >
                <div className={`w-full h-16 rounded-lg mb-2 border border-border ${o.preview}`} />
                <p className="text-xs font-medium text-left">{o.label}</p>
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

      <Section title="Display" description="Fine-tune the workspace.">
        <div className="space-y-1">
          <Toggle label="Compact sidebar" hint="Reduce sidebar width to icons only." defaultOn={false} />
          <Toggle label="Motion & animations" hint="Show subtle animations on interactions." defaultOn />
          <Toggle label="Reduce contrast" hint="Softer colors for extended sessions." defaultOn={false} />
        </div>
      </Section>
    </div>
  );
}

function Toggle({
  label,
  hint,
  defaultOn = false,
}: {
  label: string;
  hint: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-b-0 cursor-pointer">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>
      </div>
      <button
        type="button"
        onClick={() => setOn(!on)}
        className={`shrink-0 relative w-9 h-5 rounded-full transition-colors ${
          on ? 'bg-primary' : 'bg-muted-foreground/30'
        }`}
        aria-pressed={on}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
            on ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </label>
  );
}
