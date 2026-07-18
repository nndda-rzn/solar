"use client";

import { Bell, Menu, Trophy, Target, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";

export function TopBar({
  breadcrumb,
  onMenuClick,
}: {
  breadcrumb?: string | undefined;
  onMenuClick?: () => void;
}) {
  const t = useTranslations("common");
  const { user } = useAuth();
  const { totalXp } = useAchievements();
  const level = Math.floor(totalXp / 100);
  const xpInLevel = totalXp % 100;

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/[0.06] bg-cosmic-deep/80 px-4 backdrop-blur-md lg:px-6">
      {/* Left: mobile menu + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Menu"
          className="text-white/50 transition-colors hover:text-white/80 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        {breadcrumb && (
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            {breadcrumb.split(">").map((seg, i, arr) => (
              <span key={i}>
                <span
                  className={i === 0 ? "text-white/80" : "text-cosmic-glow"}
                >
                  {seg.trim()}
                </span>
                {i < arr.length - 1 && (
                  <span className="mx-1.5 text-white/20">&gt;</span>
                )}
              </span>
            ))}
          </span>
        )}
      </div>

      {/* Right: stats + actions */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-lg border border-cosmic-accent/20 bg-cosmic-accent/10 px-2.5 py-1">
          <Trophy className="h-3 w-3 text-cosmic-accent" />
          <span className="text-cosmic-accent text-[10px] font-semibold uppercase tracking-wider">
            {t("topbar.level")}
          </span>
          <span className="font-mono text-xs font-bold text-cosmic-accent">
            {level}
          </span>
        </span>

        <span className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1">
          <Target className="h-3 w-3 text-white/40" />
          <span className="font-mono text-xs text-white/60">
            {xpInLevel}/100 {t("topbar.points")}
          </span>
        </span>

        <button
          aria-label={t("topbar.notifications")}
          className="text-white/40 transition-colors hover:text-white/70"
        >
          <Bell className="h-4 w-4" />
        </button>

        {user ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-xs text-white/60">
            {user.email?.[0]?.toUpperCase() ?? (
              <UserRound className="h-4 w-4" />
            )}
          </span>
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04]">
            <UserRound className="h-4 w-4 text-white/60" />
          </span>
        )}
      </div>
    </header>
  );
}
