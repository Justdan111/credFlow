'use client';


import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, Eye, Edit2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FadeInDown, FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

const debts = [
  {
    id: 1,
    customer: 'ABC Stores Ltd',
    amount: '₦250,000',
    startDate: '2025-12-01',
    dueDate: '2026-02-15',
    status: 'Overdue',
    daysOverdue: 5,
    interestAccrued: '₦5,200',
  },
  {
    id: 2,
    customer: 'XYZ Retail',
    amount: '₦180,000',
    startDate: '2026-01-05',
    dueDate: '2026-02-20',
    status: 'Overdue',
    daysOverdue: 0,
    interestAccrued: '₦2,100',
  },
  {
    id: 3,
    customer: 'Tech Solutions',
    amount: '₦320,000',
    startDate: '2026-01-20',
    dueDate: '2026-03-10',
    status: 'Pending',
    daysOverdue: null,
    interestAccrued: '₦1,800',
  },
  {
    id: 4,
    customer: 'Fashion Hub',
    amount: '₦150,000',
    startDate: '2025-11-15',
    dueDate: '2026-02-10',
    status: 'Paid',
    daysOverdue: null,
    interestAccrued: '₦0',
  },
  {
    id: 5,
    customer: 'Food & Drinks Co',
    amount: '₦420,000',
    startDate: '2026-01-10',
    dueDate: '2026-03-05',
    status: 'Pending',
    daysOverdue: null,
    interestAccrued: '₦2,900',
  },
];

export default function DebtsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Overdue':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      case 'Pending':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const totalDebt = debts.reduce((sum, debt) => sum + parseInt(debt.amount.replace(/[^0-9]/g, '')), 0);
  const overdueDebt = debts
    .filter((d) => d.status === 'Overdue')
    .reduce((sum, debt) => sum + parseInt(debt.amount.replace(/[^0-9]/g, '')), 0);

  return (
      <div className="space-y-8">
        {/* Header */}
        <FadeInDown>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Debts</h1>
              <p className="text-foreground/70 mt-2">Track and manage all outstanding debts.</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Record Debt
            </Button>
          </div>
        </FadeInDown>

        {/* Summary Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.1}>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card
                className="p-6 border border-border/50 h-full"
                style={{ background: 'linear-gradient(135deg, rgba(239, 246, 255, 1) 0%, rgba(219, 234, 254, 0.5) 100%)' }}
              >
                <p className="text-sm font-medium text-foreground/70 mb-2">Total Debts</p>
                <p className="text-3xl font-bold text-blue-600">₦{(totalDebt / 1000000).toFixed(1)}M</p>
                <p className="text-xs text-foreground/50 mt-2">{debts.length} total records</p>
              </Card>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card
                className="p-6 border border-border/50 h-full"
                style={{ background: 'linear-gradient(135deg, rgba(254, 242, 242, 1) 0%, rgba(254, 226, 226, 0.55) 100%)' }}
              >
                <p className="text-sm font-medium text-foreground/70 mb-2">Overdue Amount</p>
                <p className="text-3xl font-bold text-red-600">₦{(overdueDebt / 1000).toFixed(0)}K</p>
                <p className="text-xs text-foreground/50 mt-2">{debts.filter((d) => d.status === 'Overdue').length} overdue</p>
              </Card>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card
                className="p-6 border border-border/50 h-full"
                style={{ background: 'linear-gradient(135deg, rgba(240, 253, 244, 1) 0%, rgba(220, 252, 231, 0.55) 100%)' }}
              >
                <p className="text-sm font-medium text-foreground/70 mb-2">Paid Debts</p>
                <p className="text-3xl font-bold text-green-600">₦150K</p>
                <p className="text-xs text-foreground/50 mt-2">{debts.filter((d) => d.status === 'Paid').length} completed</p>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

        {/* Debts Table */}
        <FadeInUp delay={0.4}>
          <Card className="border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Start Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Interest</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {debts.map((debt, idx) => (
                    <motion.tr
                      key={debt.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                      whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
                      className="border-b border-border/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{debt.customer}</td>
                      <td className="px-6 py-4 font-semibold text-foreground">{debt.amount}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{debt.startDate}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{debt.dueDate}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(debt.status)}`}>
                          {debt.status}
                          {debt.status === 'Overdue' && debt.daysOverdue !== null && (
                            <span className="ml-1">({debt.daysOverdue}d)</span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-orange-600 font-semibold">{debt.interestAccrued}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/debts/${debt.id}`}>
                                <Eye className="w-4 h-4" />
                              </Link>
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/debts/${debt.id}`}>
                                <Edit2 className="w-4 h-4" />
                              </Link>
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </FadeInUp>
      </div>
  );
}
