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
  Phone,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeInDown, FadeInUp, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

const debtProfiles = {
  '1': {
    customer: 'ABC Stores Ltd',
    customerId: '1',
    amount: '₦250,000',
    principal: '₦240,000',
    interest: '₦10,000',
    startDate: '2025-12-01',
    dueDate: '2026-02-15',
    status: 'Overdue',
    owner: 'Amina Bello',
    phone: '08012345678',
    email: 'info@abc.com',
    risk: 'Medium',
    collectionStage: 'Final reminder',
    note: 'Split payment plan approved after delayed January order delivery.',
  },
  '2': {
    customer: 'XYZ Retail',
    customerId: '2',
    amount: '₦180,000',
    principal: '₦177,900',
    interest: '₦2,100',
    startDate: '2026-01-05',
    dueDate: '2026-02-20',
    status: 'Overdue',
    owner: 'Daniel Okafor',
    phone: '08098765432',
    email: 'contact@xyz.com',
    risk: 'Low',
    collectionStage: 'Reminder queued',
    note: 'Good history, currently overdue by a small margin.',
  },
  '3': {
    customer: 'Tech Solutions',
    customerId: '3',
    amount: '₦320,000',
    principal: '₦318,200',
    interest: '₦1,800',
    startDate: '2026-01-20',
    dueDate: '2026-03-10',
    status: 'Pending',
    owner: 'Oluwaseun Adeyemi',
    phone: '09012345678',
    email: 'hello@techsol.com',
    risk: 'High',
    collectionStage: 'Awaiting due date',
    note: 'Needs close monitoring because of the larger credit exposure.',
  },
  '4': {
    customer: 'Fashion Hub',
    customerId: '4',
    amount: '₦150,000',
    principal: '₦150,000',
    interest: '₦0',
    startDate: '2025-11-15',
    dueDate: '2026-02-10',
    status: 'Paid',
    owner: 'Grace Nwosu',
    phone: '07098765432',
    email: 'shop@fashion.com',
    risk: 'Low',
    collectionStage: 'Closed',
    note: 'Paid in full after a successful reminder sequence.',
  },
  '5': {
    customer: 'Food & Drinks Co',
    customerId: '5',
    amount: '₦420,000',
    principal: '₦417,100',
    interest: '₦2,900',
    startDate: '2026-01-10',
    dueDate: '2026-03-05',
    status: 'Pending',
    owner: 'Tunde Afolayan',
    phone: '08187654321',
    email: 'sales@food.com',
    risk: 'Medium',
    collectionStage: 'Soft reminders',
    note: 'High-value account with recurring top-up orders.',
  },
} as const;

const repaymentSchedule = [
  { due: '2026-02-15', amount: '₦100,000', status: 'Missed' },
  { due: '2026-02-22', amount: '₦75,000', status: 'Scheduled' },
  { due: '2026-03-01', amount: '₦75,000', status: 'Scheduled' },
];

const debtActivity = [
  { time: 'Today', title: 'Reminder drafted', detail: 'Collections team prepared a follow-up call script.' },
  { time: '3 days ago', title: 'Partial payment received', detail: '₦50,000 allocated to principal and fees.' },
  { time: '1 week ago', title: 'Overdue status triggered', detail: 'Automatic status moved from pending to overdue.' },
];

function statusClass(status: string) {
  if (status === 'Paid') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  if (status === 'Overdue') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
}

export default function DebtDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const debtId = params.id ?? '1';
  const debt = debtProfiles[debtId as keyof typeof debtProfiles] ?? debtProfiles['1'];

  return (
    <div className="space-y-8">
      <FadeInDown>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-fit px-0 text-foreground/70 hover:text-foreground" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to debts
            </Button>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">Debt Details</p>
              <h1 className="text-3xl font-bold text-foreground">{debt.customer}</h1>
              <p className="mt-2 text-foreground/70">Debt #{debtId} overview, payment schedule, and collection workflow.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Reschedule</Button>
            <Button variant="outline">Send Reminder</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Record Payment</Button>
          </div>
        </div>
      </FadeInDown>

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Amount Due', value: debt.amount, icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
          { label: 'Principal', value: debt.principal, icon: Landmark, color: 'bg-green-100 text-green-600' },
          { label: 'Interest', value: debt.interest, icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
          { label: 'Due Date', value: debt.dueDate, icon: CalendarDays, color: 'bg-violet-100 text-violet-600' },
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
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(debt.status)}`}>{debt.status}</span>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/70">{debt.collectionStage}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{debt.amount}</h2>
                    <p className="mt-1 text-foreground/70">Started {debt.startDate} · Due {debt.dueDate}</p>
                  </div>
                  <p className="max-w-2xl text-sm leading-6 text-foreground/70">{debt.note}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:max-w-lg">
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-foreground/50" />
                      Customer Phone
                    </div>
                    <p className="text-sm text-foreground/70">{debt.phone}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Mail className="h-4 w-4 text-foreground/50" />
                      Customer Email
                    </div>
                    <p className="text-sm text-foreground/70">{debt.email}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4 sm:col-span-2">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <ShieldAlert className="h-4 w-4 text-foreground/50" />
                      Assigned Collection Owner
                    </div>
                    <p className="text-sm text-foreground/70">{debt.owner}</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Repayment Schedule</h3>
                  <p className="text-sm text-foreground/70">Installment view for the selected debt.</p>
                </div>
                <Button variant="outline" size="sm">Export schedule</Button>
              </div>
              <div className="space-y-3">
                {repaymentSchedule.map((installment) => (
                  <div key={installment.due} className="flex flex-col gap-3 rounded-2xl border border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Due {installment.due}</p>
                      <p className="text-sm text-foreground/60">Installment amount</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground">{installment.amount}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${installment.status === 'Missed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{installment.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <Card className="border border-border/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Activity Timeline</h3>
                  <p className="text-sm text-foreground/70">Tracked collection actions and state changes.</p>
                </div>
                <FileText className="h-5 w-5 text-foreground/50" />
              </div>
              <div className="space-y-4">
                {debtActivity.map((entry, index) => (
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
                <h3 className="text-lg font-semibold text-foreground">Customer Summary</h3>
                <RefreshCw className="h-5 w-5 text-foreground/50" />
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Customer</span>
                  <Link href={`/customers/${debt.customerId}`} className="font-medium text-foreground hover:text-purple-600">{debt.customer}</Link>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Risk Level</span>
                  <span className="font-medium text-foreground">{debt.risk}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Collection Owner</span>
                  <span className="font-medium text-foreground">{debt.owner}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Days Open</span>
                  <span className="font-medium text-foreground">75</span>
                </div>
              </div>
            </Card>
          </ScaleIn>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Payment Actions</h3>
              <div className="grid gap-3">
                <Button className="justify-start bg-purple-600 hover:bg-purple-700">Record payment</Button>
                <Button variant="outline" className="justify-start">Mark as paid</Button>
                <Button variant="outline" className="justify-start">Reschedule debt</Button>
                <Button variant="outline" className="justify-start">Waive interest</Button>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.15}>
            <Card className="border border-border/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Collections Notes</h3>
              <div className="space-y-3 text-sm text-foreground/70">
                <p>• Final reminder queued for same-day dispatch.</p>
                <p>• Partial settlement preferred by customer within this week.</p>
                <p>• Follow-up call should be logged after the next touchpoint.</p>
              </div>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}