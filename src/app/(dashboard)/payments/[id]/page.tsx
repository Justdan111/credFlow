'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  FileText,
  Landmark,
  Mail,
  MessageCircle,
  Phone,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeInDown, FadeInUp, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

const paymentProfiles = {
  '1': {
    customer: 'ABC Stores Ltd',
    customerId: '1',
    amount: '₦50,000',
    date: '2026-02-10',
    method: 'Bank Transfer',
    reference: 'TRF001',
    status: 'Posted',
    debtRef: 'Debt #1',
    collector: 'Miriam Lawal',
    email: 'info@abc.com',
    phone: '08012345678',
    note: 'Payment cleared and applied to the oldest overdue debt.',
  },
  '2': {
    customer: 'XYZ Retail',
    customerId: '2',
    amount: '₦45,000',
    date: '2026-02-08',
    method: 'Cash',
    reference: 'CASH001',
    status: 'Posted',
    debtRef: 'Debt #2',
    collector: 'Miriam Lawal',
    email: 'contact@xyz.com',
    phone: '08098765432',
    note: 'Cash payment counted and reconciled manually at the close of business.',
  },
  '3': {
    customer: 'Fashion Hub',
    customerId: '4',
    amount: '₦150,000',
    date: '2026-02-05',
    method: 'Bank Transfer',
    reference: 'TRF002',
    status: 'Posted',
    debtRef: 'Debt #4',
    collector: 'Samuel Kuti',
    email: 'shop@fashion.com',
    phone: '07098765432',
    note: 'Large transfer matched against invoice and receipt generated.',
  },
  '4': {
    customer: 'Tech Solutions',
    customerId: '3',
    amount: '₦80,000',
    date: '2026-02-01',
    method: 'Mobile Money',
    reference: 'MM001',
    status: 'Posted',
    debtRef: 'Debt #3',
    collector: 'Samuel Kuti',
    email: 'hello@techsol.com',
    phone: '09012345678',
    note: 'Mobile money reference captured and auto-matched successfully.',
  },
  '5': {
    customer: 'Food & Drinks Co',
    customerId: '5',
    amount: '₦120,000',
    date: '2026-01-28',
    method: 'Bank Transfer',
    reference: 'TRF003',
    status: 'Posted',
    debtRef: 'Debt #5',
    collector: 'Miriam Lawal',
    email: 'sales@food.com',
    phone: '08187654321',
    note: 'High-value payment applied to installments and interest first.',
  },
} as const;

const allocation = [
  { label: 'Principal', value: '₦42,000' },
  { label: 'Interest', value: '₦6,500' },
  { label: 'Fees', value: '₦1,500' },
];

const paymentTimeline = [
  { time: 'Today', title: 'Receipt generated', detail: 'PDF receipt queued for email delivery.' },
  { time: '10 mins ago', title: 'Ledger updated', detail: 'Balance adjusted on linked debt.' },
  { time: '2 hrs ago', title: 'Reconciliation complete', detail: 'Manual review matched reference and amount.' },
];

function statusClass(status: string) {
  if (status === 'Failed') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

export default function PaymentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const paymentId = params.id ?? '1';
  const payment = paymentProfiles[paymentId as keyof typeof paymentProfiles] ?? paymentProfiles['1'];

  return (
    <div className="space-y-8">
      <FadeInDown>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-fit px-0 text-foreground/70 hover:text-foreground" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to payments
            </Button>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">Payment Details</p>
              <h1 className="text-3xl font-bold text-foreground">{payment.amount}</h1>
              <p className="mt-2 text-foreground/70">Reference {payment.reference} · {payment.date}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Send receipt</Button>
            <Button variant="outline">Export PDF</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Reverse payment</Button>
          </div>
        </div>
      </FadeInDown>

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Amount', value: payment.amount, icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
          { label: 'Method', value: payment.method, icon: Landmark, color: 'bg-green-100 text-green-600' },
          { label: 'Date', value: payment.date, icon: CalendarDays, color: 'bg-amber-100 text-amber-600' },
          { label: 'Status', value: payment.status, icon: ShieldCheck, color: 'bg-violet-100 text-violet-600' },
        ].map((metric) => {
          const Icon = metric.icon;
          return (
            <StaggerItem key={metric.label}>
              <motion.div whileHover={{ y: -4, scale: 1.01 }} className="h-full">
                <Card className="h-full p-6 border border-border/50">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">{metric.label}</p>
                      <p className="mt-2 text-2xl font-bold text-foreground">{metric.value}</p>
                    </div>
                    <div className={`rounded-2xl p-3 ${metric.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            </StaggerItem>
          );
        })}
      </StaggerContainer>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.45fr_1fr]">
        <div className="space-y-6">
          <FadeInUp delay={0.05}>
            <Card className="border border-border/50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(payment.status)}`}>{payment.status}</span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/70">{payment.method}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{payment.customer}</h2>
                    <p className="mt-1 text-foreground/70">Linked to {payment.debtRef}</p>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-foreground/70">{payment.note}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:max-w-lg">
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-foreground/50" />
                      Phone
                    </div>
                    <p className="text-sm text-foreground/70">{payment.phone}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Mail className="h-4 w-4 text-foreground/50" />
                      Email
                    </div>
                    <p className="text-sm text-foreground/70">{payment.email}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4 sm:col-span-2">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Receipt className="h-4 w-4 text-foreground/50" />
                      Reference
                    </div>
                    <p className="text-sm text-foreground/70">{payment.reference}</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Allocation</h3>
                  <p className="text-sm text-foreground/70">How the payment was applied to the balance.</p>
                </div>
                <Button variant="outline" size="sm">Edit allocation</Button>
              </div>
              <div className="space-y-3">
                {allocation.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-2xl border border-border/50 p-4">
                    <span className="font-medium text-foreground">{item.label}</span>
                    <span className="font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <Card className="border border-border/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Timeline</h3>
                  <p className="text-sm text-foreground/70">Posting and reconciliation events.</p>
                </div>
                <FileText className="h-5 w-5 text-foreground/50" />
              </div>
              <div className="space-y-4">
                {paymentTimeline.map((entry, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-purple-600" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{entry.title}</p>
                      <p className="text-xs uppercase tracking-wide text-foreground/50">{entry.time}</p>
                      <p className="mt-1 text-sm text-foreground/70">{entry.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInUp>
        </div>

        <div className="space-y-6">
          <ScaleIn delay={0.05}>
            <Card className="border border-border/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Customer Link</h3>
                <MessageCircle className="h-5 w-5 text-foreground/50" />
              </div>
              <div className="space-y-4 text-sm">
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <p className="text-foreground/60">Customer</p>
                  <Link href={`/customers/${payment.customerId}`} className="font-medium text-foreground hover:text-purple-600">{payment.customer}</Link>
                </div>
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <p className="text-foreground/60">Collector</p>
                  <p className="font-medium text-foreground">{payment.collector}</p>
                </div>
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <p className="text-foreground/60">Receiving Account</p>
                  <p className="font-medium text-foreground">Main operating bank account</p>
                </div>
                <div className="rounded-xl bg-muted/40 px-4 py-3">
                  <p className="text-foreground/60">Linked Debt</p>
                  <p className="font-medium text-foreground">{payment.debtRef}</p>
                </div>
              </div>
            </Card>
          </ScaleIn>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Receipt Actions</h3>
              <div className="grid gap-3">
                <Button className="justify-start bg-purple-600 hover:bg-purple-700">Send receipt</Button>
                <Button variant="outline" className="justify-start">Download PDF</Button>
                <Button variant="outline" className="justify-start">Mark as reconciled</Button>
                <Button variant="outline" className="justify-start">Void payment</Button>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <Card className="border border-border/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Activity Summary</h3>
              <div className="space-y-3 text-sm text-foreground/70">
                <p>• Receipt was issued automatically on successful posting.</p>
                <p>• Balance on the linked debt should now be reduced in real time.</p>
                <p>• A follow-up message can be scheduled from this screen.</p>
              </div>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}