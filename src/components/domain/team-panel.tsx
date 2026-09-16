'use client';

import { useState } from 'react';
import { MailCheck, MoreHorizontal, Trash2, UserPlus } from 'lucide-react';

import { ApiError } from '@/api/errors';
import {
  ROLE_LABELS,
  grantableRoles,
  isInvitationPending,
  type Member,
  type UserRole,
} from '@/api/users/users.api';
import {
  useInviteMember,
  useMembers,
  useRemoveMember,
  useUpdateMember,
} from '@/api/users/users.queries';
import { DeleteConfirmationDialog } from '@/components/dialogs/delete-confirmation-dialog';
import { InviteMemberDialog } from '@/components/dialogs/invite-member-dialog';
import { EmptyState, ErrorState, InlineError, LoadingState } from '@/components/feedback/states';
import { useSession } from '@/components/providers/session-provider';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { formatRelative, initials } from '@/lib/format';

/**
 * Team management.
 *
 * Roles existed from the first migration but there was no way to create a
 * second user, so this is the screen that makes them mean anything.
 */
export function TeamPanel() {
  const { user, role, canAdminister, isOwner } = useSession();

  const membersQuery = useMembers();
  const inviteMember = useInviteMember();
  const removeMember = useRemoveMember();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<Member | null>(null);

  const members = membersQuery.data?.items ?? [];
  const owners = members.filter((member) => member.role === 'owner');

  const handleRemove = async () => {
    if (!pendingRemoval) return;
    try {
      await removeMember.mutateAsync(pendingRemoval.id);
      setPendingRemoval(null);
    } catch {
      // Shown inside the dialog from the mutation's error state.
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold">Team</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Who can sign in to this business, and what they may do.
            </p>
          </div>
          {canAdminister && (
            <Button
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              className="rounded-full text-xs h-9 shrink-0 ring-1 ring-inset ring-white/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Invite
            </Button>
          )}
        </div>

        {membersQuery.isPending ? (
          <LoadingState label="Loading your team…" />
        ) : membersQuery.isError ? (
          <ErrorState
            error={membersQuery.error}
            fallback="We could not load your team."
            onRetry={() => membersQuery.refetch()}
          />
        ) : members.length === 0 ? (
          <EmptyState title="No teammates yet" description="Invite somebody to work alongside you." />
        ) : (
          <ul className="space-y-2">
            {members.map((member) => (
              <MemberRow
                key={member.id}
                member={member}
                isSelf={member.id === user?.id}
                actorRole={role}
                canAdminister={canAdminister}
                canRemove={isOwner}
                // The API refuses to demote or remove the final owner; hiding
                // those controls says so before the request is sent.
                isLastOwner={member.role === 'owner' && owners.length <= 1}
                onRequestRemoval={() => setPendingRemoval(member)}
              />
            ))}
          </ul>
        )}

        {!canAdminister && (
          <p className="mt-4 text-xs text-muted-foreground rounded-lg border border-border bg-muted/30 p-3">
            Only an owner or admin can invite teammates or change roles.
          </p>
        )}
      </div>

      <InviteMemberDialog
        open={isInviteOpen}
        onOpenChange={setIsInviteOpen}
        actorRole={role}
        onSubmit={(input) => inviteMember.mutateAsync(input)}
        isSubmitting={inviteMember.isPending}
        error={inviteMember.error}
      />

      <DeleteConfirmationDialog
        open={pendingRemoval !== null}
        onOpenChange={(open) => !open && setPendingRemoval(null)}
        title="Remove teammate"
        description={
          pendingRemoval
            ? `${pendingRemoval.name} will be signed out everywhere and will no longer be able to sign in. Anything they recorded stays on your books.`
            : ''
        }
        onConfirm={handleRemove}
        isLoading={removeMember.isPending}
        error={removeMember.error}
        confirmLabel="Remove"
      />
    </div>
  );
}

function MemberRow({
  member,
  isSelf,
  actorRole,
  canAdminister,
  canRemove,
  isLastOwner,
  onRequestRemoval,
}: {
  member: Member;
  isSelf: boolean;
  actorRole: string | undefined;
  canAdminister: boolean;
  canRemove: boolean;
  isLastOwner: boolean;
  onRequestRemoval: () => void;
}) {
  const updateMember = useUpdateMember(member.id);

  // You may only change somebody whose role you could also grant, which is the
  // same rule the API enforces.
  const mayEditRole = canAdminister && !isLastOwner && grantableRoles(actorRole).includes(member.role as UserRole);
  const mayRemove = canRemove && !isSelf && !isLastOwner;

  return (
    <li className="flex items-center justify-between gap-4 p-4 rounded-lg border border-border">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
          {initials(member.name)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium truncate">{member.name}</p>
            {isSelf && (
              <span className="text-[10px] font-medium uppercase tracking-widest bg-muted text-muted-foreground px-1.5 py-0.5 rounded shrink-0">
                You
              </span>
            )}
            {isInvitationPending(member) && (
              <span
                title="They have not signed in yet"
                className="text-[10px] font-medium uppercase tracking-widest bg-warning/15 text-warning px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-1"
              >
                <MailCheck className="w-2.5 h-2.5" />
                Invited
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            {member.email}
            {member.lastActiveAt && ` · last seen ${formatRelative(member.lastActiveAt)}`}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {mayEditRole ? (
          <Select
            aria-label={`Role for ${member.name}`}
            value={member.role}
            disabled={updateMember.isPending}
            onChange={(event) =>
              updateMember.mutate({ role: event.target.value as UserRole })
            }
            className="h-8 w-28 text-xs rounded-lg"
          >
            {grantableRoles(actorRole).map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </Select>
        ) : (
          <span
            title={isLastOwner ? 'A business must keep at least one owner' : undefined}
            className="text-xs text-muted-foreground px-2 capitalize"
          >
            {ROLE_LABELS[member.role as UserRole] ?? member.role}
          </span>
        )}

        {mayRemove ? (
          <button
            type="button"
            onClick={onRequestRemoval}
            aria-label={`Remove ${member.name}`}
            className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted/60 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="w-8 h-8 flex items-center justify-center text-muted-foreground/30">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </span>
        )}
      </div>

      {updateMember.isError && (
        <InlineError
          error={updateMember.error}
          fallback={
            updateMember.error instanceof ApiError && updateMember.error.isConflict
              ? 'A business must keep at least one owner.'
              : 'We could not change that role.'
          }
          className="text-xs"
        />
      )}
    </li>
  );
}
