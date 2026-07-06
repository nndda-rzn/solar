"use client";

import type { ReactNode } from "react";
import {
  Rocket,
  Globe,
  Trophy,
  Bookmark,
  Sparkles,
  ArrowRight,
  Compass,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

function StatCard({
  icon,
  value,
  label,
  colorClass,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  colorClass: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-cosmic-nebula/50 p-5">
      <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full border border-dashed border-white/10" />
      <div className="relative mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
        <span className={colorClass}>{icon}</span>
      </div>
      <div className="relative text-3xl font-bold text-white">{value}</div>
      <div className="relative mt-1 text-xs text-white/50">{label}</div>
    </div>
  );
}

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const { user } = useAuth();
  const { totalXp, achievements } = useAchievements();
  const { getUniqueCount } = useProgress();
  const { bookmarks } = useBookmarks();

  const username = user?.email?.split("@")[0] ?? "";
  const level = Math.floor(totalXp / 100);
  const planetsVisited = getUniqueCount("visited_planet");
  const achievementsUnlocked = achievements.length;
  const bookmarksCount = bookmarks.length;

  const breadcrumb =
    `${t("breadcrumb")} > ${t("breadcrumbSummary")}`.toUpperCase();

  return (
    <AppShell breadcrumb={breadcrumb}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cosmic-accent/10">
            <Sparkles className="h-6 w-6 text-cosmic-accent" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">
                {t("welcome")}
                {username ? `, ${username}` : ""}
              </h1>
              <span className="rounded-full border border-cosmic-glow/30 bg-cosmic-glow/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cosmic-glow">
                {t("badge")}
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">{t("subtitle")}</p>
          </div>
        </header>

        <section className="mb-8">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Rocket className="h-5 w-5" />}
              value={level}
              label={t("stats.level")}
              colorClass="text-cosmic-accent"
            />
            <StatCard
              icon={<Globe className="h-5 w-5" />}
              value={planetsVisited}
              label={t("stats.planetsVisited")}
              colorClass="text-purple-400"
            />
            <StatCard
              icon={<Trophy className="h-5 w-5" />}
              value={achievementsUnlocked}
              label={t("stats.achievements")}
              colorClass="text-yellow-400"
            />
            <StatCard
              icon={<Bookmark className="h-5 w-5" />}
              value={bookmarksCount}
              label={t("stats.bookmarks")}
              colorClass="text-green-400"
            />
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Link
              href="/"
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40 lg:col-span-2"
            >
              <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
                <div className="absolute right-8 top-1/2 h-32 w-32 -translate-y-1/2 rounded-full border-2 border-cosmic-accent" />
                <div className="absolute right-16 top-1/2 h-20 w-20 -translate-y-1/2 rounded-full border border-cosmic-glow" />
              </div>
              <div className="relative">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-cosmic-accent/10">
                  <Compass className="h-6 w-6 text-cosmic-accent" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-white">
                  {t("cards.explore.title")}
                </h3>
                <p className="mb-4 max-w-md text-sm text-white/50">
                  {t("cards.explore.description")}
                </p>
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-cosmic-deep transition-transform group-hover:scale-105">
                  {t("cards.explore.cta")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            <Link
              href="/profile"
              className="group rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-400/10">
                <Rocket className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {t("cards.profile.title")}
              </h3>
              <p className="mb-4 text-sm text-white/50">
                {t("cards.profile.description")}
              </p>
              <span className="flex items-center gap-1 text-sm font-medium text-cosmic-accent">
                {t("cards.profile.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
