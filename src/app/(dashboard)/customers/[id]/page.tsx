'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarDays, CreditCard, FileText, Mail, MapPin, Phone, ShieldAlert, Sparkles, TrendingUp, } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeInDown, FadeInUp, ScaleIn, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

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
    lastPayment: '2026-02-10',
    nextFollowUp: '2026-02-18',
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
    lastPayment: '2026-02-08',
    nextFollowUp: '2026-02-20',
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
    lastPayment: '2026-01-25',
    nextFollowUp: '2026-02-14',
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
    lastPayment: '2026-02-05',
    nextFollowUp: '2026-02-21',
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
    lastPayment: '2026-01-28',
    nextFollowUp: '2026-02-17',
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
    lastPayment: '2026-02-12',
    nextFollowUp: '2026-02-22',
    collectionRate: '89%',
    note: 'Stable account with predictable monthly repayment behavior.',
  },
} as const;

const customerDebts = [
  { id: 1, amount: '₦150,000', dueDate: '2026-02-15', status: 'Overdue', interest: '₦4,200' },
  { id: 2, amount: '₦100,000', dueDate: '2026-03-01', status: 'Pending', interest: '₦1,400' },
  { id: 3, amount: '₦50,000', dueDate: '2026-01-30', status: 'Paid', interest: '₦0' },
];

const customerPayments = [
  { id: 1, amount: '₦50,000', date: '2026-02-10', method: 'Bank Transfer', reference: 'TRF001' },
  { id: 2, amount: '₦45,000', date: '2026-01-24', method: 'Cash', reference: 'CASH014' },
  { id: 3, amount: '₦65,000', date: '2026-01-08', method: 'Mobile Money', reference: 'MM022' },
];

const activity = [
  { time: 'Today', title: 'Follow-up reminder scheduled', detail: 'Automated SMS reminder will go out at 4:00 PM.' },
  { time: '2 days ago', title: 'Payment received', detail: '₦50,000 posted against the oldest open debt.' },
  { time: 'Last week', title: 'Credit note added', detail: 'Account reviewed and temporary limit kept at ₦500,000.' },
];

function riskClass(risk: string) {
  if (risk === 'High') return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
  if (risk === 'Medium') return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
  return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
}

export default function CustomerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const customerId = params.id ?? '1';
  const customer = customerProfiles[customerId as keyof typeof customerProfiles] ?? customerProfiles['1'];

  return (
    <div className="space-y-8">
      <FadeInDown>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-fit px-0 text-foreground/70 hover:text-foreground" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to customers
            </Button>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-foreground/50">Customer Details</p>
              <h1 className="text-3xl font-bold text-foreground">{customer.name}</h1>
              <p className="mt-2 text-foreground/70">Complete customer profile, debt history, payments, and activity timeline.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Send Reminder</Button>
            <Button variant="outline">Add Note</Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Edit Customer</Button>
          </div>
        </div>
      </FadeInDown>

      <StaggerContainer className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Outstanding', value: customer.outstanding, icon: CreditCard, color: 'bg-blue-100 text-blue-600' },
          { label: 'Collection Rate', value: customer.collectionRate, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
          { label: 'Credit Limit', value: customer.creditLimit, icon: ShieldAlert, color: 'bg-amber-100 text-amber-600' },
          { label: 'Last Payment', value: customer.lastPayment, icon: CalendarDays, color: 'bg-violet-100 text-violet-600' },
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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <FadeInUp delay={0.05}>
            <Card className="border border-border/50 p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-purple-600 to-pink-500 text-lg font-bold text-white">
                    {customer.initials}
                  </div>
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${riskClass(customer.riskLevel)}`}>{customer.riskLevel} Risk</span>
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/70">{customer.industry}</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
                      <p className="mt-1 text-foreground/70">Primary contact: {customer.contactName}</p>
                    </div>
                    <p className="max-w-2xl text-sm leading-6 text-foreground/70">{customer.note}</p>
                  </div>
                </div>
                <div className="grid gap-3 text-sm text-foreground/70 sm:grid-cols-2 lg:max-w-md">
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Phone className="h-4 w-4 text-foreground/50" />
                      Phone
                    </div>
                    <p>{customer.phone}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <Mail className="h-4 w-4 text-foreground/50" />
                      Email
                    </div>
                    <p>{customer.email}</p>
                  </div>
                  <div className="rounded-xl border border-border/50 p-4 sm:col-span-2">
                    <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
                      <MapPin className="h-4 w-4 text-foreground/50" />
                      Address
                    </div>
                    <p>{customer.address}</p>
                  </div>
                </div>
              </div>
            </Card>
          </FadeInUp>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Open Debts</h3>
                  <p className="text-sm text-foreground/70">Current debt positions for this customer.</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/debts">View all debts</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {customerDebts.map((debt) => (
                  <div key={debt.id} className="flex flex-col gap-4 rounded-2xl border border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">Debt #{debt.id}</p>
                      <p className="text-sm text-foreground/60">Due {debt.dueDate}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-semibold text-foreground">{debt.amount}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${debt.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : debt.status === 'Overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{debt.status}</span>
                      <span className="text-sm text-orange-600">Interest {debt.interest}</span>
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
                  <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
                  <p className="text-sm text-foreground/70">Payment history and collection touchpoints.</p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/payments">Open payments</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {customerPayments.map((payment) => (
                  <div key={payment.id} className="flex flex-col gap-3 rounded-2xl border border-border/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-foreground">{payment.amount}</p>
                      <p className="text-sm text-foreground/60">{payment.date} · {payment.method}</p>
                    </div>
                    <span className="font-mono text-sm text-foreground/60">{payment.reference}</span>
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
                <h3 className="text-lg font-semibold text-foreground">Profile Snapshot</h3>
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Customer ID</span>
                  <span className="font-mono font-medium text-foreground">CUST-{customerId.padStart(3, '0')}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Paid to Date</span>
                  <span className="font-medium text-foreground">{customer.paidToDate}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Next Follow-up</span>
                  <span className="font-medium text-foreground">{customer.nextFollowUp}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-muted/40 px-4 py-3">
                  <span className="text-foreground/60">Business Size</span>
                  <span className="font-medium text-foreground">Mid-market</span>
                </div>
              </div>
            </Card>
          </ScaleIn>

          <FadeInUp delay={0.1}>
            <Card className="border border-border/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Timeline</h3>
                <FileText className="h-5 w-5 text-foreground/50" />
              </div>
              <div className="space-y-4">
                {activity.map((entry, index) => (
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

          <FadeInUp delay={0.15}>
            <Card className="border border-border/50 p-6">
              <h3 className="mb-4 text-lg font-semibold text-foreground">Quick Actions</h3>
              <div className="grid gap-3">
                <Button className="justify-start bg-purple-600 hover:bg-purple-700">Create reminder</Button>
                <Button variant="outline" className="justify-start">Record payment</Button>
                <Button variant="outline" className="justify-start">Add note</Button>
              </div>
            </Card>
          </FadeInUp>
        </div>
      </div>
    </div>
  );
}