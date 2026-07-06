"use client";

import { Navbar } from "./Navbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cosmic-deep">
      <Navbar />
      <main className="pt-12">{children}</main>
    </div>
  );
}
