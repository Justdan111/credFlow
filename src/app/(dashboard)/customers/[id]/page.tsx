'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  Edit2,
  Mail,
  MapPin,
  Phone,
  Plus,
  StickyNote,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const customerProfiles = {
  '1': {
    name: 'ABC Stores Ltd',
    initials: 'AS',
    industry: 'Retail',
    contactName: 'Amina Bello',
    phone: '08012345678',
    email: 'info@abc.com',
    address: '12 Marina Road, Lagos',
    riskLevel: 'Medium',
    creditLimit: '₦500,000',
    outstanding: '₦250,000',
    paidToDate: '₦780,000',
    lastPayment: 'Feb 10, 2026',
    nextFollowUp: 'Feb 18, 2026',
    collectionRate: '82%',
    note: 'Reliable buyer with seasonal purchasing spikes during holiday periods.',
  },
  '2': {
    name: 'XYZ Retail',
    initials: 'XR',
    industry: 'Wholesale',
    contactName: 'Daniel Okafor',
    phone: '08098765432',
    email: 'contact@xyz.com',
    address: '44 Allen Avenue, Ikeja',
    riskLevel: 'Low',
    creditLimit: '₦350,000',
    outstanding: '₦180,000',
    paidToDate: '₦1.1M',
    lastPayment: 'Feb 8, 2026',
    nextFollowUp: 'Feb 20, 2026',
    collectionRate: '91%',
    note: 'Healthy payment discipline and strong order repeat rate.',
  },
  '3': {
    name: 'Tech Solutions',
    initials: 'TS',
    industry: 'Technology',
    contactName: 'Oluwaseun Adeyemi',
    phone: '09012345678',
    email: 'hello@techsol.com',
    address: '21 Admiralty Way, Lekki',
    riskLevel: 'High',
    creditLimit: '₦750,000',
    outstanding: '₦320,000',
    paidToDate: '₦540,000',
    lastPayment: 'Jan 25, 2026',
    nextFollowUp: 'Feb 14, 2026',
    collectionRate: '64%',
    note: 'Requires tighter follow-up and installment-based collection plan.',
  },
  '4': {
    name: 'Fashion Hub',
    initials: 'FH',
    industry: 'Fashion',
    contactName: 'Grace Nwosu',
    phone: '07098765432',
    email: 'shop@fashion.com',
    address: '9 Broad Street, Lagos',
    riskLevel: 'Low',
    creditLimit: '₦300,000',
    outstanding: '₦150,000',
    paidToDate: '₦620,000',
    lastPayment: 'Feb 5, 2026',
    nextFollowUp: 'Feb 21, 2026',
    collectionRate: '88%',
    note: 'Consistent collections record with fast-moving inventory cycles.',
  },
  '5': {
    name: 'Food & Drinks Co',
    initials: 'FD',
    industry: 'Food Service',
    contactName: 'Tunde Afolayan',
    phone: '08187654321',
    email: 'sales@food.com',
    address: '18 Ikorodu Road, Yaba',
    riskLevel: 'Medium',
    creditLimit: '₦650,000',
    outstanding: '₦420,000',
    paidToDate: '₦1.4M',
    lastPayment: 'Jan 28, 2026',
    nextFollowUp: 'Feb 17, 2026',
    collectionRate: '76%',
    note: 'Large order sizes but requires structured reminder cadence.',
  },
  '6': {
    name: 'Auto Parts Store',
    initials: 'AP',
    industry: 'Automotive',
    contactName: 'Ibrahim Yusuf',
    phone: '09187654321',
    email: 'admin@autoparts.com',
    address: '7 Nnamdi Azikiwe Avenue, Enugu',
    riskLevel: 'Low',
    creditLimit: '₦400,000',
    outstanding: '₦280,000',
    paidToDate: '₦890,000',
    lastPayment: 'Feb 12, 2026',
    nextFollowUp: 'Feb 22, 2026',
    collectionRate: '89%',
    note: 'Stable account with predictable monthly repayment behavior.',
  },
} as const;

const customerDebts = [
  { id: 1, amount: '₦150,000', dueDate: 'Feb 15, 2026', status: 'Overdue' },
  { id: 2, amount: '₦100,000', dueDate: 'Mar 1, 2026', status: 'Pending' },
  { id: 3, amount: '₦50,000', dueDate: 'Jan 30, 2026', status: 'Paid' },
];

const customerPayments = [
  { id: 1, amount: '₦50,000', date: 'Feb 10, 2026', method: 'Bank Transfer', reference: 'TRF001' },
  { id: 2, amount: '₦45,000', date: 'Jan 24, 2026', method: 'Cash', reference: 'CASH014' },
  { id: 3, amount: '₦65,000', date: 'Jan 8, 2026', method: 'Paystack', reference: 'PS022' },
];

const activity = [
  { time: 'Today', title: 'Follow-up reminder scheduled', detail: 'Automated SMS will go out at 4:00 PM.' },
  { time: '2 days ago', title: 'Payment received', detail: '₦50,000 posted against the oldest open debt.' },
  { time: 'Last week', title: 'Credit note added', detail: 'Account reviewed and limit kept at ₦500,000.' },
];

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const customerId = params.id ?? '1';
  const customer = customerProfiles[customerId as keyof typeof customerProfiles] ?? customerProfiles['1'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Back + header */}
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to customers
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/15 text-primary flex items-center justify-center text-lg font-semibold">
              {customer.initials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  Customer
                </p>
                <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                  {customer.industry}
                </span>
                <RiskPill level={customer.riskLevel} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
                {customer.name}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Primary contact · {customer.contactName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <Bell className="w-3.5 h-3.5" />
              Send reminder
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <StickyNote className="w-3.5 h-3.5" />
              Add note
            </Button>
            <Button size="sm" className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10 shadow-sm shadow-primary/20">
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Outstanding" value={customer.outstanding} hint="Across all debts" />
        <KPI label="Collection rate" value={customer.collectionRate} hint="Last 6 months" />
        <KPI label="Credit limit" value={customer.creditLimit} hint="Approved cap" />
        <KPI label="Last payment" value={customer.lastPayment} hint={`Next follow-up · ${customer.nextFollowUp}`} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* About */}
          <Section title="About" description={customer.note}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ContactRow icon={Phone} label="Phone" value={customer.phone} />
              <ContactRow icon={Mail} label="Email" value={customer.email} />
              <ContactRow icon={MapPin} label="Address" value={customer.address} />
            </div>
          </Section>

          {/* Debts */}
          <Section
            title="Open debts"
            action={
              <Link href="/debts" className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1">
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="divide-y divide-border">
              {customerDebts.map((d) => (
                <div key={d.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">#{d.id}</span>
                    <div>
                      <p className="text-sm font-medium">{d.amount}</p>
                      <p className="text-xs text-muted-foreground">Due {d.dueDate}</p>
                    </div>
                  </div>
                  <StatusPill status={d.status} />
                </div>
              ))}
            </div>
          </Section>

          {/* Payments */}
          <Section
            title="Recent payments"
            action={
              <Link href="/payments" className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1">
                View all
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            }
          >
            <div className="divide-y divide-border">
              {customerPayments.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-success">+{p.amount}</p>
                    <p className="text-xs text-muted-foreground">
                      {p.date} · {p.method}
                    </p>
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{p.reference}</span>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Profile snapshot */}
          <Section title="Snapshot">
            <div className="space-y-2.5 text-sm">
              <MetaRow label="Customer ID" value={`CUST-${customerId.padStart(3, '0')}`} mono />
              <MetaRow label="Paid to date" value={customer.paidToDate} />
              <MetaRow label="Next follow-up" value={customer.nextFollowUp} />
              <MetaRow label="Segment" value="Mid-market" />
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Activity">
            <div className="space-y-4">
              {activity.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < activity.length - 1 && <div className="flex-1 w-px bg-border mt-1" />}
                  </div>
                  <div className="pb-1 flex-1">
                    <p className="text-sm font-medium">{entry.title}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-0.5">
                      {entry.time}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{entry.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Quick actions */}
          <Section title="Quick actions">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <Plus className="w-3.5 h-3.5" />
                Record payment
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <Bell className="w-3.5 h-3.5" />
                Create reminder
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <StickyNote className="w-3.5 h-3.5" />
                Add note
              </Button>
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
  );
}

function KPI({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
        {label}
      </p>
      <p className="text-2xl font-semibold tracking-tight mt-2">{value}</p>
      <p className="text-[11px] text-muted-foreground mt-1.5">{hint}</p>
    </div>
  );
}

function Section({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
        <Icon className="w-3 h-3" strokeWidth={2} />
        {label}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
}

function MetaRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={`text-xs font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}

function RiskPill({ level }: { level: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    Low: { bg: 'bg-success/10 text-success', dot: 'bg-success' },
    Medium: { bg: 'bg-warning/15 text-warning', dot: 'bg-warning' },
    High: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  };
  const s = map[level] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {level} risk
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    Paid: { bg: 'bg-success/10 text-success', dot: 'bg-success' },
    Overdue: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
    Pending: { bg: 'bg-warning/15 text-warning', dot: 'bg-warning' },
  };
  const s = map[status] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
