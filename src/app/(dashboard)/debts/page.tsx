'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { RecordDebtDialog } from '@/components/dialogs/record-debt-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

const debts = [
  { id: 1, customer: 'ABC Stores Ltd', amount: '₦250,000', startDate: 'Dec 1, 2025', dueDate: 'Feb 15, 2026', status: 'Overdue', daysOverdue: 5, interestAccrued: '₦5,200' },
  { id: 2, customer: 'XYZ Retail', amount: '₦180,000', startDate: 'Jan 5, 2026', dueDate: 'Feb 20, 2026', status: 'Overdue', daysOverdue: 0, interestAccrued: '₦2,100' },
  { id: 3, customer: 'Tech Solutions', amount: '₦320,000', startDate: 'Jan 20, 2026', dueDate: 'Mar 10, 2026', status: 'Pending', daysOverdue: null, interestAccrued: '₦1,800' },
  { id: 4, customer: 'Fashion Hub', amount: '₦150,000', startDate: 'Nov 15, 2025', dueDate: 'Feb 10, 2026', status: 'Paid', daysOverdue: null, interestAccrued: '₦0' },
  { id: 5, customer: 'Food & Drinks Co', amount: '₦420,000', startDate: 'Jan 10, 2026', dueDate: 'Mar 5, 2026', status: 'Pending', daysOverdue: null, interestAccrued: '₦2,900' },
];

const statusFilters = ['All', 'Pending', 'Overdue', 'Paid'];

export default function DebtsPage() {
  const [recordDebtOpen, setRecordDebtOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [, setSelectedDebtId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeStatus, setActiveStatus] = useState('All');

  const filtered = debts.filter((d) => {
    const matchesSearch = d.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeStatus === 'All' || d.status === activeStatus;
    return matchesSearch && matchesStatus;
  });

  const totalDebt = debts.reduce((sum, d) => sum + parseInt(d.amount.replace(/[^0-9]/g, '')), 0);
  const overdueDebt = debts
    .filter((d) => d.status === 'Overdue')
    .reduce((sum, d) => sum + parseInt(d.amount.replace(/[^0-9]/g, '')), 0);
  const paidDebt = debts
    .filter((d) => d.status === 'Paid')
    .reduce((sum, d) => sum + parseInt(d.amount.replace(/[^0-9]/g, '')), 0);

  const kpis = [
    { label: 'Outstanding', value: `₦${(totalDebt / 1000000).toFixed(1)}M`, change: '+5.2%', changeType: 'up', hint: `${debts.length} records` },
    { label: 'Overdue', value: `₦${(overdueDebt / 1000).toFixed(0)}K`, change: '-12.3%', changeType: 'down', hint: `${debts.filter((d) => d.status === 'Overdue').length} overdue`, good: true },
    { label: 'Collected', value: `₦${(paidDebt / 1000).toFixed(0)}K`, change: '+23%', changeType: 'up', hint: `${debts.filter((d) => d.status === 'Paid').length} completed` },
  ];

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setSelectedDebtId(null);
    }, 500);
  };

  const handleRecordDebt = (debt: { customer: string; amount: string; dueDate: string }) => {
    console.log('Recording debt:', debt);
  };

  const openDeleteDialog = (debtId: number) => {
    setSelectedDebtId(debtId);
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
            Debts
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            Track what&apos;s owed
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            All outstanding, overdue, and settled debts.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => setRecordDebtOpen(true)}
          className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          <Plus className="w-3.5 h-3.5" />
          Record debt
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {kpis.map((k) => {
          const isGood = k.good ? k.changeType === 'down' : k.changeType === 'up';
          return (
            <div
              key={k.label}
              className="rounded-2xl border border-border bg-card p-5 hover:border-primary/20 transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-medium">
                  {k.label}
                </p>
                <div
                  className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                    isGood ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                  }`}
                >
                  {k.changeType === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                  {k.change}
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight">{k.value}</p>
              <p className="text-[11px] text-muted-foreground mt-1.5">{k.hint}</p>
            </div>
          );
        })}
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
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeStatus === s ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
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
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Due</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Status</th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">Interest</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <motion.tr
                  key={d.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <Link href={`/debts/${d.id}`} className="flex items-center gap-2.5 group/link">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        {d.customer.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>
                      <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                        {d.customer}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium">{d.amount}</td>
                  <td className="px-6 py-3.5 text-sm text-muted-foreground">
                    {d.dueDate}
                    {d.daysOverdue !== null && d.daysOverdue > 0 && (
                      <span className="ml-2 text-destructive text-xs">· {d.daysOverdue}d late</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <StatusPill status={d.status} />
                  </td>
                  <td className="px-6 py-3.5 text-sm text-warning font-medium">{d.interestAccrued}</td>
                  <td className="px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/debts/${d.id}`}>
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/debts/${d.id}`}>
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(d.id)}
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

      <RecordDebtDialog open={recordDebtOpen} onOpenChange={setRecordDebtOpen} onRecord={handleRecordDebt} />
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete debt"
        description="Are you sure you want to delete this debt record? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </motion.div>
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
