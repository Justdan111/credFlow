'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Receipt,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

const workspace = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Customers', href: '/customers', icon: Users },
  { label: 'Debts', href: '/debts', icon: Receipt },
  { label: 'Payments', href: '/payments', icon: Wallet },
];

const insights = [
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobile = () => setIsOpen(!isOpen);

  const toggleCollapse = () => {
    const next = !isCollapsed;
    setIsCollapsed(next);
    onCollapseChange?.(next);
    window.dispatchEvent(
      new CustomEvent('sidebarStateChange', { detail: { isCollapsed: next } })
    );
  };

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          'fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden',
          isOpen ? 'block' : 'hidden'
        )}
        onClick={toggleMobile}
      />

      {/* Mobile toggle FAB (visible when closed) */}
      {!isOpen && (
        <button
          onClick={toggleMobile}
          className="lg:hidden fixed top-4 left-4 z-30 w-9 h-9 rounded-lg border border-border bg-background/80 backdrop-blur-md flex items-center justify-center"
          aria-label="Open menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-background border-r border-border',
          'transition-all duration-300 ease-in-out flex flex-col',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          isCollapsed ? 'lg:w-16 w-64' : 'w-64'
        )}
      >
        {/* Brand row */}
        <div
          className={cn(
            'h-14 flex items-center border-b border-border',
            isCollapsed ? 'lg:justify-center px-2' : 'px-4'
          )}
        >
          <Link href="/" className={cn('flex items-center gap-2 group', isCollapsed && 'lg:justify-center')}>
            <div className="w-7 h-7 rounded-lg bg-foreground flex items-center justify-center shrink-0">
              <Wallet className="w-3.5 h-3.5 text-background" strokeWidth={2} />
            </div>
            <span
              className={cn(
                'font-semibold tracking-tight text-[14px]',
                isCollapsed && 'lg:hidden'
              )}
            >
              CredFlow
            </span>
          </Link>

          {/* Mobile close */}
          <button
            onClick={toggleMobile}
            className="ml-auto lg:hidden w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Desktop collapse */}
          <button
            onClick={toggleCollapse}
            className={cn(
              'hidden lg:flex ml-auto w-7 h-7 rounded-md items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/60 transition',
              isCollapsed && 'lg:absolute lg:right-2'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronsRight className="w-4 h-4" />
            ) : (
              <ChevronsLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-5 space-y-6">
          <NavSection
            label="Workspace"
            items={workspace}
            pathname={pathname}
            isCollapsed={isCollapsed}
            onNavigate={() => setIsOpen(false)}
          />
          <NavSection
            label="Insights"
            items={insights}
            pathname={pathname}
            isCollapsed={isCollapsed}
            onNavigate={() => setIsOpen(false)}
          />
        </nav>

        {/* Footer / user */}
        <div className="border-t border-border p-3">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold">
                AK
              </div>
              <Link
                href="/"
                className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted/60 transition"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center text-[11px] font-semibold shrink-0">
                AK
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">Amina Bello</p>
                <p className="text-[10px] text-muted-foreground truncate">
                  amina@bellotraders.ng
                </p>
              </div>
              <Link
                href="/"
                className="w-7 h-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted/60 transition"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function NavSection({
  label,
  items,
  pathname,
  isCollapsed,
  onNavigate,
}: {
  label: string;
  items: { label: string; href: string; icon: React.ComponentType<{ className?: string; strokeWidth?: number }> }[];
  pathname: string;
  isCollapsed: boolean;
  onNavigate: () => void;
}) {
  return (
    <div className={cn(isCollapsed ? 'lg:px-2 px-3' : 'px-3')}>
      {!isCollapsed && (
        <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/70 font-medium px-2 mb-2">
          {label}
        </p>
      )}
      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                'flex items-center rounded-lg text-sm transition-all duration-150 group relative',
                isActive
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50',
                isCollapsed ? 'lg:justify-center lg:px-2 px-2.5 py-2 gap-3' : 'px-2.5 py-2 gap-3'
              )}
              title={isCollapsed ? item.label : ''}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary" />
              )}
              <Icon
                className={cn('w-4 h-4 shrink-0', isActive && 'text-foreground')}
                strokeWidth={isActive ? 2 : 1.75}
              />
              {(!isCollapsed || (isCollapsed && false)) && (
                <span className={cn(isCollapsed && 'lg:hidden')}>{item.label}</span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
