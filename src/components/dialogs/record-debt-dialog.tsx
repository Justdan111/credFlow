'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { TrendingDown, DollarSign, CalendarDays } from 'lucide-react';

interface RecordDebtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRecord?: (debt: { customer: string; amount: string; dueDate: string }) => void;
}

export function RecordDebtDialog({ open, onOpenChange, onRecord }: RecordDebtDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ customer: '', amount: '', dueDate: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (onRecord) onRecord(formData);
      setFormData({ customer: '', amount: '', dueDate: '' });
      setIsLoading(false);
      onOpenChange(false);
    }, 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-background border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground flex items-center gap-2">
            <TrendingDown className="w-5 h-5" />
            Record New Debt
          </DialogTitle>
          <DialogDescription className="text-foreground/70">Enter debt details to track a new outstanding balance.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customer" className="text-sm font-medium">
              Customer Name
            </Label>
            <Input
              id="customer"
              placeholder="Select or enter customer"
              value={formData.customer}
              onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
              required
              className="bg-muted/50 border-border/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium">
              Debt Amount
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
              <Input
                id="amount"
                type="number"
                placeholder="250,000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate" className="text-sm font-medium">
              Due Date
            </Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
                className="pl-10 bg-muted/50 border-border/50"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-transparent border-border"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? 'Recording...' : 'Record Debt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
