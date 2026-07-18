"use client";

import {
  Rocket,
  Globe,
  Trophy,
  Bookmark,
  Sparkles,
  ArrowRight,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { useAchievements } from "@/hooks/useAchievements";
import { useProgress } from "@/hooks/useProgress";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";

function StatCard({
  icon,
  value,
  label,
  colorClass,
}: {
  icon: React.ReactNode;
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
        {/* Welcome header */}
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

        {/* Stat cards */}
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
              colorClass="text-cosmic-accent"
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
              colorClass="text-indigo-400"
            />
          </div>
        </section>

        {/* Activity cards */}
        <section>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Explore card — larger, spans 2 cols */}
            <Link
              href="/"
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40 lg:col-span-2"
            >
              {/* Decorative graphic: large circle + diagonal lines + dashed inner circle */}
              <div className="pointer-events-none absolute right-0 top-0 h-full w-2/5 opacity-[0.12]">
                <div className="absolute right-6 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full border-2 border-cosmic-accent" />
                <div className="absolute right-14 top-1/2 h-24 w-24 -translate-y-1/2 rounded-full border border-dashed border-cosmic-glow" />
                <div className="absolute right-0 top-1/2 h-px w-48 -translate-y-1/2 rotate-[30deg] origin-right bg-gradient-to-l from-cosmic-accent to-transparent" />
                <div className="absolute right-0 top-1/2 h-px w-48 translate-y-8 rotate-[-25deg] origin-right bg-gradient-to-l from-cosmic-glow to-transparent" />
              </div>
              <div className="relative">
                {/* Icon + title inline */}
                <div className="mb-3 flex items-center gap-2.5">
                  <Rocket className="h-5 w-5 text-cosmic-accent" />
                  <h3 className="text-lg font-semibold text-white">
                    {t("cards.explore.title")}
                  </h3>
                </div>
                <p className="mb-5 max-w-md text-sm text-white/50">
                  {t("cards.explore.description")}
                </p>
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-cosmic-deep transition-transform group-hover:scale-105">
                  {t("cards.explore.cta")}
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>

            {/* Profile card — smaller */}
            <Link
              href="/profile"
              className="group rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40"
            >
              {/* Icon + title inline */}
              <div className="mb-3 flex items-center gap-2.5">
                <UserRound className="h-5 w-5 text-cosmic-accent" />
                <h3 className="text-lg font-semibold text-white">
                  {t("cards.profile.title")}
                </h3>
              </div>
              <p className="mb-5 text-sm text-white/50">
                {t("cards.profile.description")}
              </p>
              <span className="flex items-center gap-1 text-sm font-medium text-cosmic-accent">
                {t("cards.profile.cta")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </div>
        </section>
        <DashboardCharts />
      </div>
    </AppShell>
  );
}
