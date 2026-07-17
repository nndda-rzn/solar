# Dashboard Data Visualization — Implementation Plan

> **Date:** 2026-07-13
> **For agentic workers:** Use `superpowers:executing-plans` to implement task-by-task. Steps use checkbox syntax.

---

## Tujuan

Tambah 3 chart visualisasi di dashboard page sebagai section baru di bawah StatCards, menggunakan Recharts. Semua data dari hooks yang sudah ada — tidak perlu API baru.

---

## Data Aktual

| Kategori       | Total      | Hook                                      |
| -------------- | ---------- | ----------------------------------------- |
| Planets        | 8          | `getUniqueCount("visited_planet")`        |
| Stars          | 61         | `getUniqueCount("visited_star")`          |
| Constellations | 19         | `getUniqueCount("visited_constellation")` |
| XP per level   | 100        | `totalXp % 100`                           |
| Aktivitas      | progress[] | `progress[].completedAt`                  |

---

## 3 Chart yang Dibangun

| Chart            | Tipe             | Library  | Data                         |
| ---------------- | ---------------- | -------- | ---------------------------- |
| Exploration Ring | Donut (PieChart) | Recharts | visited per kategori / total |
| XP Progress      | Animated bar     | CSS      | `totalXp % 100` / 100        |
| Activity Heatmap | CSS Grid 30 sel  | CSS      | progress grouped by date     |

---

## File yang Dibuat

| File                                                | Keterangan                     |
| --------------------------------------------------- | ------------------------------ |
| `src/components/dashboard/ExplorationRingChart.tsx` | Donut chart eksplorasi         |
| `src/components/dashboard/XPProgressBar.tsx`        | XP bar menuju level berikutnya |
| `src/components/dashboard/ActivityHeatmap.tsx`      | Heatmap 30 hari aktivitas      |
| `src/components/dashboard/DashboardCharts.tsx`      | Container wrapper 3 chart      |

## File yang Dimodifikasi

| File                                  | Perubahan                                     |
| ------------------------------------- | --------------------------------------------- |
| `src/app/[locale]/dashboard/page.tsx` | Mount `<DashboardCharts />` setelah StatCards |
| `src/messages/en/dashboard.json`      | Tambah `charts.*` keys                        |
| `src/messages/id/dashboard.json`      | Tambah `charts.*` keys                        |
| `package.json`                        | Install recharts@2.13.3                       |

---

## Phase 1: Install Recharts

### Task 1.1 — Install dependency

- [ ] **Step 1: Install recharts**

  ```bash
  npm install recharts@2.13.3
  ```

- [ ] **Step 2: Verifikasi TypeScript clean**
  ```bash
  npx tsc --noEmit
  ```

---

## Phase 2: XPProgressBar Component

### Task 2.1 — Buat `src/components/dashboard/XPProgressBar.tsx`

- [ ] **Step 1: Buat file**

```tsx
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
          {/* Total XP */}
          <div className="text-center">
            <span className="text-3xl font-bold text-white">{totalXp}</span>
            <span className="ml-1.5 text-sm text-white/40">XP</span>
          </div>

          {/* Bar */}
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
```

---

## Phase 3: ExplorationRingChart Component

### Task 3.1 — Buat `src/components/dashboard/ExplorationRingChart.tsx`

- [ ] **Step 1: Buat file**

```tsx
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

  // Recharts needs non-zero values — use visited or 0.01 placeholder
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
                    if (!active || !payload?.length) return null;
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
            {/* Center text */}
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
```

---

## Phase 4: ActivityHeatmap Component

### Task 4.1 — Buat `src/components/dashboard/ActivityHeatmap.tsx`

- [ ] **Step 1: Buat file (pure CSS grid, tanpa Recharts)**

```tsx
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

  // Build 30-day array from today backwards
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
          {/* Grid: 6 rows × 5 cols = 30 cells */}
          <div className="grid grid-cols-[repeat(30,1fr)] gap-0.5">
            {days.map((d) => (
              <div
                key={d.date}
                title={`${d.label}: ${d.count}`}
                className={`aspect-square rounded-[2px] transition-colors ${getIntensityClass(d.count)}`}
              />
            ))}
          </div>

          {/* Legend */}
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
```

---

## Phase 5: DashboardCharts Container

### Task 5.1 — Buat `src/components/dashboard/DashboardCharts.tsx`

- [ ] **Step 1: Buat file**

```tsx
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
```

---

## Phase 6: Mount di Dashboard Page

### Task 6.1 — Update `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Baca file, cari baris akhir `</section>` StatCards**

- [ ] **Step 2: Tambah import**

  ```tsx
  import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
  ```

- [ ] **Step 3: Mount setelah closing `</section>` navigation cards**
  ```tsx
  </section>
  <DashboardCharts />
  ```

---

## Phase 7: i18n Keys

### Task 7.1 — Update EN dashboard.json

- [ ] **Step 1: Baca file `src/messages/en/dashboard.json`**

- [ ] **Step 2: Tambah keys baru (merge ke existing object)**

```json
"charts": {
  "sectionTitle": "Your Progress",
  "xp": {
    "title": "Experience Points",
    "level": "Level",
    "toNextLevel": "XP to next level"
  },
  "ring": {
    "title": "Universe Exploration",
    "explored": "Explored",
    "planets": "Planets",
    "stars": "Stars",
    "constellations": "Constellations"
  },
  "heatmap": {
    "title": "Activity (30 Days)",
    "activeDays": "active days",
    "totalActions": "total actions",
    "last30Days": "in last 30 days",
    "less": "Less",
    "more": "More"
  }
}
```

### Task 7.2 — Update ID dashboard.json

- [ ] **Step 1: Baca `src/messages/id/dashboard.json`**

- [ ] **Step 2: Tambah keys baru**

```json
"charts": {
  "sectionTitle": "Progres Kamu",
  "xp": {
    "title": "Poin Pengalaman",
    "level": "Level",
    "toNextLevel": "XP ke level berikutnya"
  },
  "ring": {
    "title": "Eksplorasi Alam Semesta",
    "explored": "Dijelajahi",
    "planets": "Planet",
    "stars": "Bintang",
    "constellations": "Rasi Bintang"
  },
  "heatmap": {
    "title": "Aktivitas (30 Hari)",
    "activeDays": "hari aktif",
    "totalActions": "total aksi",
    "last30Days": "dalam 30 hari terakhir",
    "less": "Sedikit",
    "more": "Banyak"
  }
}
```

---

## Phase 8: Verifikasi + Commit

### Task 8.1 — TypeScript + Build

- [ ] **Step 1:**

  ```bash
  npx tsc --noEmit
  ```

- [ ] **Step 2:**
  ```bash
  npm run build
  ```

### Task 8.2 — Commit

- [ ] **Step 1: Stage files**

  ```
  src/components/dashboard/ExplorationRingChart.tsx
  src/components/dashboard/XPProgressBar.tsx
  src/components/dashboard/ActivityHeatmap.tsx
  src/components/dashboard/DashboardCharts.tsx
  src/app/[locale]/dashboard/page.tsx
  src/messages/en/dashboard.json
  src/messages/id/dashboard.json
  package.json
  package-lock.json
  ```

- [ ] **Step 2: Commit**
  ```bash
  git commit -m "feat(ui): add data visualization charts to dashboard"
  ```

---

## Urutan Implementasi

```
Phase 1: npm install recharts@2.13.3
    ↓
Phase 2: XPProgressBar.tsx
    ↓
Phase 3: ExplorationRingChart.tsx
    ↓
Phase 4: ActivityHeatmap.tsx
    ↓
Phase 5: DashboardCharts.tsx
    ↓
Phase 6: Mount di dashboard/page.tsx
    ↓
Phase 7: i18n EN + ID
    ↓
Phase 8: tsc + build + commit
```

**Total file baru:** 4
**Total file dimodifikasi:** 4
**Dependency baru:** recharts@2.13.3 (~180KB gzip: ~60KB)

---

## Catatan

1. `ResponsiveContainer` Recharts butuh parent dengan explicit height — wrapper div di `ExplorationRingChart` sudah punya `h-36 w-36`.
2. Heatmap 30 kolom di mobile sangat kecil — ini intentional, sel kecil adalah gaya GitHub heatmap.
3. `recharts` SSR-safe di Next.js jika component pakai `"use client"` — sudah dihandle di semua komponen.
4. `@types/recharts` tidak perlu — recharts@2.x sudah bundled TypeScript types.
