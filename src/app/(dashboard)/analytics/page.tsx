'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const collectionData = [
  { month: 'Jan', target: 1.0, actual: 0.85 },
  { month: 'Feb', target: 1.0, actual: 0.92 },
  { month: 'Mar', target: 1.2, actual: 1.05 },
  { month: 'Apr', target: 1.2, actual: 1.18 },
  { month: 'May', target: 1.2, actual: 1.1 },
  { month: 'Jun', target: 1.3, actual: 1.25 },
];

const riskTrendData = [
  { month: 'Jan', low: 45, medium: 40, high: 15 },
  { month: 'Feb', low: 48, medium: 38, high: 14 },
  { month: 'Mar', low: 52, medium: 35, high: 13 },
  { month: 'Apr', low: 55, medium: 33, high: 12 },
  { month: 'May', low: 53, medium: 34, high: 13 },
  { month: 'Jun', low: 58, medium: 31, high: 11 },
];

const customerValueData = [
  { range: '₦1M+', count: 284 },
  { range: '₦500K–1M', count: 380 },
  { range: '₦100K–500K', count: 450 },
  { range: '<₦100K', count: 120 },
];

const insights = [
  { title: 'Collection rate', value: '92.5%', change: '+3.2%', trend: 'up', good: true },
  { title: 'Avg days to collect', value: '18.3', change: '-2.1', trend: 'down', good: true },
  { title: 'Customer retention', value: '94.8%', change: '+1.5%', trend: 'up', good: true },
  { title: 'Bad debt ratio', value: '2.3%', change: '-0.8%', trend: 'down', good: true },
];

const takeaways = [
  '92.5% collection rate is excellent — your customers are paying on time.',
  'June saw ₦1.25M collected, your strongest month driven by better risk scoring.',
  'Days-to-collect improved by 2.1 days — reminders are working.',
  'The 11% high-risk segment holds the biggest recovery opportunity.',
];

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-medium mb-1">
            Analytics
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Your business, in numbers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep insights into cash flow, risk, and collection performance.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
            Last 6 months
          </Button>
          <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {insights.map((k) => {
          const isGood = k.good;
          return (
            <div
              key={k.title}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  {k.title}
                </p>
                <div
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    isGood ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {k.trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {k.change}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight">{k.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Target vs actual */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold">Collection performance</p>
              <p className="text-xs text-muted-foreground mt-0.5">Target vs actual, in ₦M</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">Actual</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                <span className="text-muted-foreground">Target</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={collectionData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.058 293)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(v) => `₦${v}M`}
              />
              <Bar dataKey="target" fill="oklch(0.588 0.233 293 / 0.15)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="oklch(0.588 0.233 293)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk trend */}
        <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className="text-sm font-semibold">Risk distribution</p>
              <p className="text-xs text-muted-foreground mt-0.5">Customer segments over time</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span className="text-muted-foreground">Low</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">Med</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span className="text-muted-foreground">High</span>
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={riskTrendData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.058 293)" vertical={false} />
              <XAxis dataKey="month" stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="low" stackId="1" stroke="oklch(0.698 0.195 145)" fill="oklch(0.698 0.195 145 / 0.4)" />
              <Area type="monotone" dataKey="medium" stackId="1" stroke="oklch(0.745 0.155 75)" fill="oklch(0.745 0.155 75 / 0.4)" />
              <Area type="monotone" dataKey="high" stackId="1" stroke="oklch(0.628 0.258 27)" fill="oklch(0.628 0.258 27 / 0.4)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Customer value distribution */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="mb-6">
          <p className="text-sm font-semibold">Customer value distribution</p>
          <p className="text-xs text-muted-foreground mt-0.5">Number of customers by debt-size segment</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={customerValueData} layout="vertical" margin={{ top: 5, right: 10, left: 5, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.058 293)" horizontal={false} />
            <XAxis type="number" stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis dataKey="range" type="category" stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} width={80} />
            <Tooltip
              contentStyle={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="count" fill="oklch(0.588 0.233 293)" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
          </div>
          <p className="text-sm font-semibold">Key insights</p>
        </div>
        <div className="space-y-3">
          {takeaways.map((t, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-[10px] font-mono text-muted-foreground mt-1 shrink-0">
                0{i + 1}
              </span>
              <p className="text-sm text-foreground/85 leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
