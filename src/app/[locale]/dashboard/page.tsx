"use client";

import type { ReactNode } from "react";
import {
  Rocket,
  UserRound,
  Trophy,
  Bookmark,
  Sparkles,
  ArrowRight,
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
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-cosmic-accent/40 hover:bg-cosmic-accent/5">
      <div className="mb-3 flex items-center gap-3 text-cosmic-accent">
        {icon}
      </div>
      <div className="text-3xl font-bold text-white">{value}</div>
      <div className="mt-1 text-sm text-white/60">{label}</div>
    </div>
  );
}

function ActivityCard({
  icon,
  title,
  description,
  cta,
  href,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  cta: string;
  href: "/" | "/profile" | "/profile?tab=achievements";
}) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-white/10 bg-white/5 p-6 transition-all hover:border-cosmic-accent/40 hover:bg-cosmic-accent/5"
    >
      <div className="mb-4 flex items-center gap-3 text-cosmic-accent">
        {icon}
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mb-4 text-sm text-white/60">{description}</p>
      <div className="flex items-center gap-2 text-sm font-medium text-cosmic-accent">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
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

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-8 flex items-start gap-3">
          <Sparkles className="mt-1 h-8 w-8 shrink-0 text-cosmic-accent" />
          <div>
            <h1 className="text-3xl font-bold text-white">
              {t("welcome")}
              {username ? `, ${username}` : ""}
            </h1>
            <p className="mt-1 text-white/60">{t("subtitle")}</p>
          </div>
        </header>

        <section className="mb-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard
              icon={<Rocket className="h-6 w-6" />}
              label={tc("header.level")}
              value={level}
            />
            <StatCard
              icon={<Rocket className="h-6 w-6" />}
              label={tc("progress.stats.planetsVisited")}
              value={planetsVisited}
            />
            <StatCard
              icon={<Trophy className="h-6 w-6" />}
              label={tc("achievements.unlocked")}
              value={achievementsUnlocked}
            />
            <StatCard
              icon={<Bookmark className="h-6 w-6" />}
              label={tc("bookmarks.title")}
              value={bookmarksCount}
            />
          </div>
        </section>

        <section>
          <div className="grid gap-4 sm:grid-cols-3">
            <ActivityCard
              icon={<Rocket className="h-6 w-6" />}
              title={t("cards.explore.title")}
              description={t("cards.explore.description")}
              cta={t("cards.explore.cta")}
              href="/"
            />
            <ActivityCard
              icon={<UserRound className="h-6 w-6" />}
              title={t("cards.profile.title")}
              description={t("cards.profile.description")}
              cta={t("cards.profile.cta")}
              href="/profile"
            />
            <ActivityCard
              icon={<Trophy className="h-6 w-6" />}
              title={t("cards.achievements.title")}
              description={t("cards.achievements.description")}
              cta={t("cards.achievements.cta")}
              href="/profile?tab=achievements"
            />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
