"use client";

import { useState, useRef } from "react";
import {
  Globe,
  Search,
  LogOut,
  Bookmark,
  Sparkles,
  Settings as SettingsIcon,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useSupabaseLogout } from "@/hooks/useSupabaseLogout";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatSimDate } from "@/lib/utils/format";
import { LanguageToggle } from "@/components/layout/LanguageToggle";

function UserMenu() {
  const t = useTranslations("common");
  const { user } = useAuth();
  const logout = useSupabaseLogout();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  if (!user) return null;

  const initial = user.email?.[0]?.toUpperCase() ?? "?";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("topbar.account")}
        className="flex items-center gap-1 rounded-lg p-0.5 transition-colors hover:bg-white/5"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-cosmic-accent/10 text-xs font-bold text-cosmic-accent">
          {initial}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-white/10 bg-cosmic-deep/95 p-2 shadow-xl shadow-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-cosmic-accent/10 text-xs font-bold text-cosmic-accent">
              {initial}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs text-white/70">
              {user.email}
            </span>
          </div>

          <div className="my-1 border-t border-white/5" />

          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-3 py-2 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
          >
            {t("nav.profile")}
          </Link>

          <div className="my-1 border-t border-white/5" />

          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <span className="text-xs text-white/40">EN | ID</span>
            <LanguageToggle />
          </div>

          <div className="my-1 border-t border-white/5" />

          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-white/60 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            {t("nav.logout")}
          </button>
        </div>
      )}
    </div>
  );
}

export function HeaderBar() {
  const t = useTranslations("common");
  const dayOffset = useSimulationStore((s) => s.dayOffset);
  const toggleSearch = useExplorerStore((s) => s.toggleSearch);
  const toggleBookmarkModal = useExplorerStore((s) => s.toggleBookmarkModal);
  const toggleSettings = useExplorerStore((s) => s.toggleSettings);
  const { isAuthenticated } = useAuth();
  const { totalXp } = useAchievements();
  const level = Math.floor(totalXp / 100);

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-0 z-50 flex h-12 items-center justify-between border-b border-white/5 bg-cosmic-deep/80 px-4 backdrop-blur-md">
      {/* Left: Brand + Nav */}
      <div className="flex items-center gap-3">
        <Globe className="h-4 w-4 text-cosmic-accent" />
        <span className="text-sm font-bold text-white">
          {t("header.title")}
        </span>
        <Link
          href="/dashboard"
          aria-label={t("nav.exit")}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:border-white/20 hover:text-white/70"
        >
          <LayoutDashboard className="h-3 w-3" />
          <span className="hidden sm:inline">{t("nav.exit")}</span>
        </Link>
      </div>

      {/* Right: Actions cluster + Status + Account */}
      <div className="flex items-center gap-3">
        {/* Actions cluster */}
        <div className="flex items-center gap-1 border-l border-white/10 pl-3">
          <button
            onClick={toggleSearch}
            aria-label={t("header.search")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            <Search className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t("header.search")}</span>
            <kbd className="hidden md:inline-block rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">
              ⌘K
            </kbd>
          </button>
          <button
            onClick={toggleBookmarkModal}
            aria-label={t("header.bookmark")}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span className="hidden md:inline">{t("header.bookmark")}</span>
            <kbd className="hidden md:inline-block rounded border border-white/10 bg-white/5 px-1 py-0.5 text-[9px]">
              ⌘B
            </kbd>
          </button>
          <button
            onClick={toggleSettings}
            aria-label={t("settings.title")}
            className="flex items-center justify-center rounded-lg px-2.5 py-1.5 text-white/50 transition-colors hover:bg-white/5 hover:text-white/70"
          >
            <SettingsIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Status: Date + Level */}
        <div className="flex items-center gap-3 border-l border-white/10 pl-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
              {t("header.date")}
            </span>
            <span className="font-mono text-xs text-white/80">
              {formatSimDate(dayOffset)}
            </span>
          </div>
          {isAuthenticated && (
            <span className="flex items-center gap-1.5 rounded-lg border border-cosmic-accent/20 bg-cosmic-accent/5 px-2 py-1">
              <Sparkles className="h-3 w-3 text-cosmic-accent" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cosmic-accent/80">
                {t("topbar.level")}
              </span>
              <span className="font-mono text-xs font-bold text-cosmic-accent">
                {level}
              </span>
            </span>
          )}
        </div>

        {/* Account */}
        <div className="border-l border-white/10 pl-3">
          <UserMenu />
        </div>
      </div>
    </div>
  );
}
