'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Search, Settings, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  const [search, setSearch] = useState('');

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  /**
   * There is no global search endpoint yet, so the box routes to the customer
   * list with the term pre-applied instead of pretending to search everything.
   */
  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = search.trim();
    router.push(term ? `/customers?search=${encodeURIComponent(term)}` : '/customers');
  };

  return (
    <header className="h-14 bg-background/70 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 lg:px-8">
      <form onSubmit={handleSearch} className="flex-1 max-w-md ml-12 lg:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers…"
            aria-label="Search customers"
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-muted/40 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
          />
        </div>
      </form>

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
