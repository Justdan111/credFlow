'use client';

import { Search, Bell, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ModeToggle } from './mood-togggle';

interface HeaderProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function Header({ }: HeaderProps) {
  return (
    <header className="h-14 bg-background/70 backdrop-blur-xl border-b border-border sticky top-0 z-30 flex items-center gap-3 px-4 md:px-6 lg:px-8">
      {/* Search */}
      <div className="flex-1 max-w-md ml-12 lg:ml-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            placeholder="Search customers, debts, invoices…"
            className="w-full h-9 pl-9 pr-16 rounded-lg bg-muted/40 border border-border/60 text-sm placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right cluster */}
      <div className="ml-auto flex items-center gap-1.5">
        <ModeToggle />

        <button
          className="relative w-9 h-9 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-1.5 gap-2 hover:bg-muted/60"
            >
              <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
                AK
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <div className="px-2 py-2">
              <p className="text-sm font-medium">Amina Bello</p>
              <p className="text-xs text-muted-foreground">amina@bellotraders.ng</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm gap-2">
              <User className="w-3.5 h-3.5" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm gap-2">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-sm gap-2 text-destructive focus:text-destructive">
              <LogOut className="w-3.5 h-3.5" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
