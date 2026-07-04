'use client';

import type React from 'react';
import { useState } from 'react';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
          }`}
        >
          <Header
            sidebarOpen={!isSidebarCollapsed}
            onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
          <main className="px-4 md:px-6 lg:px-8 py-6 lg:py-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
