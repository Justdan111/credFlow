'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
  ArrowUp,
  ArrowDown,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { motion } from 'framer-motion';

const trendData = [
  { month: 'Jan', collections: 65, outstanding: 120 },
  { month: 'Feb', collections: 78, outstanding: 105 },
  { month: 'Mar', collections: 85, outstanding: 95 },
  { month: 'Apr', collections: 92, outstanding: 82 },
  { month: 'May', collections: 88, outstanding: 90 },
  { month: 'Jun', collections: 105, outstanding: 75 },
];

const riskData = [
  { name: 'Low risk', value: 45, color: 'oklch(0.588 0.233 293)' },
  { name: 'Medium risk', value: 35, color: 'oklch(0.588 0.233 293 / 0.5)' },
  { name: 'High risk', value: 20, color: 'oklch(0.588 0.233 293 / 0.2)' },
];

const recentDebts = [
  { id: 1, customer: 'ABC Stores Ltd', amount: '₦250,000', dueDate: 'Feb 15', status: 'Overdue', daysOverdue: 5 },
  { id: 2, customer: 'XYZ Retail', amount: '₦180,000', dueDate: 'Feb 20', status: 'Overdue', daysOverdue: 0 },
  { id: 3, customer: 'Tech Solutions', amount: '₦320,000', dueDate: 'Mar 10', status: 'Pending', daysOverdue: null },
  { id: 4, customer: 'Fashion Hub', amount: '₦150,000', dueDate: 'Feb 10', status: 'Paid', daysOverdue: null },
  { id: 5, customer: 'Food & Drinks Co', amount: '₦420,000', dueDate: 'Mar 5', status: 'Pending', daysOverdue: null },
];

const metrics = [
  {
    label: 'Outstanding',
    value: '₦2.5M',
    change: '+5.2%',
    changeType: 'up' as const,
    hint: 'vs last month',
  },
  {
    label: 'Overdue',
    value: '₦650K',
    change: '-12.3%',
    changeType: 'down' as const,
    hint: '8 customers · 3 new',
    trend: 'good',
  },
  {
    label: 'Customers',
    value: '1,234',
    change: '+8.7%',
    changeType: 'up' as const,
    hint: '47 this month',
  },
  {
    label: 'Collected',
    value: '₦1.2M',
    change: '+23.5%',
    changeType: 'up' as const,
    hint: 'this month',
  },
];

export default function DashboardPage() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Page header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
            Dashboard
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Welcome back, Amina.
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
            Last 30 days
          </Button>
          <Button
            size="sm"
            onClick={() => router.push('/customers')}
            className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Add customer
          </Button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const isGood =
            (m.changeType === 'up' && m.label !== 'Overdue') ||
            (m.changeType === 'down' && m.label === 'Overdue');
          return (
            <div
              key={m.label}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 hover:shadow-sm hover:shadow-primary/5 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  {m.label}
                </p>
                <div
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    isGood
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {m.changeType === 'up' ? (
                    <ArrowUp className="w-2.5 h-2.5" />
                  ) : (
                    <ArrowDown className="w-2.5 h-2.5" />
                  )}
                  {m.change}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight">{m.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{m.hint}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Line chart */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold">Collections trend</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Monthly collections vs outstanding, in thousands
              </p>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Collected</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40" />
                <span className="text-muted-foreground">Outstanding</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.912 0.058 293)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="oklch(0.502 0.032 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="oklch(0.502 0.032 257)"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
              />
              <Line
                type="monotone"
                dataKey="collections"
                stroke="oklch(0.588 0.233 293)"
                strokeWidth={2}
                dot={{ fill: 'oklch(0.588 0.233 293)', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Line
                type="monotone"
                dataKey="outstanding"
                stroke="oklch(0.588 0.233 293 / 0.3)"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ fill: 'oklch(0.588 0.233 293 / 0.4)', r: 3, strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold">Risk distribution</p>
            <p className="text-xs text-muted-foreground mt-0.5">Customer segments</p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-2xl font-semibold tracking-tight">1,234</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Total
              </p>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            {riskData.map((r) => (
              <div key={r.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: r.color }}
                  />
                  <span className="text-muted-foreground">{r.name}</span>
                </div>
                <span className="font-medium">{r.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent debts */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-border">
          <div>
            <p className="text-sm font-semibold">Needs attention</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Recent debts across your customers
            </p>
          </div>
          <button
            onClick={() => router.push('/debts')}
            className="text-xs font-medium hover:underline underline-offset-4 flex items-center gap-1"
          >
            View all
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-5 sm:px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-5 py-3">
                  Amount
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-5 py-3">
                  Due
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-5 py-3">
                  Status
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {recentDebts.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-5 sm:px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        {d.customer
                          .split(' ')
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')}
                      </div>
                      <span className="text-sm font-medium">{d.customer}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm font-medium">{d.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">
                    {d.dueDate}
                    {d.daysOverdue !== null && d.daysOverdue > 0 && (
                      <span className="ml-2 text-destructive text-xs">
                        · {d.daysOverdue}d late
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-3">
                    <button className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center">
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: 'bg-success/10 text-success',
    Overdue: 'bg-destructive/10 text-destructive',
    Pending: 'bg-warning/15 text-warning',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${
        map[status] ?? 'bg-muted text-muted-foreground'
      }`}
    >
      <span
        className={`w-1 h-1 rounded-full ${
          status === 'Paid'
            ? 'bg-success'
            : status === 'Overdue'
            ? 'bg-destructive'
            : 'bg-warning'
        }`}
      />
      {status}
    </span>
  );
}
