"use client";

import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({
  children,
  breadcrumb,
}: {
  children: React.ReactNode;
  breadcrumb?: string;
}) {
  return (
    <div className="min-h-screen bg-cosmic-deep">
      <Sidebar />
      <div className="ml-60">
        <TopBar breadcrumb={breadcrumb} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
