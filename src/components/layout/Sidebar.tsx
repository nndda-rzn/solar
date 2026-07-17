"use client";

import {
  BookOpen,
  Globe,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  Trophy,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSupabaseLogout } from "@/hooks/useSupabaseLogout";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

interface SidebarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function Sidebar({ isMobileOpen, onMobileClose }: SidebarProps) {
  const t = useTranslations("common");
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    {
      href: "/dashboard" as const,
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
    { href: "/" as const, label: t("nav.explorer"), icon: Rocket },
    { href: "/library" as const, label: t("nav.library"), icon: BookOpen },
    {
      href: "/achievements" as const,
      label: t("nav.achievements"),
      icon: Trophy,
    },
    { href: "/settings" as const, label: t("nav.settings"), icon: Settings },
  ];

  const logout = useSupabaseLogout();

  const isActive = (href: string) =>
    href === "/"
      ? pathname === href || /^\/[a-z]{2}$/.test(pathname)
      : pathname.includes(href);

  const sidebarContent = (
    <>
      {/* Top: brand + nav */}
      <div className="flex flex-col gap-6 p-4">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cosmic-accent/15 ring-1 ring-cosmic-accent/20">
            <Globe className="h-4 w-4 text-cosmic-accent" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white">
              {t("sidebar.brand")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-cosmic-muted">
              {t("sidebar.tagline")}
            </span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-l-2 border-cosmic-accent bg-cosmic-accent/10 text-cosmic-accent"
                    : "text-white/50 hover:bg-white/5 hover:text-white/80"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: help + logout + lang */}
      <div className="flex flex-col gap-2 border-t border-white/[0.06] p-4">
        <Link
          href="/help"
          onClick={onMobileClose}
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname.includes("/help")
              ? "border-l-2 border-cosmic-accent bg-cosmic-accent/10 text-cosmic-accent"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>{t("nav.help")}</span>
        </Link>

        {user && (
          <button
            onClick={logout}
            aria-label={t("nav.logout")}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>{t("nav.logout")}</span>
          </button>
        )}

        <div className="pt-1">
          <LanguageToggle />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col justify-between border-r border-white/[0.06] bg-cosmic-deep lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <aside className="absolute left-0 top-0 h-full w-60 flex-col justify-between border-r border-white/[0.06] bg-cosmic-deep flex">
            <div className="absolute right-3 top-3">
              <button
                onClick={onMobileClose}
                aria-label={t("close")}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-white/60 transition-colors hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
