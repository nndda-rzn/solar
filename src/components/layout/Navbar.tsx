"use client";

import {
  Globe,
  LogOut,
  UserRound,
  Sparkles,
  Rocket,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { createClient } from "@/utils/supabase/client";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/navigation";

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

export function Navbar() {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const { totalXp } = useAchievements();
  const level = Math.floor(totalXp / 100);
  const xpInLevel = totalXp % 100;

  const navItems = [
    {
      href: "/dashboard" as const,
      label: t("nav.dashboard"),
      icon: LayoutDashboard,
    },
    {
      href: "/" as const,
      label: t("nav.explorer"),
      icon: Rocket,
    },
    {
      href: "/profile" as const,
      label: t("nav.profile"),
      icon: UserRound,
    },
  ];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/5 bg-cosmic-deep/80 px-4 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm font-bold text-white"
        >
          <Globe className="h-4 w-4 text-cosmic-accent" />
          <span>{t("header.title")}</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/"
                ? pathname === href || /^\/[a-z]{2}$/.test(pathname)
                : pathname.includes(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors ${
                  isActive
                    ? "bg-cosmic-accent/20 text-cosmic-accent"
                    : "text-white/50 hover:text-white/70"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <div className="flex items-center gap-1.5 rounded-lg border border-yellow-400/20 bg-yellow-400/5 px-2.5 py-1.5">
            <Sparkles className="h-3 w-3 text-yellow-400" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-yellow-400/80">
              {t("header.level")}
            </span>
            <span className="font-mono text-xs font-bold text-yellow-400">
              {level}
            </span>
            <span className="text-[9px] text-white/30">{xpInLevel}/100</span>
          </div>
        )}
        <LanguageToggle />
        {user && (
          <button
            onClick={handleLogout}
            aria-label={t("nav.exit")}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-red-400/40 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
