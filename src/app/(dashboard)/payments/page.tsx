'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Plus,
  Download,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUp,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RecordPaymentDialog } from '@/components/dialogs/record-payment-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

const payments = [
  { id: 1, customer: 'ABC Stores Ltd', amount: '₦50,000', date: 'Feb 10, 2026', method: 'Bank Transfer', reference: 'TRF001' },
  { id: 2, customer: 'XYZ Retail', amount: '₦45,000', date: 'Feb 8, 2026', method: 'Cash', reference: 'CASH001' },
  { id: 3, customer: 'Fashion Hub', amount: '₦150,000', date: 'Feb 5, 2026', method: 'Bank Transfer', reference: 'TRF002' },
  { id: 4, customer: 'Tech Solutions', amount: '₦80,000', date: 'Feb 1, 2026', method: 'Paystack', reference: 'PS001' },
  { id: 5, customer: 'Food & Drinks Co', amount: '₦120,000', date: 'Jan 28, 2026', method: 'Bank Transfer', reference: 'TRF003' },
];

const chartData = [
  { week: 'Week 1', amount: 150 },
  { week: 'Week 2', amount: 180 },
  { week: 'Week 3', amount: 165 },
  { week: 'Week 4', amount: 210 },
];

const methodFilters = ['All', 'Bank Transfer', 'Cash', 'Paystack'];

export default function PaymentsPage() {
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [, setSelectedPaymentId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMethod, setActiveMethod] = useState('All');

  const filtered = payments.filter((p) => {
    const matchesSearch = p.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = activeMethod === 'All' || p.method === activeMethod;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments.reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, '')), 0);
  const avgPayment = totalCollected / payments.length;

  const kpis = [
    { label: 'Collected', value: `₦${(totalCollected / 1000).toFixed(0)}K`, change: '+23%', hint: 'This month' },
    { label: 'Avg payment', value: `₦${(avgPayment / 1000).toFixed(0)}K`, change: '+8%', hint: `${payments.length} transactions` },
    { label: 'Success rate', value: '98%', change: '+2%', hint: 'All successful' },
  ];

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setSelectedPaymentId(null);
    }, 500);
  };

  const handleRecordPayment = (payment: { customer: string; amount: string; date: string; method: string }) => {
    console.log('Recording payment:', payment);
  };

  const openDeleteDialog = (id: number) => {
    setSelectedPaymentId(id);
    setDeleteConfirmOpen(true);
  };

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
            Payments
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Money coming in
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Every payment received across all customers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setRecordPaymentOpen(true)}
            className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Record payment
          </Button>
        </div>
      </div>

      {/* KPIs + weekly chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 space-y-4">
          {kpis.map((k) => (
            <div key={k.label} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  {k.label}
                </p>
                <div className="text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5 bg-success/10 text-success">
                  <ArrowUp className="w-2.5 h-2.5" />
                  {k.change}
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-tight">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{k.hint}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 sm:p-6">
          <div className="mb-6">
            <p className="text-sm font-semibold">Weekly collections</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Amount received this month, in thousands
            </p>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.912 0.058 293)" vertical={false} />
              <XAxis dataKey="week" stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="oklch(0.502 0.032 257)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
                formatter={(v) => `₦${v}K`}
              />
              <Bar dataKey="amount" fill="oklch(0.588 0.233 293)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search by customer…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background overflow-x-auto">
          {methodFilters.map((m) => (
            <button
              key={m}
              onClick={() => setActiveMethod(m)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                activeMethod === m ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-10 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5" />
          More
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Customer</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Amount</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Date</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Method</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Reference</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <Link href={`/payments/${p.id}`} className="flex items-center gap-2.5 group/link">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        {p.customer.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>
                      <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                        {p.customer}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium text-success">+{p.amount}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">{p.date}</td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted text-foreground">
                      {p.method}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-muted-foreground font-mono">{p.reference}</td>
                  <td className="px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/payments/${p.id}`}>
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/payments/${p.id}`}>
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(p.id)}
                          className="text-xs gap-2 text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <RecordPaymentDialog open={recordPaymentOpen} onOpenChange={setRecordPaymentOpen} onRecord={handleRecordPayment} />
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete payment"
        description="Are you sure you want to delete this payment? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
