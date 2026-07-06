"use client";

import {
  BookOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Rocket,
  Settings,
  Trophy,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/utils/supabase/client";

function LanguageToggle() {
  const t = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs">
      <button
        onClick={() => router.push(pathname, { locale: "en" })}
        aria-label="Switch to English"
        aria-pressed={locale === "en"}
        className={
          locale === "en"
            ? "font-semibold text-cosmic-accent"
            : "text-white/50 hover:text-white/70"
        }
      >
        {t("language.en")}
      </button>
      <span className="text-white/20">|</span>
      <button
        onClick={() => router.push(pathname, { locale: "id" })}
        aria-label="Ganti ke Bahasa Indonesia"
        aria-pressed={locale === "id"}
        className={
          locale === "id"
            ? "font-semibold text-cosmic-accent"
            : "text-white/50 hover:text-white/70"
        }
      >
        {t("language.id")}
      </button>
    </div>
  );
}

export function Sidebar() {
  const t = useTranslations("common");
  const router = useRouter();
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

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/"
      ? pathname === href || /^\/[a-z]{2}$/.test(pathname)
      : pathname.includes(href);

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col justify-between border-r border-white/5 bg-cosmic-deep">
      {/* Top: brand + nav */}
      <div className="flex flex-col gap-6 p-4">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cosmic-accent to-cosmic-glow">
            <span className="h-2 w-2 rounded-full bg-white/90 shadow-[0_0_8px_rgba(124,185,255,0.8)]" />
          </span>
          <span className="flex flex-col leading-tight">
            <span className="text-sm font-bold text-white">
              {t("sidebar.brand")}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-cosmic-glow/60">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "border-l-2 border-cosmic-accent bg-cosmic-accent/15 text-cosmic-accent"
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
      <div className="flex flex-col gap-2 border-t border-white/5 p-4">
        <Link
          href="/help"
          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
            pathname.includes("/help")
              ? "border-l-2 border-cosmic-accent bg-cosmic-accent/15 text-cosmic-accent"
              : "text-white/50 hover:bg-white/5 hover:text-white/80"
          }`}
        >
          <HelpCircle className="h-4 w-4 shrink-0" />
          <span>{t("nav.help")}</span>
        </Link>

        {user && (
          <button
            onClick={handleLogout}
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
    </aside>
  );
}
