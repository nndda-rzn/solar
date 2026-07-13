"use client";

import { useProgress } from "@/hooks/useProgress";
import { useTranslations } from "next-intl";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Globe } from "lucide-react";

const TOTALS = {
  planets: 8,
  stars: 61,
  constellations: 19,
};

const COLORS = ["#6ee7b7", "#818cf8", "#fb923c"];

export function ExplorationRingChart() {
  const t = useTranslations("dashboard");
  const { getUniqueCount, isLoading } = useProgress();

  const raw = [
    {
      name: t("charts.ring.planets"),
      visited: getUniqueCount("visited_planet"),
      total: TOTALS.planets,
    },
    {
      name: t("charts.ring.stars"),
      visited: getUniqueCount("visited_star"),
      total: TOTALS.stars,
    },
    {
      name: t("charts.ring.constellations"),
      visited: getUniqueCount("visited_constellation"),
      total: TOTALS.constellations,
    },
  ];

  const chartData = raw.map((d) => ({
    name: d.name,
    value: d.visited > 0 ? d.visited : 0.01,
    visited: d.visited,
    total: d.total,
    pct: Math.round((d.visited / d.total) * 100),
  }));

  const totalVisited = raw.reduce((s, d) => s + d.visited, 0);
  const totalObjects = raw.reduce((s, d) => s + d.total, 0);
  const overallPct = Math.round((totalVisited / totalObjects) * 100);

  return (
    <div className="rounded-xl border border-white/10 bg-cosmic-nebula/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Globe className="h-4 w-4 text-cosmic-accent" />
        <span className="text-sm font-semibold text-white">
          {t("charts.ring.title")}
        </span>
      </div>

      {isLoading ? (
        <div className="h-40 animate-pulse rounded-lg bg-white/5" />
      ) : (
        <div className="flex items-center gap-6">
          {/* Donut */}
          <div className="relative h-36 w-36 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {chartData.map((_, i) => (
                    <Cell
                      key={i}
                      fill={COLORS[i % COLORS.length]}
                      opacity={0.85}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length || !payload[0]) return null;
                    const d = payload[0].payload;
                    return (
                      <div className="rounded-lg border border-white/10 bg-black/90 px-3 py-2 text-xs text-white/80 backdrop-blur-sm">
                        {d.name}: {d.visited}/{d.total} ({d.pct}%)
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {overallPct}%
              </span>
              <span className="text-[9px] uppercase tracking-wider text-white/40">
                {t("charts.ring.explored")}
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-1 flex-col gap-3">
            {raw.map((d, i) => (
              <div key={d.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ background: COLORS[i % COLORS.length] }}
                    />
                    <span className="text-white/60">{d.name}</span>
                  </div>
                  <span className="font-medium text-white">
                    {d.visited}/{d.total}
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${(d.visited / d.total) * 100}%`,
                      background: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
