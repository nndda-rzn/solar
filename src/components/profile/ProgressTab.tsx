"use client";

import { useTranslations } from "next-intl";
import {
  Globe,
  Star,
  Compass,
  Search,
  Bookmark,
  BookOpen,
  Clock,
  Gauge,
  Orbit,
  Library,
  type LucideIcon,
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import type { ProgressCategory } from "@/types/progress";

const STATS: Array<{
  labelKey: string;
  category: ProgressCategory;
  unique: boolean;
  icon: LucideIcon;
}> = [
  {
    labelKey: "progress.stats.planetsVisited",
    category: "visited_planet",
    unique: true,
    icon: Globe,
  },
  {
    labelKey: "progress.stats.starsVisited",
    category: "visited_star",
    unique: true,
    icon: Star,
  },
  {
    labelKey: "progress.stats.constellationsVisited",
    category: "visited_constellation",
    unique: true,
    icon: Compass,
  },
  {
    labelKey: "progress.stats.searchesUsed",
    category: "search_used",
    unique: false,
    icon: Search,
  },
  {
    labelKey: "progress.stats.bookmarksSaved",
    category: "bookmark_created",
    unique: false,
    icon: Bookmark,
  },
  {
    labelKey: "progress.stats.panelsOpened",
    category: "panel_opened",
    unique: false,
    icon: BookOpen,
  },
];

const RECENT_META: Record<
  ProgressCategory,
  { icon: LucideIcon; color: string }
> = {
  visited_planet: { icon: Globe, color: "text-blue-400" },
  visited_star: { icon: Star, color: "text-yellow-400" },
  visited_constellation: { icon: Compass, color: "text-purple-400" },
  search_used: { icon: Search, color: "text-cosmic-accent" },
  scale_reached: { icon: Orbit, color: "text-emerald-400" },
  time_traveled: { icon: Clock, color: "text-orange-400" },
  bookmark_created: { icon: Bookmark, color: "text-pink-400" },
  panel_opened: { icon: BookOpen, color: "text-indigo-400" },
  speed_reached: { icon: Gauge, color: "text-red-400" },
  library_accessed: { icon: Library, color: "text-teal-400" },
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function ProgressTab() {
  const t = useTranslations("common");
  const { progress, isLoading, getCount, getUniqueCount, getRecent } =
    useProgress();

  if (isLoading) {
    return <p className="text-sm text-white/50">Loading...</p>;
  }

  if (progress.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Globe className="mb-3 h-8 w-8 text-white/20" />
        <p className="text-sm text-white/50">{t("progress.empty")}</p>
      </div>
    );
  }

  const recent = getRecent(10);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {STATS.map((s) => {
          const count = s.unique
            ? getUniqueCount(s.category)
            : getCount(s.category);
          const Icon = s.icon;
          return (
            <div
              key={s.labelKey}
              className="rounded-lg border border-white/10 bg-white/5 p-4"
            >
              <Icon className="mb-2 h-5 w-5 text-cosmic-accent" />
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-xs text-white/50">{t(s.labelKey)}</p>
            </div>
          );
        })}
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold text-white/70">
          {t("progress.recentActivity")}
        </h3>
        <ul className="space-y-1">
          {recent.map((p) => {
            const meta = RECENT_META[p.category];
            const Icon = meta.icon;
            return (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/5 px-3 py-2"
              >
                <Icon className={`h-4 w-4 shrink-0 ${meta.color}`} />
                <span className="text-sm text-white/70">{p.targetId}</span>
                <span className="ml-auto text-xs text-white/30">
                  {relativeTime(p.completedAt)}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
