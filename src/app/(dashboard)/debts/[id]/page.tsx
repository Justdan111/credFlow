'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Bell,
  CalendarClock,
  CheckCircle2,
  Mail,
  Phone,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const debtProfiles = {
  '1': {
    customer: 'ABC Stores Ltd',
    customerId: '1',
    amount: '₦250,000',
    principal: '₦240,000',
    interest: '₦10,000',
    startDate: 'Dec 1, 2025',
    dueDate: 'Feb 15, 2026',
    status: 'Overdue',
    owner: 'Amina Bello',
    phone: '08012345678',
    email: 'info@abc.com',
    risk: 'Medium',
    daysOpen: 75,
    stage: 'Final reminder',
    note: 'Split payment plan approved after delayed January order delivery.',
  },
  '2': {
    customer: 'XYZ Retail',
    customerId: '2',
    amount: '₦180,000',
    principal: '₦177,900',
    interest: '₦2,100',
    startDate: 'Jan 5, 2026',
    dueDate: 'Feb 20, 2026',
    status: 'Overdue',
    owner: 'Daniel Okafor',
    phone: '08098765432',
    email: 'contact@xyz.com',
    risk: 'Low',
    daysOpen: 40,
    stage: 'Reminder queued',
    note: 'Good history, currently overdue by a small margin.',
  },
  '3': {
    customer: 'Tech Solutions',
    customerId: '3',
    amount: '₦320,000',
    principal: '₦318,200',
    interest: '₦1,800',
    startDate: 'Jan 20, 2026',
    dueDate: 'Mar 10, 2026',
    status: 'Pending',
    owner: 'Oluwaseun Adeyemi',
    phone: '09012345678',
    email: 'hello@techsol.com',
    risk: 'High',
    daysOpen: 25,
    stage: 'Awaiting due date',
    note: 'Needs close monitoring because of the larger credit exposure.',
  },
  '4': {
    customer: 'Fashion Hub',
    customerId: '4',
    amount: '₦150,000',
    principal: '₦150,000',
    interest: '₦0',
    startDate: 'Nov 15, 2025',
    dueDate: 'Feb 10, 2026',
    status: 'Paid',
    owner: 'Grace Nwosu',
    phone: '07098765432',
    email: 'shop@fashion.com',
    risk: 'Low',
    daysOpen: 87,
    stage: 'Closed',
    note: 'Paid in full after a successful reminder sequence.',
  },
  '5': {
    customer: 'Food & Drinks Co',
    customerId: '5',
    amount: '₦420,000',
    principal: '₦417,100',
    interest: '₦2,900',
    startDate: 'Jan 10, 2026',
    dueDate: 'Mar 5, 2026',
    status: 'Pending',
    owner: 'Tunde Afolayan',
    phone: '08187654321',
    email: 'sales@food.com',
    risk: 'Medium',
    daysOpen: 35,
    stage: 'Soft reminders',
    note: 'High-value account with recurring top-up orders.',
  },
} as const;

const repaymentSchedule = [
  { due: 'Feb 15, 2026', amount: '₦100,000', status: 'Missed' },
  { due: 'Feb 22, 2026', amount: '₦75,000', status: 'Scheduled' },
  { due: 'Mar 1, 2026', amount: '₦75,000', status: 'Scheduled' },
];

const debtActivity = [
  { time: 'Today', title: 'Reminder drafted', detail: 'Follow-up call script prepared.' },
  { time: '3 days ago', title: 'Partial payment received', detail: '₦50,000 allocated to principal and fees.' },
  { time: '1 week ago', title: 'Overdue status triggered', detail: 'Auto-moved from pending to overdue.' },
];

export default function DebtDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const debtId = params.id ?? '1';
  const debt = debtProfiles[debtId as keyof typeof debtProfiles] ?? debtProfiles['1'];

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
          Back to debts
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Debt · #{debtId}
              </p>
              <StatusPill status={debt.status} />
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {debt.stage}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
              {debt.amount}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Started {debt.startDate} · Due {debt.dueDate} · {debt.daysOpen} days open
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <RefreshCw className="w-3.5 h-3.5" />
              Reschedule
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <Bell className="w-3.5 h-3.5" />
              Send reminder
            </Button>
            <Button size="sm" className="rounded-full text-xs h-9 ring-1 ring-inset ring-white/10 shadow-sm shadow-primary/20">
              <Plus className="w-3.5 h-3.5" />
              Record payment
            </Button>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Amount due" value={debt.amount} hint="Total outstanding" />
        <KPI label="Principal" value={debt.principal} hint="Original amount" />
        <KPI label="Interest" value={debt.interest} hint="Accrued to date" />
        <KPI label="Due date" value={debt.dueDate} hint={debt.status === 'Overdue' ? 'Past due' : 'Upcoming'} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* About */}
          <Section title="Note" description={debt.note}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ContactRow icon={Phone} label="Customer phone" value={debt.phone} />
              <ContactRow icon={Mail} label="Customer email" value={debt.email} />
              <ContactRow icon={CalendarClock} label="Owner" value={debt.owner} />
            </div>
          </Section>

          {/* Repayment schedule */}
          <Section
            title="Repayment schedule"
            description="Installment view"
            action={
              <button className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1">
                Export
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="divide-y divide-border">
              {repaymentSchedule.map((i, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        i.status === 'Missed'
                          ? 'bg-destructive/10 text-destructive'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i.status === 'Missed' ? (
                        <span className="text-[10px] font-medium">!</span>
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{i.amount}</p>
                      <p className="text-xs text-muted-foreground">Due {i.due}</p>
                    </div>
                  </div>
                  <StatusPill status={i.status} />
                </div>
              ))}
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Activity">
            <div className="space-y-4">
              {debtActivity.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < debtActivity.length - 1 && <div className="flex-1 w-px bg-border mt-1" />}
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
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Section title="Customer">
            <Link
              href={`/customers/${debt.customerId}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition group"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                {debt.customer.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:underline underline-offset-4">
                  {debt.customer}
                </p>
                <p className="text-xs text-muted-foreground">Open profile</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <div className="mt-3 space-y-2.5 text-sm">
              <MetaRow label="Risk level" value={debt.risk} />
              <MetaRow label="Owner" value={debt.owner} />
              <MetaRow label="Days open" value={`${debt.daysOpen}`} />
            </div>
          </Section>

          <Section title="Actions">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Mark as paid
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <RefreshCw className="w-3.5 h-3.5" />
                Reschedule
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                Waive interest
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

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-xs font-medium">{value}</span>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    Paid: { bg: 'bg-success/10 text-success', dot: 'bg-success' },
    Overdue: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
    Pending: { bg: 'bg-warning/15 text-warning', dot: 'bg-warning' },
    Missed: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
    Scheduled: { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' },
  };
  const s = map[status] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
