'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  MoreHorizontal,
  Eye,
  Filter,
  Download,
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddCustomerDialog } from '@/components/dialogs/add-customer-dialog';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';

const customers = [
  { id: 1, name: 'ABC Stores Ltd', phone: '08012345678', email: 'info@abc.com', totalDebt: '₦250,000', riskLevel: 'Medium' },
  { id: 2, name: 'XYZ Retail', phone: '08098765432', email: 'contact@xyz.com', totalDebt: '₦180,000', riskLevel: 'Low' },
  { id: 3, name: 'Tech Solutions', phone: '09012345678', email: 'hello@techsol.com', totalDebt: '₦320,000', riskLevel: 'High' },
  { id: 4, name: 'Fashion Hub', phone: '07098765432', email: 'shop@fashion.com', totalDebt: '₦150,000', riskLevel: 'Low' },
  { id: 5, name: 'Food & Drinks Co', phone: '08187654321', email: 'sales@food.com', totalDebt: '₦420,000', riskLevel: 'Medium' },
  { id: 6, name: 'Auto Parts Store', phone: '09187654321', email: 'admin@autoparts.com', totalDebt: '₦280,000', riskLevel: 'Low' },
];

const riskFilters = ['All', 'Low', 'Medium', 'High'];

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRisk, setActiveRisk] = useState('All');
  const [addCustomerOpen, setAddCustomerOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [, setSelectedCustomerId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = activeRisk === 'All' || customer.riskLevel === activeRisk;
    return matchesSearch && matchesRisk;
  });

  const totals = {
    all: customers.length,
    low: customers.filter((c) => c.riskLevel === 'Low').length,
    medium: customers.filter((c) => c.riskLevel === 'Medium').length,
    high: customers.filter((c) => c.riskLevel === 'High').length,
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setTimeout(() => {
      setIsDeleting(false);
      setDeleteConfirmOpen(false);
      setSelectedCustomerId(null);
    }, 500);
  };

  const handleAddCustomer = (customer: { name: string; email: string; phone: string }) => {
    console.log('Adding customer:', customer);
  };

  const openDeleteDialog = (customerId: number) => {
    setSelectedCustomerId(customerId);
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
            Customers
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-[-0.02em]">
            All customers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {customers.length} total · {totals.high} need attention
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="rounded-full text-xs h-9">
            <Download className="w-3.5 h-3.5" />
            Export
          </Button>
          <Button
            size="sm"
            onClick={() => setAddCustomerOpen(true)}
            className="rounded-full text-xs h-9 shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Add customer
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search by name or email…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-background border border-border text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-background">
          {riskFilters.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRisk(r)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeRisk === r
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
        <Button variant="outline" size="sm" className="h-10 rounded-lg text-xs">
          <Filter className="w-3.5 h-3.5" />
          More filters
        </Button>
      </div>

      {/* Table card */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">
                  Customer
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">
                  Contact
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">
                  Total debt
                </th>
                <th className="text-left text-[10px] uppercase tracking-widest text-muted-foreground font-medium px-6 py-3">
                  Risk
                </th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, i) => (
                <motion.tr
                  key={customer.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.03 * i }}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <Link href={`/customers/${customer.id}`} className="flex items-center gap-2.5 group/link">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
                        {customer.name.split(' ').slice(0, 2).map((w) => w[0]).join('')}
                      </div>
                      <span className="text-sm font-medium group-hover/link:underline underline-offset-4">
                        {customer.name}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-3.5">
                    <div>
                      <p className="text-sm">{customer.phone}</p>
                      <p className="text-xs text-muted-foreground">{customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm font-medium">{customer.totalDebt}</td>
                  <td className="px-6 py-3.5">
                    <RiskPill level={customer.riskLevel} />
                  </td>
                  <td className="px-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="w-7 h-7 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-muted/60 hover:text-foreground transition-all flex items-center justify-center">
                          <MoreHorizontal className="w-3.5 h-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/customers/${customer.id}`}>
                            <Eye className="w-3.5 h-3.5" /> View
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="text-xs gap-2">
                          <Link href={`/customers/${customer.id}`}>
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(customer.id)}
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
        <div className="px-6 py-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Showing {filteredCustomers.length} of {customers.length}
          </p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Previous
            </Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddCustomerDialog open={addCustomerOpen} onOpenChange={setAddCustomerOpen} onAdd={handleAddCustomer} />
      <DeleteConfirmationDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete customer"
        description="Are you sure you want to delete this customer? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}

function RiskPill({ level }: { level: string }) {
  const map: Record<string, { bg: string; dot: string }> = {
    Low: { bg: 'bg-success/10 text-success', dot: 'bg-success' },
    Medium: { bg: 'bg-warning/15 text-warning', dot: 'bg-warning' },
    High: { bg: 'bg-destructive/10 text-destructive', dot: 'bg-destructive' },
  };
  const s = map[level] ?? { bg: 'bg-muted text-muted-foreground', dot: 'bg-muted-foreground' };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium ${s.bg}`}>
      <span className={`w-1 h-1 rounded-full ${s.dot}`} />
      {level}
    </span>
  );
}
