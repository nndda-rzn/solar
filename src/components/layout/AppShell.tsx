"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb?: string | undefined;
}) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cosmic-deep">
      <Sidebar
        isMobileOpen={isMobileNavOpen}
        onMobileClose={() => setIsMobileNavOpen(false)}
      />
      <div className="lg:ml-60">
        <TopBar
          breadcrumb={breadcrumb}
          onMenuClick={() => setIsMobileNavOpen(true)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
