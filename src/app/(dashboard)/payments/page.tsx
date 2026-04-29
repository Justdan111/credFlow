'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter } from 'lucide-react';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { FadeInDown, FadeInUp, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

const payments = [
  { id: 1, customer: 'ABC Stores Ltd', amount: '₦50,000', date: '2026-02-10', method: 'Bank Transfer', reference: 'TRF001' },
  { id: 2, customer: 'XYZ Retail', amount: '₦45,000', date: '2026-02-08', method: 'Cash', reference: 'CASH001' },
  { id: 3, customer: 'Fashion Hub', amount: '₦150,000', date: '2026-02-05', method: 'Bank Transfer', reference: 'TRF002' },
  { id: 4, customer: 'Tech Solutions', amount: '₦80,000', date: '2026-02-01', method: 'Mobile Money', reference: 'MM001' },
  { id: 5, customer: 'Food & Drinks Co', amount: '₦120,000', date: '2026-01-28', method: 'Bank Transfer', reference: 'TRF003' },
];

const chartData = [
  { month: 'Week 1', amount: 150000 },
  { month: 'Week 2', amount: 180000 },
  { month: 'Week 3', amount: 165000 },
  { month: 'Week 4', amount: 210000 },
];

export default function PaymentsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalCollected = payments.reduce((sum, p) => sum + parseInt(p.amount.replace(/[^0-9]/g, '')), 0);
  const avgPayment = totalCollected / payments.length;

  return (
      <div className="space-y-8">
        {/* Header */}
        <FadeInDown>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Payments</h1>
              <p className="text-foreground/70 mt-2">View and manage all payment transactions.</p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="bg-purple-600 hover:bg-purple-700 flex-1 sm:flex-none">
                <Plus className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </FadeInDown>

        {/* Summary Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" delay={0.1}>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="p-6 border border-border/50 bg-linear-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-900/10 h-full">
                <p className="text-sm font-medium text-foreground/70 mb-2">Total Collected</p>
                <p className="text-3xl font-bold text-green-600">₦{(totalCollected / 1000).toFixed(0)}K</p>
                <p className="text-xs text-foreground/50 mt-2">This month</p>
              </Card>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="p-6 border border-border/50 bg-linear-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 h-full">
                <p className="text-sm font-medium text-foreground/70 mb-2">Avg Payment</p>
                <p className="text-3xl font-bold text-blue-600">₦{(avgPayment / 1000).toFixed(0)}K</p>
                <p className="text-xs text-foreground/50 mt-2">{payments.length} transactions</p>
              </Card>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div whileHover={{ scale: 1.02, y: -4 }} className="h-full">
              <Card className="p-6 border border-border/50 bg-linear-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-900/10 h-full">
                <p className="text-sm font-medium text-foreground/70 mb-2">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">98%</p>
                <p className="text-xs text-foreground/50 mt-2">All successful</p>
              </Card>
            </motion.div>
          </StaggerItem>
        </StaggerContainer>

         {/* Payments Table */}
        <FadeInUp delay={0.4}>
          <Card className="border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Recent Payments</h3>
                <p className="text-sm text-foreground/70 mt-1">Last 5 transactions</p>
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Method</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <motion.tr
                      key={payment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                      whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
                      className="border-b border-border/50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-foreground">{payment.customer}</td>
                      <td className="px-6 py-4 font-semibold text-green-600">{payment.amount}</td>
                      <td className="px-6 py-4 text-sm text-foreground/70">{payment.date}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground/70 font-mono">{payment.reference}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
              <p className="text-sm text-foreground/70">Showing {payments.length} payments</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </Card>
        </FadeInUp>

        {/* Chart */}
        <FadeInUp delay={0.3}>
          <Card className="p-6 border border-border/50">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground">Weekly Collections</h3>
              <p className="text-sm text-foreground/70 mt-1">Payment trends this month</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9',
                  }}
                />
                <Bar dataKey="amount" fill="#7c3aed" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </FadeInUp>

       
      </div>
  );
}
