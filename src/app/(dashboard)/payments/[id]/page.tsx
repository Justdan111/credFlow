'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowUpRight,
  Download,
  Mail,
  Phone,
  Receipt,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const paymentProfiles = {
  '1': {
    customer: 'ABC Stores Ltd',
    customerId: '1',
    amount: '₦50,000',
    date: 'Feb 10, 2026',
    method: 'Bank Transfer',
    reference: 'TRF001',
    status: 'Posted',
    debtRef: '1',
    collector: 'Miriam Lawal',
    email: 'info@abc.com',
    phone: '08012345678',
    note: 'Payment cleared and applied to the oldest overdue debt.',
  },
  '2': {
    customer: 'XYZ Retail',
    customerId: '2',
    amount: '₦45,000',
    date: 'Feb 8, 2026',
    method: 'Cash',
    reference: 'CASH001',
    status: 'Posted',
    debtRef: '2',
    collector: 'Miriam Lawal',
    email: 'contact@xyz.com',
    phone: '08098765432',
    note: 'Cash payment counted and reconciled at close of business.',
  },
  '3': {
    customer: 'Fashion Hub',
    customerId: '4',
    amount: '₦150,000',
    date: 'Feb 5, 2026',
    method: 'Bank Transfer',
    reference: 'TRF002',
    status: 'Posted',
    debtRef: '4',
    collector: 'Samuel Kuti',
    email: 'shop@fashion.com',
    phone: '07098765432',
    note: 'Large transfer matched against invoice and receipt generated.',
  },
  '4': {
    customer: 'Tech Solutions',
    customerId: '3',
    amount: '₦80,000',
    date: 'Feb 1, 2026',
    method: 'Paystack',
    reference: 'PS001',
    status: 'Posted',
    debtRef: '3',
    collector: 'Samuel Kuti',
    email: 'hello@techsol.com',
    phone: '09012345678',
    note: 'Paystack reference captured and auto-matched successfully.',
  },
  '5': {
    customer: 'Food & Drinks Co',
    customerId: '5',
    amount: '₦120,000',
    date: 'Jan 28, 2026',
    method: 'Bank Transfer',
    reference: 'TRF003',
    status: 'Posted',
    debtRef: '5',
    collector: 'Miriam Lawal',
    email: 'sales@food.com',
    phone: '08187654321',
    note: 'High-value payment applied to installments and interest first.',
  },
} as const;

const allocation = [
  { label: 'Principal', value: '₦42,000', pct: 84 },
  { label: 'Interest', value: '₦6,500', pct: 13 },
  { label: 'Fees', value: '₦1,500', pct: 3 },
];

const paymentTimeline = [
  { time: 'Today', title: 'Receipt generated', detail: 'PDF receipt queued for email delivery.' },
  { time: '10 mins ago', title: 'Ledger updated', detail: 'Balance adjusted on linked debt.' },
  { time: '2 hrs ago', title: 'Reconciliation complete', detail: 'Manual review matched reference and amount.' },
];

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const paymentId = params.id ?? '1';
  const payment = paymentProfiles[paymentId as keyof typeof paymentProfiles] ?? paymentProfiles['1'];

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
          Back to payments
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                Payment · #{paymentId}
              </p>
              <StatusPill status={payment.status} />
              <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded">
                {payment.method}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em] text-success">
              +{payment.amount}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {payment.date} · Ref{' '}
              <span className="font-mono">{payment.reference}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <Send className="w-3.5 h-3.5" />
              Send receipt
            </Button>
            <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
              <Download className="w-3.5 h-3.5" />
              Export PDF
            </Button>
            <Button size="sm" variant="outline" className="rounded-full text-xs h-9 border-destructive/30 text-destructive hover:bg-destructive/10">
              Reverse
            </Button>
          </div>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          {/* Note + contacts */}
          <Section title="Note" description={payment.note}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <ContactRow icon={Phone} label="Phone" value={payment.phone} />
              <ContactRow icon={Mail} label="Email" value={payment.email} />
              <ContactRow icon={Receipt} label="Reference" value={payment.reference} mono />
            </div>
          </Section>

          {/* Allocation */}
          <Section
            title="Allocation"
            description="How this payment was applied"
            action={
              <button className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1">
                Edit
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            {/* Bar */}
            <div className="flex h-2 rounded-full overflow-hidden mb-4">
              <div className="bg-primary" style={{ width: `${allocation[0].pct}%` }} />
              <div className="bg-warning" style={{ width: `${allocation[1].pct}%` }} />
              <div className="bg-muted-foreground/40" style={{ width: `${allocation[2].pct}%` }} />
            </div>
            <div className="space-y-2">
              {allocation.map((a, i) => (
                <div key={a.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        i === 0 ? 'bg-primary' : i === 1 ? 'bg-warning' : 'bg-muted-foreground/40'
                      }`}
                    />
                    <span className="text-muted-foreground">{a.label}</span>
                    <span className="text-xs text-muted-foreground">{a.pct}%</span>
                  </div>
                  <span className="font-medium">{a.value}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Timeline */}
          <Section title="Activity">
            <div className="space-y-4">
              {paymentTimeline.map((entry, i) => (
                <div key={i} className="flex gap-3">
                  <div className="relative flex flex-col items-center shrink-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                    {i < paymentTimeline.length - 1 && (
                      <div className="flex-1 w-px bg-border mt-1" />
                    )}
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
              href={`/customers/${payment.customerId}`}
              className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted/30 transition group"
            >
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                {payment.customer.split(' ').slice(0, 2).map((w) => w[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate group-hover:underline underline-offset-4">
                  {payment.customer}
                </p>
                <p className="text-xs text-muted-foreground">Open profile</p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
            <div className="mt-3 space-y-2.5 text-sm">
              <MetaRow label="Linked debt" value={`Debt #${payment.debtRef}`} link={`/debts/${payment.debtRef}`} />
              <MetaRow label="Collector" value={payment.collector} />
              <MetaRow label="Account" value="Main operating" />
            </div>
          </Section>

          <Section title="Receipt actions">
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <Send className="w-3.5 h-3.5" />
                Send receipt
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start rounded-lg text-xs h-9">
                Mark reconciled
              </Button>
            </div>
          </Section>
        </div>
      </div>
    </motion.div>
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
  mono = false,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-3">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-muted-foreground font-medium mb-1.5">
        <Icon className="w-3 h-3" strokeWidth={2} />
        {label}
      </div>
      <p className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</p>
    </div>
  );
}

function MetaRow({ label, value, link }: { label: string; value: string; link?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      {link ? (
        <Link href={link} className="text-xs font-medium hover:underline underline-offset-4">
          {value}
        </Link>
      ) : (
        <span className="text-xs font-medium">{value}</span>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    Posted: { bg: 'bg-success/10 text-success', dot: 'bg-success' },
    Failed: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
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
