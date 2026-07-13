"use client";

import { useAchievements } from "@/hooks/useAchievements";
import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";

export function XPProgressBar() {
  const t = useTranslations("dashboard");
  const { totalXp, isLoading } = useAchievements();

  const XP_PER_LEVEL = 100;
  const level = Math.floor(totalXp / XP_PER_LEVEL);
  const currentXp = totalXp % XP_PER_LEVEL;
  const progress = Math.min((currentXp / XP_PER_LEVEL) * 100, 100);

  return (
    <div className="rounded-xl border border-white/10 bg-cosmic-nebula/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-cosmic-accent" />
          <span className="text-sm font-semibold text-white">
            {t("charts.xp.title")}
          </span>
        </div>
        <span className="rounded-full border border-cosmic-accent/20 bg-cosmic-accent/10 px-2 py-0.5 text-xs font-bold text-cosmic-accent">
          {t("charts.xp.level")} {level}
        </span>
      </div>

      {isLoading ? (
        <div className="h-20 animate-pulse rounded-lg bg-white/5" />
      ) : (
        <div className="space-y-3">
          <div className="text-center">
            <span className="text-3xl font-bold text-white">{totalXp}</span>
            <span className="ml-1.5 text-sm text-white/40">XP</span>
          </div>

          <div>
            <div className="mb-1.5 flex justify-between text-xs text-white/40">
              <span>{currentXp} XP</span>
              <span>{XP_PER_LEVEL} XP</span>
            </div>
            <div className="relative h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cosmic-accent to-cosmic-glow transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <p className="text-center text-xs text-white/40">
            {XP_PER_LEVEL - currentXp} XP {t("charts.xp.toNextLevel")}
          </p>
        </div>
      )}
    </div>
  );
}
