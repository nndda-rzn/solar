"use client";

import { useTranslations, useLocale } from "next-intl";
import {
  Rocket,
  Sparkles,
  Compass,
  Bookmark,
  Search,
  Globe,
  Orbit,
  Sun,
  Star,
  Map,
  Clock,
  BookOpen,
  Lock,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";
import { useAchievements } from "@/hooks/useAchievements";

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Sparkles,
  Compass,
  Bookmark,
  Search,
  Globe,
  Orbit,
  Sun,
  Star,
  Map,
  Clock,
  BookOpen,
};

export function AchievementsTab() {
  const t = useTranslations("common");
  const locale = useLocale();
  const { catalog, isEarned, totalXp, isLoading } = useAchievements();

  if (isLoading) {
    return <p className="text-sm text-white/50">Loading...</p>;
  }

  const level = Math.floor(totalXp / 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-white/40">
            {t("achievements.totalXp")}
          </p>
          <p className="text-3xl font-bold text-white">{totalXp}</p>
        </div>
        <div className="rounded-full border border-cosmic-accent/40 bg-cosmic-accent/10 px-4 py-1">
          <span className="text-sm font-semibold text-cosmic-accent">
            {t("achievements.level")} {level}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {catalog.map((def) => {
          const earned = isEarned(def.id);
          const hidden = def.hidden && !earned;
          const Icon = ICONS[def.icon] ?? Sparkles;
          const description =
            locale === "id" ? def.description.id : def.description.en;

          if (hidden) {
            return (
              <div
                key={def.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4 opacity-50"
              >
                <HelpCircle className="mb-2 h-6 w-6 text-white/30" />
                <p className="text-sm font-semibold text-white/50">
                  {t("achievements.hidden")}
                </p>
              </div>
            );
          }

          if (!earned) {
            return (
              <div
                key={def.id}
                className="rounded-lg border border-white/10 bg-white/5 p-4 opacity-50"
              >
                <Lock className="mb-2 h-6 w-6 text-white/30" />
                <p className="text-sm font-semibold text-white">{def.title}</p>
                <p className="mt-1 text-xs text-white/50">{description}</p>
                <p className="mt-2 text-xs text-white/30">
                  {t("achievements.locked")}
                </p>
              </div>
            );
          }

          return (
            <div
              key={def.id}
              className="relative overflow-hidden rounded-lg border border-yellow-400/40 bg-yellow-400/10 p-4"
            >
              <Sparkles className="absolute right-2 top-2 h-4 w-4 text-yellow-400/40" />
              <Icon className="mb-2 h-6 w-6 text-yellow-400" />
              <p className="text-sm font-semibold text-white">{def.title}</p>
              <p className="mt-1 text-xs text-white/60">{description}</p>
              <span className="mt-2 inline-block rounded-full bg-yellow-400/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
                +{def.xp} {t("achievements.xp")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
