# Library Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `/library` dari stub "Coming Soon" jadi content aggregator + browse + detail + bookmarks.

**Architecture:** Reuse 4 komponen UI existing (SlidePanel, Stat), 2 hooks (useTranslations, useBookmarks), 4 JSON data source statis. 4 new components di `components/library/`, 1 ProgressCategory expansion, ~14 i18n keys per locale.

**Tech Stack:** Next.js 14, TypeScript, React 18, Tailwind v4, Zustand, next-intl, Jest.

---

## File Map

**File baru:**

- `src/components/library/LibraryCard.tsx` — satu kartu per celestial object
- `src/components/library/CatalogGrid.tsx` — list kartu per tab
- `src/components/library/LibraryDetail.tsx` — body SlidePanel
- `src/components/library/LibraryTabs.tsx` — tab strip + Bookmark count badge
- `src/lib/library/catalog.ts` — data aggregator: JSON → CatalogItem + LibraryDetailItem

**File dimodifikasi:**

- `src/types/progress.ts` — tambah `"library_accessed"`
- `src/messages/en/common.json` — tambah `library.*` namespace
- `src/messages/id/common.json` — sama
- `src/app/[locale]/library/page.tsx` — rewrite dari stub
- `src/data/achievements-catalog.json` — tambah "Cosmic Reader"

**File test:**

- `src/components/library/__tests__/LibraryCard.test.tsx`
- `src/components/library/__tests__/CatalogGrid.test.tsx`
- `src/components/library/__tests__/LibraryDetail.test.tsx`
- `src/components/library/__tests__/LibraryTabs.test.tsx`
- `src/components/library/__tests__/LibraryPage.test.tsx`

---

### Task 1: Tambah `library_accessed` ke ProgressCategory

**Files:** Modify `src/types/progress.ts`

- [ ] **Step 1: Tambah value baru ke union**

```ts
export type ProgressCategory =
  | "visited_planet"
  | "visited_star"
  | "visited_constellation"
  | "search_used"
  | "scale_reached"
  | "time_traveled"
  | "bookmark_created"
  | "panel_opened"
  | "speed_reached"
  | "library_accessed";
```

- [ ] **Step 2: Verify (type-check passes)**

```bash
npm run type-check
```

Expected: no errors. No consumer code references ProgressCategory in exhaustive switch, so just checking union is compatible.

- [ ] **Step 3: Commit**

```bash
git add src/types/progress.ts
git commit -m "feat(types): add library_accessed to ProgressCategory"
```

---

### Task 2: Tambah i18n keys untuk Library (EN + ID)

**Files:** Modify `src/messages/en/common.json` + `src/messages/id/common.json`

- [ ] **Step 1: Tambah namespace `library` di EN**

Top-level key di common.json:

```json
"library": {
  "title": "Library",
  "subtitle": "Browse celestial objects, fun facts, and your saved bookmarks",
  "tabs": {
    "planets": "Planets",
    "dwarfPlanets": "Dwarf Planets",
    "stars": "Stars",
    "constellations": "Constellations",
    "bookmarks": "My Bookmarks"
  },
  "empty": {
    "planets": "No planets to display.",
    "dwarfPlanets": "No dwarf planets to display.",
    "stars": "No stars to display.",
    "constellations": "No constellations to display.",
    "bookmarks": "You haven't saved any bookmarks yet. Save camera views from the Explorer to see them here."
  },
  "explore3d": "Explore in 3D",
  "noContent": "No description available.",
  "stats": {
    "mass": "Mass",
    "temperature": "Temperature",
    "distance": "Distance from Sun",
    "radius": "Radius",
    "orbitalPeriod": "Orbital Period",
    "moonCount": "Moons",
    "magnitude": "Magnitude",
    "spectralType": "Spectral Type",
    "starCount": "Star Count",
    "abbreviation": "Abbreviation",
    "indonesianName": "Indonesian Name"
  },
  "sections": {
    "facts": "Fun Facts",
    "mythology": "Mythology",
    "description": "Description",
    "physicalData": "Physical Data"
  }
}
```

- [ ] **Step 2: Tambah namespace `library` di ID**

Mirror semua di id/common.json:

```json
"library": {
  "title": "Pustaka",
  "subtitle": "Jelajahi objek langit, fakta menarik, dan bookmark tersimpan Anda",
  "tabs": {
    "planets": "Planet",
    "dwarfPlanets": "Planet Katai",
    "stars": "Bintang",
    "constellations": "Rasi Bintang",
    "bookmarks": "Bookmark Saya"
  },
  "empty": {
    "planets": "Tidak ada planet untuk ditampilkan.",
    "dwarfPlanets": "Tidak ada planet katai untuk ditampilkan.",
    "stars": "Tidak ada bintang untuk ditampilkan.",
    "constellations": "Tidak ada rasi bintang untuk ditampilkan.",
    "bookmarks": "Anda belum menyimpan bookmark. Simpan tampilan kamera dari Explorer untuk melihatnya di sini."
  },
  "explore3d": "Jelajahi dalam 3D",
  "noContent": "Deskripsi tidak tersedia.",
  "stats": {
    "mass": "Massa",
    "temperature": "Suhu",
    "distance": "Jarak dari Matahari",
    "radius": "Radius",
    "orbitalPeriod": "Periode Orbit",
    "moonCount": "Bulan",
    "magnitude": "Magnitudo",
    "spectralType": "Tipe Spektral",
    "starCount": "Jumlah Bintang",
    "abbreviation": "Singkatan",
    "indonesianName": "Nama Indonesia"
  },
  "sections": {
    "facts": "Fakta Menarik",
    "mythology": "Mitologi",
    "description": "Deskripsi",
    "physicalData": "Data Fisik"
  }
}
```

- [ ] **Step 3: JSON valid?**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/messages/en/common.json','utf8'))" && echo "EN OK"
node -e "JSON.parse(require('fs').readFileSync('src/messages/id/common.json','utf8'))" && echo "ID OK"
```

- [ ] **Step 4: Commit**

```bash
git add src/messages/en/common.json src/messages/id/common.json
git commit -m "feat(ui): add Library namespace to i18n for EN and ID"
```

---

### Task 3: Buat `<LibraryCard>` component + test

**Files:** Create `src/components/library/LibraryCard.tsx` + `src/components/library/__tests__/LibraryCard.test.tsx`

- [ ] **Step 1: Tulis test dulu**

`__tests__/LibraryCard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en/common.json";
import { LibraryCard } from "../LibraryCard";

const messages = { common: enMessages };

function renderWithIntl(ui: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>,
    ),
  };
}

describe("LibraryCard", () => {
  const baseProps = {
    id: "earth",
    title: "Earth",
    type: "planet" as const,
    onSelect: jest.fn(),
  };

  it("renders title", () => {
    renderWithIntl(<LibraryCard {...baseProps} />);
    expect(screen.getByText("Earth")).toBeInTheDocument();
  });

  it("calls onSelect when clicked", async () => {
    const { user } = renderWithIntl(<LibraryCard {...baseProps} />);
    await user.click(screen.getByRole("button"));
    expect(baseProps.onSelect).toHaveBeenCalledWith("earth", "planet");
  });

  it("applies disabled state", () => {
    renderWithIntl(<LibraryCard {...{ ...baseProps, disabled: true }} />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders stats when provided", () => {
    renderWithIntl(
      <LibraryCard
        {...baseProps}
        stats={[
          { label: "Moons", value: "1" },
          { label: "Temp", value: "288K" },
        ]}
      />,
    );
    expect(screen.getByText("Moons")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });

  it("renders subtitle when provided", () => {
    renderWithIntl(<LibraryCard {...baseProps} subtitle="The Blue Planet" />);
    expect(screen.getByText("The Blue Planet")).toBeInTheDocument();
  });

  it("applies accent color border", () => {
    renderWithIntl(<LibraryCard {...baseProps} accentColor="#ff0000" />);
    const btn = screen.getByRole("button");
    expect(btn.style.borderLeftColor).toBe("rgb(255, 0, 0)");
  });
});
```

- [ ] **Step 2: Run test — harus FAIL (file belum ada)**

```bash
npm test -- --testPathPattern="LibraryCard"
```

- [ ] **Step 3: Implementasi LibraryCard**

```tsx
"use client";

import { useTranslations } from "next-intl";

export type LibraryItemType =
  "planet" | "dwarfPlanet" | "star" | "constellation";

export interface LibraryCardProps {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  stats?: Array<{ label: string; value: string }>;
  onSelect: (id: string, type: LibraryItemType) => void;
  disabled?: boolean;
}

export function LibraryCard({
  id,
  title,
  subtitle,
  type,
  accentColor,
  stats = [],
  onSelect,
  disabled,
}: LibraryCardProps) {
  const t = useTranslations("common.library");
  return (
    <button
      type="button"
      onClick={() => !disabled && onSelect(id, type)}
      disabled={disabled}
      className={[
        "group flex flex-col gap-3 rounded-xl border border-white/10 bg-cosmic-nebula/50 p-4 text-left transition-all",
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-cosmic-accent/40 hover:bg-cosmic-nebula/70 active:scale-[0.98]",
      ].join(" ")}
      style={accentColor ? { borderLeftColor: accentColor } : undefined}
      aria-label={`${t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}: ${title}`}
    >
      <div className="flex h-8 items-center gap-2">
        <span
          className="h-3 w-3 rounded-full"
          style={{ backgroundColor: accentColor ?? "#4a9eff" }}
        />
        <span className="text-xs uppercase tracking-wider text-white/50">
          {t(`tabs.${type === "dwarfPlanet" ? "dwarfPlanets" : `${type}s`}`)}
        </span>
      </div>
      <div>
        <h3 className="line-clamp-1 text-lg font-semibold text-white">
          {title}
        </h3>
        {subtitle ? (
          <p className="line-clamp-1 text-sm text-white/50">{subtitle}</p>
        ) : null}
      </div>
      {stats.length > 0 ? (
        <dl className="grid grid-cols-3 gap-2 border-t border-white/5 pt-3 text-xs">
          {stats.slice(0, 3).map((s) => (
            <div key={s.label} className="flex flex-col">
              <dt className="text-white/40">{s.label}</dt>
              <dd className="truncate text-white/80">{s.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </button>
  );
}
```

- [ ] **Step 4: Run test — harus PASS**

```bash
npm test -- --testPathPattern="LibraryCard"
```

- [ ] **Step 5: Commit**

```bash
git add src/components/library/LibraryCard.tsx src/components/library/__tests__/LibraryCard.test.tsx
git commit -m "feat(ui): add LibraryCard component with test coverage"
```

---

### Task 4: Buat `<CatalogGrid>` + test

**Files:** Create `src/components/library/CatalogGrid.tsx` + `src/components/library/__tests__/CatalogGrid.test.tsx`

- [ ] **Step 1: TDD test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en/common.json";
import { CatalogGrid } from "../CatalogGrid";

const items = [
  {
    id: "earth",
    title: "Earth",
    type: "planet" as const,
    accentColor: "#3b82f6",
  },
  {
    id: "mars",
    title: "Mars",
    type: "planet" as const,
    accentColor: "#ef4444",
  },
];

function renderWithIntl(ui: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(
      <NextIntlClientProvider locale="en" messages={{ common: enMessages }}>
        {ui}
      </NextIntlClientProvider>,
    ),
  };
}

describe("CatalogGrid", () => {
  it("renders all items as cards", () => {
    renderWithIntl(
      <CatalogGrid items={items} onSelect={jest.fn()} emptyLabel="No items" />,
    );
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });

  it("shows empty state when no items", () => {
    renderWithIntl(
      <CatalogGrid items={[]} onSelect={jest.fn()} emptyLabel="No items" />,
    );
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  it("calls onSelect with id and type", async () => {
    const onSelect = jest.fn();
    const { user } = renderWithIntl(
      <CatalogGrid items={items} onSelect={onSelect} emptyLabel="x" />,
    );
    await user.click(screen.getByRole("button", { name: /Earth/i }));
    expect(onSelect).toHaveBeenCalledWith("earth", "planet");
  });
});
```

- [ ] **Step 2: Implementasi**

```tsx
"use client";

import { LibraryCard, LibraryItemType } from "./LibraryCard";

export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  stats?: Array<{ label: string; value: string }>;
}

export interface CatalogGridProps {
  items: CatalogItem[];
  emptyLabel: string;
  onSelect: (id: string, type: LibraryItemType) => void;
}

export function CatalogGrid({ items, emptyLabel, onSelect }: CatalogGridProps) {
  if (items.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-cosmic-nebula/20 p-6 text-center text-white/40">
        {emptyLabel}
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <LibraryCard
          key={`${item.type}-${item.id}`}
          {...item}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Verify & commit**

```bash
npm test -- --testPathPattern="CatalogGrid"
git add src/components/library/CatalogGrid.tsx src/components/library/__tests__/CatalogGrid.test.tsx
git commit -m "feat(ui): add CatalogGrid component with empty state"
```

---

### Task 5: Buat `<LibraryDetail>` + test

**Files:** Create `src/components/library/LibraryDetail.tsx` + `src/components/library/__tests__/LibraryDetail.test.tsx`

- [ ] **Step 1: TDD test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en/common.json";
import { LibraryDetail } from "../LibraryDetail";

const messages = { common: enMessages };

function renderWithIntl(ui: React.ReactNode) {
  return {
    user: userEvent.setup(),
    ...render(
      <NextIntlClientProvider locale="en" messages={messages}>
        {ui}
      </NextIntlClientProvider>,
    ),
  };
}

const baseItem = {
  id: "earth",
  title: "Earth",
  type: "planet" as const,
  accentColor: "#3b82f6",
  description: "The third planet from the Sun.",
  facts: ["70% surface is water", "Only planet not named after a god"],
  stats: [
    { label: "Mass", value: "5.97 x 10^24 kg" },
    { label: "Moons", value: "1" },
    { label: "Radius", value: "6371 km" },
  ],
};

describe("LibraryDetail", () => {
  it("renders title and description", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Earth")).toBeInTheDocument();
    expect(screen.getByText(/third planet/i)).toBeInTheDocument();
  });

  it("renders all facts as list items", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText(/70% surface is water/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Only planet not named after a god/i),
    ).toBeInTheDocument();
  });

  it("renders stat rows", () => {
    renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={jest.fn()}
        onClose={jest.fn()}
      />,
    );
    expect(screen.getByText("Mass")).toBeInTheDocument();
    expect(screen.getByText(/5\.97/)).toBeInTheDocument();
  });

  it("calls onExplore when CTA clicked", async () => {
    const onExplore = jest.fn();
    const { user } = renderWithIntl(
      <LibraryDetail
        item={baseItem}
        onExplore={onExplore}
        onClose={jest.fn()}
      />,
    );
    await user.click(screen.getByRole("button", { name: /Explore in 3D/i }));
    expect(onExplore).toHaveBeenCalledWith("earth", "planet");
  });

  it("calls onClose when close button clicked", async () => {
    const onClose = jest.fn();
    const { user } = renderWithIntl(
      <LibraryDetail item={baseItem} onExplore={jest.fn()} onClose={onClose} />,
    );
    await user.click(screen.getByRole("button", { name: /Close/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("uses noContent fallback when no description", () => {
    const item = { ...baseItem, description: undefined };
    renderWithIntl(
      <LibraryDetail item={item} onExplore={jest.fn()} onClose={jest.fn()} />,
    );
    expect(screen.getByText(/No description available/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Implementasi**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { LibraryItemType } from "./LibraryCard";
import { Stat } from "@/components/ui/Stat";

export interface LibraryDetailItem {
  id: string;
  title: string;
  type: LibraryItemType;
  accentColor?: string;
  description?: string;
  facts?: string[];
  mythology?: string;
  stats: Array<{ label: string; value: string }>;
}

export interface LibraryDetailProps {
  item: LibraryDetailItem;
  onExplore: (id: string, type: LibraryItemType) => void;
  onClose: () => void;
}

export function LibraryDetail({
  item,
  onExplore,
  onClose,
}: LibraryDetailProps) {
  const t = useTranslations("common.library");
  return (
    <div className="flex flex-col gap-6 p-6">
      <header className="flex items-start gap-4">
        <span
          className="mt-1 h-4 w-4 rounded-full"
          style={{ backgroundColor: item.accentColor ?? "#4a9eff" }}
          aria-hidden
        />
        <div className="flex-1">
          <p className="text-xs uppercase tracking-wider text-cosmic-accent">
            {t(
              `tabs.${item.type === "dwarfPlanet" ? "dwarfPlanets" : `${item.type}s`}`,
            )}
          </p>
          <h2 className="text-2xl font-bold text-white">{item.title}</h2>
        </div>
      </header>

      <section>
        <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
          {t("sections.description")}
        </h3>
        <p className="text-white/80">{item.description ?? t("noContent")}</p>
      </section>

      {item.stats.length > 0 ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.physicalData")}
          </h3>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {item.stats.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </section>
      ) : null}

      {item.facts && item.facts.length > 0 ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.facts")}
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-white/80">
            {item.facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {item.mythology ? (
        <section>
          <h3 className="mb-2 text-xs uppercase tracking-wider text-white/40">
            {t("sections.mythology")}
          </h3>
          <p className="italic text-white/80">{item.mythology}</p>
        </section>
      ) : null}

      <footer className="mt-auto flex justify-end gap-3 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-white/20 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5"
        >
          Close
        </button>
        <button
          type="button"
          onClick={() => onExplore(item.id, item.type)}
          className="rounded bg-cosmic-accent px-4 py-2 text-sm font-medium text-cosmic-deep transition hover:bg-cosmic-glow"
        >
          {t("explore3d")}
        </button>
      </footer>
    </div>
  );
}
```

- [ ] **Step 3: Verify & commit**

```bash
npm test -- --testPathPattern="LibraryDetail"
git add src/components/library/LibraryDetail.tsx src/components/library/__tests__/LibraryDetail.test.tsx
git commit -m "feat(ui): add LibraryDetail component for SlidePanel content"
```

---

### Task 6: Buat `<LibraryTabs>` component + test

**Files:** Create `src/components/library/LibraryTabs.tsx` + `src/components/library/__tests__/LibraryTabs.test.tsx`

- [ ] **Step 1: Implementasi**

```tsx
"use client";

import { useTranslations } from "next-intl";

export type LibraryTab =
  "planets" | "dwarfPlanets" | "stars" | "constellations" | "bookmarks";

export interface LibraryTabsProps {
  active: LibraryTab;
  bookmarkCount: number;
  onChange: (tab: LibraryTab) => void;
}

export function LibraryTabs({
  active,
  bookmarkCount,
  onChange,
}: LibraryTabsProps) {
  const t = useTranslations("common.library");
  const tabs: Array<{ key: LibraryTab; labelKey: string; suffix?: number }> = [
    { key: "planets", labelKey: "tabs.planets" },
    { key: "dwarfPlanets", labelKey: "tabs.dwarfPlanets" },
    { key: "stars", labelKey: "tabs.stars" },
    { key: "constellations", labelKey: "tabs.constellations" },
    { key: "bookmarks", labelKey: "tabs.bookmarks", suffix: bookmarkCount },
  ];

  return (
    <div
      role="tablist"
      className="flex flex-wrap gap-2 border-b border-white/10 pb-3"
    >
      {tabs.map((tab) => {
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={[
              "rounded-lg px-4 py-2 text-sm transition",
              isActive
                ? "bg-cosmic-accent/20 text-cosmic-glow"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            ].join(" ")}
          >
            {t(tab.labelKey)}
            {tab.suffix != null && tab.suffix > 0 ? (
              <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs">
                {tab.suffix}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Quick smoke test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import enMessages from "@/messages/en/common.json";
import { LibraryTabs } from "../LibraryTabs";

it("renders 5 tabs and calls onChange on click", async () => {
  const onChange = jest.fn();
  const user = userEvent.setup();
  render(
    <NextIntlClientProvider locale="en" messages={{ common: enMessages }}>
      <LibraryTabs active="planets" bookmarkCount={3} onChange={onChange} />
    </NextIntlClientProvider>,
  );
  expect(screen.getByText("3")).toBeInTheDocument();
  await user.click(screen.getByRole("tab", { name: /Stars/i }));
  expect(onChange).toHaveBeenCalledWith("stars");
});
```

- [ ] **Step 3: Commit**

```bash
npm test -- --testPathPattern="LibraryTabs"
git add src/components/library/LibraryTabs.tsx src/components/library/__tests__/LibraryTabs.test.tsx
git commit -m "feat(ui): add LibraryTabs component with bookmark count badge"
```

---

### Task 7: Buat `catalog` utility + rewrite `library/page.tsx`

**Files:** Create `src/lib/library/catalog.ts`, rewrite `src/app/[locale]/library/page.tsx`.

- [ ] **Step 1: Buat `src/lib/library/catalog.ts`**

```ts
import planetsJson from "@/data/solar-system/planets.json";
import dwarfJson from "@/data/solar-system/dwarf-planets.json";
import starsJson from "@/data/stellar/star-catalog.json";
import constellationsJson from "@/data/stellar/constellations.json";
import type { CatalogItem } from "@/components/library/CatalogGrid";
import type { LibraryDetailItem } from "@/components/library/LibraryDetail";

interface PlanetEntry {
  id: string;
  name: string;
  description: string;
  funFacts?: string[];
  radius: number;
  distance: number;
  orbitalPeriod: number;
  mass: number;
  temperature: number;
  moonCount: number;
  color: string;
}
interface DwarfEntry {
  id: string;
  name: string;
  description: string;
  funFacts?: string[];
  radius: number;
  distance: number;
  orbitalPeriod: number;
  mass: number;
  temperature: number;
  moonCount: number;
  color: string;
}
interface StarEntry {
  id: string;
  name: string;
  magnitude: number;
  spectralType: string;
  distance: number;
  color: string;
  content?: {
    en?: { description?: string; facts?: string[] };
    id?: { description?: string; facts?: string[] };
  };
}
interface ConstellationEntry {
  id: string;
  name: string;
  abbreviation: string;
  stars?: Array<unknown>;
  content?: {
    en?: { description?: string; mythology?: string };
    id?: { description?: string; mythology?: string };
  };
}

function earthMassScale(kg: number): string {
  const em = kg / 5.972e24;
  if (em < 0.005) return "<0.01";
  return `${em.toFixed(2)}`;
}

function orbitalDisplay(days: number): string {
  const years = days / 365.25;
  return years >= 1 ? `${years.toFixed(1)} yr` : `${days.toFixed(0)} d`;
}

function tempC(kelvin: number): string {
  const c = kelvin - 273.15;
  return `${Math.round(c)}°C`;
}

function lyOrAU(distance: number, isPlanet: boolean): string {
  return isPlanet ? `${distance.toFixed(1)} AU` : `${distance.toFixed(1)} ly`;
}

const planets = planetsJson.planets as PlanetEntry[];
const dwarfs = dwarfJson.dwarfPlanets as DwarfEntry[];
const stars = starsJson.stars as StarEntry[];
const constellations =
  constellationsJson.constellations as ConstellationEntry[];

export const PLANET_ITEMS: CatalogItem[] = planets.map((p) => ({
  id: p.id,
  title: p.name,
  subtitle: `${p.moonCount} moon${p.moonCount === 1 ? "" : "s"}`,
  type: "planet",
  accentColor: p.color,
  stats: [
    { label: "temp", value: tempC(p.temperature) },
    { label: "radius", value: `${p.radius} R⊕` },
    { label: "distance", value: `${p.distance} AU` },
  ],
}));

export const PLANET_DETAIL: Record<string, LibraryDetailItem> =
  Object.fromEntries(
    planets.map((p) => [
      p.id,
      {
        id: p.id,
        title: p.name,
        type: "planet",
        accentColor: p.color,
        description: p.description,
        facts: p.funFacts,
        stats: [
          { label: "mass", value: earthMassScale(p.mass) + " M⊕" },
          { label: "radius", value: `${p.radius} R⊕` },
          { label: "temperature", value: tempC(p.temperature) },
          { label: "orbitalPeriod", value: orbitalDisplay(p.orbitalPeriod) },
          { label: "moonCount", value: String(p.moonCount) },
          { label: "distance", value: `${p.distance} AU` },
        ],
      },
    ]),
  );

export const DWARF_PLANET_ITEMS: CatalogItem[] = dwarfs.map((d) => ({
  id: d.id,
  title: d.name,
  subtitle: `~${d.moonCount} moons`,
  type: "dwarfPlanet",
  accentColor: d.color,
  stats: [
    { label: "temp", value: tempC(d.temperature) },
    { label: "radius", value: `${d.radius} R⊕` },
    { label: "distance", value: `${d.distance} AU` },
  ],
}));

export const STAR_ITEMS: CatalogItem[] = stars.map((s) => ({
  id: s.id,
  title: s.name,
  subtitle: `${s.spectralType} class`,
  type: "star",
  accentColor: s.color,
  stats: [
    { label: "mag", value: `${s.magnitude}` },
    { label: "type", value: s.spectralType },
    { label: "dist", value: lyOrAU(s.distance, false) },
  ],
}));

export const CONSTELLATION_ITEMS: CatalogItem[] = constellations.map((c) => ({
  id: c.id,
  title: c.name,
  subtitle: c.abbreviation,
  type: "constellation",
  accentColor: "#c9a8ff",
  stats: [
    { label: "stars", value: String(c.stars?.length ?? 0) },
    { label: "abbr", value: c.abbreviation },
  ],
}));

export const STAR_DETAIL: Record<string, LibraryDetailItem> =
  Object.fromEntries(
    stars.map((s) => [
      s.id,
      {
        id: s.id,
        title: s.name,
        type: "star",
        accentColor: s.color,
        description: s.content?.en?.description ?? s.content?.id?.description,
        facts: s.content?.en?.facts ?? s.content?.id?.facts,
        stats: [
          { label: "magnitude", value: String(s.magnitude) },
          { label: "spectralType", value: s.spectralType },
          { label: "distance", value: lyOrAU(s.distance, false) },
        ],
      },
    ]),
  );

export const CONSTELLATION_DETAIL: Record<string, LibraryDetailItem> =
  Object.fromEntries(
    constellations.map((c) => [
      c.id,
      {
        id: c.id,
        title: c.name,
        type: "constellation",
        accentColor: "#c9a8ff",
        description: c.content?.en?.description ?? c.content?.id?.description,
        mythology: c.content?.en?.mythology ?? c.content?.id?.mythology,
        facts: undefined,
        stats: [
          { label: "abbreviation", value: c.abbreviation },
          { label: "starCount", value: String(c.stars?.length ?? 0) },
        ],
      },
    ]),
  );

export const catalog: Record<string, CatalogItem[]> = {
  planets: PLANET_ITEMS,
  dwarfPlanets: DWARF_PLANET_ITEMS,
  stars: STAR_ITEMS,
  constellations: CONSTELLATION_ITEMS,
};

export const detail: Record<string, Record<string, LibraryDetailItem>> = {
  planets: PLANET_DETAIL,
  dwarfPlanets: {},
  stars: STAR_DETAIL,
  constellations: CONSTELLATION_DETAIL,
};
```

- [ ] **Step 2: Tulis ulang `src/app/[locale]/library/page.tsx`**

```tsx
"use client";

import { useMemo, useState, useCallback } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { SlidePanel } from "@/components/ui/SlidePanel";
import { useTranslations } from "next-intl";
import { useBookmarks } from "@/hooks/useBookmarks";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { catalog, detail } from "@/lib/library/catalog";
import { LibraryTabs, LibraryTab } from "@/components/library/LibraryTabs";
import { CatalogGrid } from "@/components/library/CatalogGrid";
import {
  LibraryDetail,
  type LibraryDetailItem,
} from "@/components/library/LibraryDetail";
import { LibraryCard } from "@/components/library/LibraryCard";
import type { LibraryItemType } from "@/components/library/LibraryCard";
import { cosmicEventBus } from "@/lib/events/event-bus";

export default function LibraryPage() {
  const t = useTranslations("common.library");
  const [tab, setTab] = useState<LibraryTab>("planets");
  const [detailItem, setDetailItem] = useState<LibraryDetailItem | null>(null);
  const { bookmarks } = useBookmarks();
  const setTarget = useExplorerStore((s) => s.setTarget);

  const visible = useMemo(() => catalog[tab] ?? [], [tab]);
  const empty =
    tab === "bookmarks" ? bookmarks.length === 0 : visible.length === 0;

  const handleSelect = useCallback(
    (id: string, type: LibraryItemType) => {
      if (tab === "bookmarks") {
        const bookmark = bookmarks.find((b) => b.id === id);
        if (!bookmark?.selectedObject || !bookmark?.selectedType) return;
        setTarget(bookmark.selectedObject, bookmark.selectedType);
        window.location.href = "/";
        return;
      }
      const item = catalog[tab].find((c) => c.id === id);
      if (!item) return;
      const fullDetail =
        detail[tab][id] ??
        ({
          id: item.id,
          title: item.title,
          type: item.type,
          accentColor: item.accentColor,
          description: t("noContent"),
          stats: item.stats ? item.stats.map((s) => ({ ...s })) : [],
        } satisfies LibraryDetailItem);
      setDetailItem(fullDetail);
      cosmicEventBus.emit({
        category: "library_accessed",
        targetId: id,
        metadata: { type },
      });
    },
    [tab, bookmarks, setTarget, t],
  );

  const handleExplore = useCallback(
    (id: string, type: LibraryItemType) => {
      setDetailItem(null);
      setTarget(id, type);
      window.location.href = "/";
    },
    [setTarget],
  );

  return (
    <AppShell breadcrumb={t("title").toUpperCase()}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <header>
          <h1 className="text-3xl font-bold text-white">{t("title")}</h1>
          <p className="mt-1 text-white/50">{t("subtitle")}</p>
        </header>

        <LibraryTabs
          active={tab}
          bookmarkCount={bookmarks.length}
          onChange={setTab}
        />

        {tab === "bookmarks" ? (
          empty ? (
            <div className="flex h-64 items-center justify-center rounded-xl border border-dashed border-white/10 bg-cosmic-nebula/20 p-6 text-center text-white/40">
              {t("empty.bookmarks")}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
              {bookmarks.map((b) => (
                <LibraryCard
                  key={b.id}
                  id={b.id}
                  title={b.name}
                  subtitle={b.scale}
                  type={(b.selectedType as LibraryItemType | null) ?? "planet"}
                  accentColor="#7cb9ff"
                  stats={[
                    { label: "day", value: `+${Math.round(b.dayOffset)}` },
                  ]}
                  onSelect={handleSelect}
                />
              ))}
            </div>
          )
        ) : (
          <CatalogGrid
            items={visible}
            emptyLabel={t(`empty.${tab}`)}
            onSelect={handleSelect}
          />
        )}
      </div>

      <SlidePanel open={detailItem != null} onClose={() => setDetailItem(null)}>
        {detailItem ? (
          <LibraryDetail
            item={detailItem}
            onExplore={handleExplore}
            onClose={() => setDetailItem(null)}
          />
        ) : null}
      </SlidePanel>
    </AppShell>
  );
}
```

- [ ] **Step 3: Verify**

```bash
npm run type-check
npm run lint
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/library/catalog.ts src/app/[locale]/library/page.tsx
git commit -m "feat(library): rewrite library page with browse, detail panel, bookmarks integration"
```

---

### Task 8: Tambah "Cosmic Reader" achievement

**Files:** Modify `src/data/achievements-catalog.json`

- [ ] **Step 1: Append achievement**

Read `src/data/achievements-catalog.json`, find the `achievements` array, add this entry:

```json
{
  "id": "cosmic_reader",
  "title": "Cosmic Reader",
  "description": {
    "en": "Visit 5 different celestial objects in the Library.",
    "id": "Kunjungi 5 objek langit berbeda di Pustaka."
  },
  "icon": "book",
  "category": "mastery",
  "xp": 50,
  "rule": {
    "type": "count_unique",
    "category": "library_accessed",
    "threshold": 5
  }
}
```

- [ ] **Step 2: Verify JSON valid**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/data/achievements-catalog.json','utf8'))"
```

- [ ] **Step 3: Commit**

```bash
git add src/data/achievements-catalog.json
git commit -m "feat(achievement): add Cosmic Reader for 5 unique library_accessed"
```

---

### Task 9: Final verification pipeline

- [ ] **Step 1: Full pipeline**

```bash
npm run check-env
npm run type-check
npm run lint
npm test -- --coverage
npm run build
```

All exit 0. Test coverage tidak turun dari baseline. Build sukses.

- [ ] **Step 2: Manual smoke**

```bash
npm run dev
```

Verify: 5 tabs, cards per tab, detail SlidePanel, "Explore in 3D" navigasi, empty state bookmarks.

- [ ] **Step 3: Tag**

```bash
git tag v0.3.0-library -m "Library page: browse + detail + bookmarks + Cosmic Reader achievement"
```
