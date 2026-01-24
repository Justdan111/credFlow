"use client";
import type React from "react";

import { useState } from "react";
import { SidebarProvider } from "@/components/layout/sidebar-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Track the collapsed state of sidebar
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);




 


  console.log("Dashboard Layout - Rendering dashboard");
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <Sidebar onCollapseChange={setIsSidebarCollapsed} />
        <div
          className={`transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
        >
          <Header sidebarOpen={!isSidebarCollapsed} onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
          <main className="p-4 md:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
