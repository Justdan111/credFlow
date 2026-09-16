'use client';

import { useState } from 'react';
import { ArrowRight, UserPlus } from 'lucide-react';

import { ROLE_DESCRIPTIONS, ROLE_LABELS, grantableRoles, type InviteMemberInput } from '@/api/users/users.api';
import { inviteMemberSchema, type InviteMemberValues } from '@/api/users/users.schema';
import { InlineError } from '@/components/feedback/states';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { validateForm, type FieldErrors } from '@/lib/form';

interface InviteMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The caller's role, which caps the roles they may grant. */
  actorRole: string | undefined;
  onSubmit: (input: InviteMemberInput) => Promise<unknown>;
  isSubmitting: boolean;
  error?: unknown;
}

export function InviteMemberDialog({
  open,
  onOpenChange,
  actorRole,
  onSubmit,
  isSubmitting,
  error,
}: InviteMemberDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
          <UserPlus className="w-4 h-4" strokeWidth={2} />
        </div>
        <DialogHeader>
          <DialogTitle>Invite a teammate</DialogTitle>
          <DialogDescription>
            They&apos;ll get an email with a link to set their own password. You never see or
            choose it.
          </DialogDescription>
        </DialogHeader>

        {open && (
          <InviteMemberForm
            actorRole={actorRole}
            onSubmit={onSubmit}
            onClose={() => onOpenChange(false)}
            isSubmitting={isSubmitting}
            error={error}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function InviteMemberForm({
  actorRole,
  onSubmit,
  onClose,
  isSubmitting,
  error,
}: {
  actorRole: string | undefined;
  onSubmit: (input: InviteMemberInput) => Promise<unknown>;
  onClose: () => void;
  isSubmitting: boolean;
  error?: unknown;
}) {
  // Only roles the API will actually accept from this caller. Offering "owner"
  // to an admin would present a choice that comes back as a 403.
  const roles = grantableRoles(actorRole);

  const [values, setValues] = useState({ name: '', email: '', role: 'member' as const });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<InviteMemberValues>>({});

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const result = validateForm(inviteMemberSchema, values);
    setFieldErrors(result.errors ?? {});
    if (!result.success) return;

    try {
      await onSubmit(result.data);
      onClose();
    } catch {
      // The parent owns the mutation error and it is rendered below.
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <FormField label="Name" htmlFor="invite-name" error={fieldErrors.name}>
        <Input
          value={values.name}
          onChange={(event) => setValues({ ...values, name: event.target.value })}
          placeholder="Ben Adeyemi"
          className="h-11 rounded-lg"
        />
      </FormField>

      <FormField label="Work email" htmlFor="invite-email" error={fieldErrors.email}>
        <Input
          type="email"
          value={values.email}
          onChange={(event) => setValues({ ...values, email: event.target.value })}
          placeholder="ben@yourbusiness.com"
          className="h-11 rounded-lg"
        />
      </FormField>

      <FormField
        label="Role"
        htmlFor="invite-role"
        error={fieldErrors.role}
        hint={ROLE_DESCRIPTIONS[values.role]}
      >
        <Select
          value={values.role}
          onChange={(event) =>
            setValues({ ...values, role: event.target.value as typeof values.role })
          }
          className="h-11 rounded-lg"
        >
          {roles.map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </Select>
      </FormField>

      <InlineError
        error={error}
        fallback="We could not send that invitation."
        className="text-xs"
      />

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onClose}
          className="rounded-full h-9 text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="rounded-full h-9 text-xs shadow-sm shadow-primary/20 ring-1 ring-inset ring-white/10"
        >
          {isSubmitting ? 'Sending…' : 'Send invitation'}
          {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
        </Button>
      </DialogFooter>
    </form>
  );
}
