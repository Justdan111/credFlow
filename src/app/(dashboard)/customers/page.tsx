'use client';


import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Edit2, Trash2, Phone, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FadeInDown, FadeInUp, ScaleIn } from '@/components/animations/motion-wrapper';

const customers = [
  { id: 1, name: 'ABC Stores Ltd', phone: '08012345678', email: 'info@abc.com', totalDebt: '₦250,000', riskLevel: 'Medium' },
  { id: 2, name: 'XYZ Retail', phone: '08098765432', email: 'contact@xyz.com', totalDebt: '₦180,000', riskLevel: 'Low' },
  { id: 3, name: 'Tech Solutions', phone: '09012345678', email: 'hello@techsol.com', totalDebt: '₦320,000', riskLevel: 'High' },
  { id: 4, name: 'Fashion Hub', phone: '07098765432', email: 'shop@fashion.com', totalDebt: '₦150,000', riskLevel: 'Low' },
  { id: 5, name: 'Food & Drinks Co', phone: '08187654321', email: 'sales@food.com', totalDebt: '₦420,000', riskLevel: 'Medium' },
  { id: 6, name: 'Auto Parts Store', phone: '09187654321', email: 'admin@autoparts.com', totalDebt: '₦280,000', riskLevel: 'Low' },
];

const Loading = () => null;

export default function CustomersPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'High':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
      <div className="space-y-8 min-h-screen">
        {/* Header */}
        <FadeInDown>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customers</h1>
              <p className="text-foreground/70 mt-2">Manage your customer database and relationships.</p>
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Add Customer
            </Button>
          </div>
        </FadeInDown>

        {/* Search and filters */}
        <ScaleIn delay={0.1}>
          <Card className="p-6 border border-border/50">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/50" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-10 bg-muted/50 border-border/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline">Filter</Button>
            </div>
          </Card>
        </ScaleIn>

        {/* Customers Table */}
        <FadeInUp delay={0.2}>
          <Card className="border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Contact</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total Debt</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Risk Level</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, idx) => (
                    <motion.tr
                      key={customer.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + idx * 0.05, duration: 0.3 }}
                      whileHover={{ backgroundColor: 'rgba(124, 58, 237, 0.05)' }}
                      className="border-b border-border/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{customer.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-foreground">
                            <Phone className="w-4 h-4 text-foreground/50" />
                            {customer.phone}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-foreground/70">
                            <Mail className="w-4 h-4 text-foreground/50" />
                            {customer.email}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-foreground">{customer.totalDebt}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(customer.riskLevel)}`}>
                          {customer.riskLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button variant="ghost" size="sm">
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.1 }}>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border/50 flex items-center justify-between">
              <p className="text-sm text-foreground/70">Showing {filteredCustomers.length} of {customers.length} customers</p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </Card>
        </FadeInUp>
      </div>
  );
}

export { Loading };
