'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Wallet, ArrowRight } from 'lucide-react';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecord?: (payment: { customer: string; amount: string; date: string; method: string }) => void;
}

const methods = [
  { id: 'bank-transfer', label: 'Bank Transfer' },
  { id: 'cash', label: 'Cash' },
  { id: 'paystack', label: 'Paystack' },
  { id: 'flutterwave', label: 'Flutterwave' },
];

export function RecordPaymentDialog({ open, onOpenChange, onRecord }: RecordPaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer: '',
    amount: '',
    date: '',
    method: 'bank-transfer',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      if (onRecord) onRecord(formData);
      setFormData({ customer: '', amount: '', date: '', method: 'bank-transfer' });
      setIsLoading(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <Wallet className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Record a payment</DialogTitle>
          <DialogDescription>
            Log the payment received. We&apos;ll match it to the customer&apos;s balance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Customer">
            <Input
              placeholder="Select or enter customer"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              required
              className="h-11 rounded-lg bg-background/80 border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-foreground font-medium">
                  ₦
                </span>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                  className="pl-8 h-11 rounded-lg bg-background/80 border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
                />
              </div>
            </Field>

            <Field label="Date">
              <Input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="h-11 rounded-lg bg-background/80 border-border focus-visible:border-primary/40 focus-visible:ring-primary/15"
              />
            </Field>
          </div>

          <Field label="Payment method">
            <div className="grid grid-cols-2 gap-2">
              {methods.map((m) => {
                const isActive = formData.method === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, method: m.id })}
                    className={`text-center py-2.5 rounded-lg border text-xs font-medium transition-colors ${
                      isActive
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>
          </Field>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="rounded-full h-9 text-xs"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isLoading}
              className="rounded-full h-9 text-xs shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
            >
              {isLoading ? 'Recording…' : 'Record payment'}
              {!isLoading && <ArrowRight className="w-3.5 h-3.5" />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
