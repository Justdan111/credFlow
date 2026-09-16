'use client';

import { AlertTriangle } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { InlineError } from '@/components/feedback/states';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  isLoading?: boolean;
  /** Kept on screen so a failed delete does not silently close the dialog. */
  error?: unknown;
  confirmLabel?: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  isLoading = false,
  error,
  confirmLabel = 'Delete',
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center text-destructive mb-4">
          <AlertTriangle className="w-4 h-4" strokeWidth={2} />
        </div>
        <AlertDialogHeader className="!place-items-start !text-left !grid-rows-none block mb-5">
          <AlertDialogTitle className="text-lg font-semibold tracking-[-0.01em] leading-tight">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground leading-relaxed mt-1.5">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <InlineError error={error} className="mb-3 text-xs" />

        <AlertDialogFooter className="pt-2">
          <AlertDialogCancel variant="outline" size="sm" className="rounded-full h-9 text-xs">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(event) => {
              // The dialog stays open until the request settles, so a failure
              // can be reported in place instead of vanishing.
              event.preventDefault();
              void onConfirm();
            }}
            disabled={isLoading}
            variant="destructive"
            size="sm"
            className="rounded-full h-9 text-xs shadow-sm shadow-destructive/20 ring-1 ring-inset ring-white/10"
          >
            {isLoading ? 'Working…' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
