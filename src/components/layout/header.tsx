'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GlobalSearch } from '@/components/layout/global-search';
import { useSession } from '@/components/providers/session-provider';
import { initials } from '@/lib/format';
import { ModeToggle } from './mood-togggle';

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({}: HeaderProps) {
  const router = useRouter();
  const { user, business, signOut, isSigningOut } = useSession();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <header className="h-14 bg-background/70 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 lg:px-8">
      <GlobalSearch />

      <div className="ml-auto flex items-center gap-1.5">
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-1.5 gap-2 hover:bg-muted/60"
              aria-label="Account menu"
            >
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
                {initials(user?.name)}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <div className="px-2 py-2">
              <p className="text-sm font-medium truncate">{user?.name ?? 'Your account'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email ?? ''}</p>
              {business && (
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 truncate">
                  {business.name}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild className="text-sm gap-2">
              <Link href="/settings">
                <User className="w-3.5 h-3.5" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="text-sm gap-2">
              <Link href="/settings">
                <Settings className="w-3.5 h-3.5" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                void handleSignOut();
              }}
              disabled={isSigningOut}
              className="text-sm gap-2 text-destructive focus:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5" />
              {isSigningOut ? 'Signing out…' : 'Log out'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
