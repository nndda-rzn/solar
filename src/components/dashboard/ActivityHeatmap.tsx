"use client";

import { useProgress } from "@/hooks/useProgress";
import { useTranslations } from "next-intl";
import { Activity } from "lucide-react";

function getIntensityClass(count: number): string {
  if (count === 0) return "bg-white/5";
  if (count <= 1) return "bg-cosmic-accent/20";
  if (count <= 3) return "bg-cosmic-accent/45";
  if (count <= 6) return "bg-cosmic-accent/70";
  return "bg-cosmic-accent";
}

export function ActivityHeatmap() {
  const t = useTranslations("dashboard");
  const { progress, isLoading } = useProgress();

  const today = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (29 - i));
    const key = d.toISOString().slice(0, 10);
    const count = progress.filter((p) => p.completedAt.startsWith(key)).length;
    return {
      date: key,
      count,
      label: d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });

  const totalActivity = days.reduce((s, d) => s + d.count, 0);
  const activeDays = days.filter((d) => d.count > 0).length;

  return (
    <div className="rounded-xl border border-white/10 bg-cosmic-nebula/50 p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-cosmic-accent" />
          <span className="text-sm font-semibold text-white">
            {t("charts.heatmap.title")}
          </span>
        </div>
        <span className="text-xs text-white/40">
          {activeDays} {t("charts.heatmap.activeDays")}
        </span>
      </div>

      {isLoading ? (
        <div className="h-16 animate-pulse rounded-lg bg-white/5" />
      ) : (
        <>
          <div className="grid grid-cols-[repeat(30,1fr)] gap-0.5">
            {days.map((d) => (
              <div
                key={d.date}
                title={`${d.label}: ${d.count}`}
                className={`aspect-square rounded-[2px] transition-colors ${getIntensityClass(d.count)}`}
              />
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-white/40">
              {totalActivity} {t("charts.heatmap.totalActions")}{" "}
              {t("charts.heatmap.last30Days")}
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-white/30">
                {t("charts.heatmap.less")}
              </span>
              {[0, 1, 3, 5, 7].map((v) => (
                <div
                  key={v}
                  className={`h-2.5 w-2.5 rounded-[2px] ${getIntensityClass(v)}`}
                />
              ))}
              <span className="text-[10px] text-white/30">
                {t("charts.heatmap.more")}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
