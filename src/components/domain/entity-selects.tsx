'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { useCustomers } from '@/api/customers/customers.queries';
import { useCustomerDebts } from '@/api/debts/debts.queries';
import { MAX_PAGE_SIZE } from '@/api/types';
import { useSession } from '@/components/providers/session-provider';
import { FormField } from '@/components/ui/form-field';
import { Select } from '@/components/ui/select';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import { formatCurrency, formatDate } from '@/lib/format';

/** Pickers that resolve to real UUIDs; the API matches on id, never on name. */

interface CustomerSelectProps {
  value: string;
  onChange: (customerId: string) => void;
  error?: string;
  id?: string;
  label?: string;
}

export function CustomerSelect({
  value,
  onChange,
  error,
  id = 'customerId',
  label = 'Customer',
}: CustomerSelectProps) {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search);

  const customersQuery = useCustomers({
    search: debouncedSearch.trim() || undefined,
    pageSize: MAX_PAGE_SIZE,
    sort: 'name',
  });

  const customers = customersQuery.data?.items ?? [];
  const isEmpty = !customersQuery.isPending && customers.length === 0;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customers…"
          aria-label="Search customers"
          className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10"
        />
      </div>

      <FormField
        label={label}
        htmlFor={id}
        error={error}
        hint={isEmpty ? 'No customers match. Add one first.' : undefined}
      >
        <Select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={customersQuery.isPending}
          className="h-11 rounded-lg bg-background/80"
        >
          <option value="">
            {customersQuery.isPending ? 'Loading customers…' : 'Select a customer'}
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      </FormField>
    </div>
  );
}

interface DebtSelectProps {
  customerId: string;
  value: string;
  onChange: (debtId: string) => void;
  error?: string;
  id?: string;
}

/** Open debts for one customer. The empty option is a real choice: a payment
 *  can credit the customer's balance without naming a debt. */
export function DebtSelect({ customerId, value, onChange, error, id = 'debtId' }: DebtSelectProps) {
  const { currency } = useSession();
  const debtsQuery = useCustomerDebts(
    customerId,
    { pageSize: MAX_PAGE_SIZE, sort: 'dueDate' },
    Boolean(customerId),
  );

  const openDebts = (debtsQuery.data?.items ?? []).filter((debt) => debt.status !== 'paid');

  return (
    <FormField
      label="Apply to debt"
      htmlFor={id}
      error={error}
      hint={
        !customerId
          ? 'Choose a customer first'
          : openDebts.length === 0 && !debtsQuery.isPending
            ? 'This customer has no open debts'
            : 'Optional — leave unattributed to credit the balance only'
      }
    >
      <Select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={!customerId || debtsQuery.isPending}
        className="h-11 rounded-lg bg-background/80"
      >
        <option value="">Not linked to a debt</option>
        {openDebts.map((debt) => (
          <option key={debt.id} value={debt.id}>
            {`${formatCurrency(debt.amountRemaining, currency)} remaining · due ${formatDate(debt.dueDate)}`}
          </option>
        ))}
      </Select>
    </FormField>
  );
}
