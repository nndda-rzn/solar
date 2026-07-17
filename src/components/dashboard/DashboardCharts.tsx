"use client";

import { useTranslations } from "next-intl";
import { ExplorationRingChart } from "./ExplorationRingChart";
import { XPProgressBar } from "./XPProgressBar";
import { ActivityHeatmap } from "./ActivityHeatmap";

export function DashboardCharts() {
  const t = useTranslations("dashboard");

  return (
    <section className="mt-8">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-white/40">
        {t("charts.sectionTitle")}
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ExplorationRingChart />
        <XPProgressBar />
        <ActivityHeatmap />
      </div>
    </section>
  );
}
