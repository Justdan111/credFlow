'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DollarSign, AlertCircle, Users, TrendingUp, ArrowUp, ArrowDown, } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';
import { FadeInUp, FadeInDown, StaggerContainer, StaggerItem } from '@/components/animations/motion-wrapper';

const data = [
  { month: 'Jan', collections: 65000, outstanding: 120000 },
  { month: 'Feb', collections: 78000, outstanding: 105000 },
  { month: 'Mar', collections: 85000, outstanding: 95000 },
  { month: 'Apr', collections: 92000, outstanding: 82000 },
  { month: 'May', collections: 88000, outstanding: 90000 },
  { month: 'Jun', collections: 105000, outstanding: 75000 },
];

const riskData = [
  { name: 'Low Risk', value: 45, color: '#22c55e' },
  { name: 'Medium Risk', value: 35, color: '#f59e0b' },
  { name: 'High Risk', value: 20, color: '#ef4444' },
];

const recentDebts = [
  { id: 1, customer: 'ABC Stores Ltd', amount: '₦250,000', dueDate: '2026-02-15', status: 'Overdue', daysOverdue: 5 },
  { id: 2, customer: 'XYZ Retail', amount: '₦180,000', dueDate: '2026-02-20', status: 'Overdue', daysOverdue: 0 },
  { id: 3, customer: 'Tech Solutions', amount: '₦320,000', dueDate: '2026-03-10', status: 'Pending', daysOverdue: null },
  { id: 4, customer: 'Fashion Hub', amount: '₦150,000', dueDate: '2026-02-10', status: 'Paid', daysOverdue: null },
  { id: 5, customer: 'Food & Drinks Co', amount: '₦420,000', dueDate: '2026-03-05', status: 'Pending', daysOverdue: null },
];

export default function DashboardPage() {
  const router = useRouter();

  // Removed unused mounted state and effect

  const metrics = [
    {
      label: 'Total Outstanding Debt',
      value: '₦2.5M',
      change: '+5.2%',
      changeType: 'up',
      icon: DollarSign,
      color: 'bg-blue-100 dark:bg-blue-900/30',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Overdue Debts',
      value: '₦650K',
      change: '-12.3%',
      changeType: 'down',
      icon: AlertCircle,
      color: 'bg-red-100 dark:bg-red-900/30',
      iconColor: 'text-red-600',
    },
    {
      label: 'Total Customers',
      value: '1,234',
      change: '+8.7%',
      changeType: 'up',
      icon: Users,
      color: 'bg-purple-100 dark:bg-purple-900/30',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Monthly Collections',
      value: '₦1.2M',
      change: '+23.5%',
      changeType: 'up',
      icon: TrendingUp,
      color: 'bg-green-100 dark:bg-green-900/30',
      iconColor: 'text-green-600',
    },
  ];

  return (
      <div className="space-y-8">
        {/* Header */}
        <FadeInDown>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-foreground/70 mt-2">Welcome back! Here&apos;s your business overview.</p>
            </div>
          </div>
        </FadeInDown>

        {/* Metrics Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="h-full"
                >
                  <Card
                    className="p-6  hover:border-purple-300 transition-all duration-300 hover:shadow-lg group h-full"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`${metric.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className={`${metric.iconColor} w-6 h-6`} />
                      </div>
                      <div className="flex items-center gap-1">
                        {metric.changeType === 'up' ? (
                          <ArrowUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <ArrowDown className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm font-semibold text-green-600">{metric.change}</span>
                      </div>
                    </div>
                    <p className="text-foreground/70 text-sm mb-2">{metric.label}</p>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
          {/* Line Chart */}
          <FadeInUp delay={0.3}>
            <Card className="lg:col-span-2 p-6 border border-border/50 h-120">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Collections vs Outstanding</h3>
                <p className="text-sm text-foreground/70 mt-1">Monthly trend analysis</p>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
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
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="collections"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="outstanding"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: '#ef4444', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </FadeInUp>

          {/* Pie Chart */}
          <FadeInUp delay={0.4}>
            <Card className="p-6 border border-border/50 h-120">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground">Risk Distribution</h3>
                <p className="text-sm text-foreground/70 mt-1">Customer segmentation</p>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </FadeInUp>
        </div>

        {/* Recent Debts Table */}
        <FadeInUp delay={0.5}>
          <Card className="border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Debts</h3>
                  <p className="text-sm text-foreground/70 mt-1">Last 5 transactions</p>
                </div>
                <Button onClick={() => router.push('/debts')} variant="outline" size="sm">View All</Button>
              </div>
            </div>

            {/* Animated Table */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/50 bg-muted/50">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Amount</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Due Date</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDebts.map((debt, idx) => (
                      <motion.tr
                        key={debt.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + idx * 0.05, duration: 0.3 }}
                        whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
                        className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{debt.customer}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{debt.amount}</td>
                        <td className="px-6 py-4 text-sm text-foreground">{debt.dueDate}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              debt.status === 'Paid'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                : debt.status === 'Overdue'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            }`}
                          >
                            {debt.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-sm text-foreground">
                          {debt.daysOverdue !== null ? (
                            <span className="text-red-600 font-semibold">-{debt.daysOverdue}</span>
                          ) : (
                            '-'
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </Card>
        </FadeInUp>
      </div>
  );
}
