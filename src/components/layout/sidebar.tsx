'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  BarChart3,
  Settings,
  Menu,
  DollarSign,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function Sidebar({ onCollapseChange }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const toggleCollapse = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    
    // Notify parent component through prop callback
    if (onCollapseChange) {
      onCollapseChange(newCollapsedState);
    }
    
    // Also dispatch a custom event for components that can't receive props directly
    const event = new CustomEvent('sidebarStateChange', { 
      detail: { isCollapsed: newCollapsedState } 
    });
    window.dispatchEvent(event);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Customers',
      href: '/customers',
      icon: Users,
    },
    {
      label: 'Debts',
      href: '/debts',
      icon: FileText,
    },
    {
      label: 'Payments',
      href: '/payments',
      icon: CreditCard,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden shadow-2xl",
          isOpen ? "block" : "hidden"
        )}
        onClick={toggle}
      />
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-background",
          "transition-all duration-300 ease-in-out",
           "border-r",
          
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          isCollapsed ? "lg:w-20" : "w-72"
        )}
      >
        <div className="flex h-14 items-center  px-4">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-linear-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-purple-500/50 transition">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-sidebar-foreground">CredFlow</span>
            </Link>
          )}
          <Button variant="ghost" size="icon" className="ml-auto lg:hidden" onClick={toggle}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="hidden lg:flex ml-auto" 
            onClick={toggleCollapse}
          >
            {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </Button>
        </div>
        <div className="flex flex-col h-[calc(100vh-3.5rem)]">
          <div className="flex-1 overflow-auto py-6">
            <nav className={cn("grid gap-1", isCollapsed ? "px-1" : "px-2")}>
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className={cn(
                      "flex items-center rounded-lg transition-all duration-200",
                      isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-md'
                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                      isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2 gap-3"
                    )}
                    title={isCollapsed ? item.label : ""}
                  >
                    <Icon className="h-5 w-5" />
                    {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Footer */}
          <div className={cn(
            " space-y-2",
            isCollapsed ? "p-2" : "p-4"
          )}>
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
                isCollapsed ? "px-2 py-2 justify-center" : "px-4 py-3 gap-3"
              )}
              title={isCollapsed ? "Logout" : ""}
            >
              <LogOut className="w-5 h-5" />
              {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
            </Link>
            {!isCollapsed && (
              <p className="text-xs text-sidebar-foreground/50 px-4 py-2">v1.0.0</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;