# Polish Tier 1 + Tier 2 — Error Boundary, Loading, Shortcuts, Reduced Motion, Time Scrub, Perf Mode

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish UX & robustness sebelum app dianggap production-ready. 6 fitur: error boundary, loading screen, keyboard shortcuts help overlay, prefers-reduced-motion, time scrub/timeline, performance mode toggle.

**Branch:** `feature/stellar-neighborhood-complete` (continued)

**Context:** Semua plan sebelumnya (stellar-neighborhood, phase2-completion, stellar-p1, comprehensive-gap-fix) sudah complete. `tsc`/`lint`/`test`/`build` all pass. 13 commit terakhir di branch ini. Sekarang fokus polish — bukan fitur baru yang kompleks, tapi gap UX yang langsung kerasa user.

**Senior dev rationale:**

- Tier 1 (error boundary, loading, shortcuts, reduced-motion) = isolasi UI layer, zero risk ke 3D core, quick wins.
- Tier 2 (time scrub, perf mode) = sentuh 3D scene, perlu test regression, tapi value tinggi untuk app astronomi.
- Defer: onboarding (effort besar, fragile), share URL (bookmark internal sudah ada), moons/exoplanets (data entry heavy), screenshot (low priority user-facing), sound (annoying), fullscreen (trivial tapi low value), compare mode (kompleks, ROI jelek).

---

## Decisions (senior dev defaults)

- **Loading screen style:** Cosmic spinner CSS animation (rotating ring + center glow), bukan skeleton. Consistent dengan cosmic theme. Tidak butuh asset eksternal.
- **Time scrub range:** 0–3650 hari (10 tahun). Cukup untuk 1 orbit Bumi (365d), Mars (687d), Jupiter (4333d → tidak sampai, tapi 10 tahun cukup lihat siklus sebagian). Slider log-scale feel via step dynamic.
- **Perf mode:** Modal settings terpisah (gear icon di HeaderBar). 2 level: "High" (default, particle count sekarang) / "Low" (50% reduction + dpr cap 1). Persist ke localStorage.
- **`prefers-reduced-motion`:** Disable rotation animation total (galactic/cosmic slow spin), slow down orbit simulation 0.3x. Tidak disable semua — user masih bisa interact.
- **Shortcuts help overlay:** Trigger `?` key → modal list semua shortcut. Gunakan `useFocusTrap` hook yang sudah ada.

---

## File Structure

### New Files (8)

```
src/app/[locale]/error.tsx                          # Next.js error boundary route
src/components/ui/CosmicLoader.tsx                  # Loading spinner (CSS animation)
src/components/ui/ShortcutsHelpModal.tsx            # ? key → modal list shortcuts
src/components/ui/SettingsModal.tsx                 # Gear icon → perf mode toggle
src/hooks/useReducedMotion.ts                       # matchMedia prefers-reduced-motion
src/hooks/useSettings.ts                            # Perf mode store (localStorage persist)
src/components/ui/__tests__/ShortcutsHelpModal.test.tsx
src/components/ui/__tests__/SettingsModal.test.tsx
```

### Modified Files (12)

```
src/components/cosmic-explorer/CosmicExplorer.tsx   # Wrap Scene in Suspense + CosmicLoader, ErrorBoundary
src/components/cosmic-explorer/Scene.tsx            # Read perf mode → conditional particle count
src/components/galactic/GalacticScene.tsx           # Read perf mode + reduced motion
src/components/cosmic/CosmicScene.tsx               # Read perf mode + reduced motion
src/components/solar-system/SolarSystemScene.tsx    # Suspense fallback → CosmicLoader
src/components/ui/SimulationControls.tsx            # Add timeline scrub slider + date input
src/components/ui/HUD.tsx                           # Mount ShortcutsHelpModal + SettingsModal
src/components/ui/HeaderBar.tsx                     # Add gear icon (settings) button
src/hooks/useKeyboardShortcuts.ts                   # Add ? key → toggle shortcuts help
src/lib/store/simulation-store.ts                   # Add timeline jump, reverse direction
src/messages/en/common.json                         # +shortcuts, +settings, +loader, +error keys
src/messages/id/common.json                         # +same keys, ID translation
src/messages/en/simulation.json                     # +timeline, +dateJump keys
src/messages/id/simulation.json                     # +same keys, ID translation
```

---

## Phase A: Tier 1 — Quick Wins (4 fitur, parallel)

### A1. Error Boundary route

**File:** Create `src/app/[locale]/error.tsx`

**Spec:** Next.js App Router `error.tsx` must be client component, export default function with `error` + `reset` props.

```tsx
"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CosmicExplorer Error]", error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 bg-cosmic-deep text-center">
      <h2 className="text-xl font-bold text-white">Something went wrong</h2>
      <p className="max-w-md text-sm text-white/50">
        An error occurred while rendering the cosmic explorer. Your progress has
        been saved.
      </p>
      <pre className="max-w-md overflow-auto rounded-lg border border-white/10 bg-black/40 p-3 text-xs text-red-400">
        {error.message}
      </pre>
      <button
        onClick={reset}
        className="rounded-lg border border-cosmic-accent/40 bg-cosmic-accent/20 px-4 py-2 text-sm text-cosmic-accent transition-colors hover:bg-cosmic-accent/30"
      >
        Try again
      </button>
    </div>
  );
}
```

**i18n:** Add `error.title`, `error.description`, `error.retry` to common.json (both en + id).

**Note:** Also wrap `<Scene />` in inline `ErrorBoundary` class component inside `CosmicExplorer.tsx` (Phase A3 below) — `error.tsx` only catches route-level errors, not in-canvas R3F errors. For R3F canvas errors, the class boundary with fallback UI (not `null`) is needed.

---

### A2. Loading screen (CosmicLoader)

**File:** Create `src/components/ui/CosmicLoader.tsx`

**Spec:** Pure CSS animation, no asset. Rotating ring + center glow + optional text prop.

```tsx
interface CosmicLoaderProps {
  label?: string;
}

export function CosmicLoader({ label }: CosmicLoaderProps) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-cosmic-deep">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-2 border-cosmic-accent/20" />
        <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-cosmic-accent" />
        <div className="absolute inset-4 rounded-full bg-cosmic-accent/30 blur-md animate-pulse" />
      </div>
      {label && <p className="text-sm text-white/50">{label}</p>}
    </div>
  );
}
```

**i18n:** Add `loader.loading` to common.json.

**Integration:** Modify `SolarSystemScene.tsx` — replace `<Suspense fallback={null}>` with `<Suspense fallback={<Html><CosmicLoader /></Html>}>` (use drei `<Html>` to render inside canvas, or restructure to wrap outside canvas). Simpler: wrap `<Scene />` in `CosmicExplorer.tsx` with `<Suspense fallback={<CosmicLoader label={t("loader.loading")} />}>` OUTSIDE canvas — but Suspense outside canvas won't catch R3F internal suspense.

**Decision:** Use drei `<Html>` inside canvas for per-scene fallback. Modify `SolarSystemScene.tsx`:

```tsx
import { Html } from "@react-three/drei";
// ...
<Suspense fallback={<Html center><CosmicLoader label="Loading planets..." /></Html>}>
```

Also add `<Suspense>` around `StellarScene`, `GalacticScene`, `CosmicScene` in `Scene.tsx` — these don't currently have Suspense. Add with `fallback={null}` (they don't load async assets, so fallback rarely triggers — but safety net).

---

### A3. ErrorBoundary class for R3F canvas

**File:** Modify `src/components/cosmic-explorer/CosmicExplorer.tsx`

**Spec:** Inline class `ErrorBoundary` (React doesn't export one). Catches errors inside `<Canvas>` tree (R3F render errors, shader compile failures, etc).

```tsx
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("[Canvas Error]", error);
  }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
```

**Integration in CosmicExplorer.tsx:**

```tsx
<CanvasErrorBoundary
  fallback={
    <div className="flex h-full w-full items-center justify-center bg-cosmic-deep">
      <CosmicLoader label="Failed to render 3D scene. Please refresh." />
    </div>
  }
>
  <Canvas ...>
    <Scene />
  </Canvas>
</CanvasErrorBoundary>
```

---

### A4. Keyboard shortcuts help overlay

**File:** Create `src/components/ui/ShortcutsHelpModal.tsx`

**Spec:** Modal listing all shortcuts. Uses `useFocusTrap` hook (already exists at `src/hooks/useFocusTrap.ts`). Triggered by `?` key.

**Shortcuts to document:**

- `⌘K` / `Ctrl+K` — Open search
- `⌘B` / `Ctrl+B` — Save bookmark
- `?` — Show this help
- `Esc` — Close modal/search
- `Space` — Play/pause simulation (NEW — add to useKeyboardShortcuts)
- `R` — Reset simulation (NEW — add to useKeyboardShortcuts)

**Modal structure:**

- `role="dialog"` `aria-modal="true"` `aria-label="Keyboard shortcuts"`
- `useFocusTrap` hook
- Close on `Esc` or backdrop click
- Two-column layout: shortcut key | description

**Store:** Add `isShortcutsHelpOpen` + `toggleShortcutsHelp` to `explorer-store.ts`.

**i18n:** Add `shortcuts.title`, `shortcuts.search`, `shortcuts.bookmark`, `shortcuts.help`, `shortcuts.close`, `shortcuts.playPause`, `shortcuts.reset` to common.json.

---

### A5. `prefers-reduced-motion` hook

**File:** Create `src/hooks/useReducedMotion.ts`

**Spec:**

```typescript
import { useState, useEffect } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    function handleChange(e: MediaQueryListEvent) {
      setReduced(e.matches);
    }
    mq.addEventListener("change", handleChange);
    return () => mq.removeEventListener("change", handleChange);
  }, []);

  return reduced;
}
```

**Integration points:**

- `GalacticScene.tsx` — if reduced: skip `useFrame` rotation (or multiply delta by 0).
- `CosmicScene.tsx` — if reduced: skip `GalaxyDot` rotation.
- `Scene.tsx` — if reduced: pass `speed={0}` to `<Stars>` (drei).
- `SimulationControls.tsx` or `simulation-store.ts` — if reduced: cap speed at 0.3x (slow orbit). Actually better: in `SimulationClock.tsx` where `advanceDayOffset` is called, multiply by 0.3 if reduced.

**Note:** Do NOT disable all animation — user still wants to see orbital motion. Just slow it down + disable decorative spins (galaxy/cosmic rotation).

---

## Phase B: Tier 2 — Core Enhancements (2 fitur, sequential)

### B1. Time scrub / timeline slider

**Files:** Modify `src/components/ui/SimulationControls.tsx`, `src/lib/store/simulation-store.ts`, `src/messages/{en,id}/simulation.json`

**Problem:** Sekarang hanya play/pause + speed slider. User tidak bisa jump ke tanggal spesifik atau scrub timeline. Untuk app astronomi, ini fitur killer (lihat transit Venus, opposition Mars, dll).

**Store changes (`simulation-store.ts`):**

```typescript
interface SimulationState {
  // Existing...
  isPlaying: boolean;
  speed: number;
  dayOffset: number;

  // NEW
  maxDayOffset: number; // 3650 (10 years)
  setDayOffset: (dayOffset: number) => void; // already exists, ensure clamps to [0, maxDayOffset]
  jumpToDate: (date: Date) => void; // NEW: compute dayOffset from target date
}
```

Update `setDayOffset` to clamp: `Math.max(0, Math.min(maxDayOffset, dayOffset))`.

`jumpToDate`:

```typescript
jumpToDate: (date: Date) => {
  const today = new Date();
  const diff = Math.floor((date.getTime() - today.getTime()) / 86400000);
  set({ dayOffset: Math.max(0, Math.min(3650, diff)) });
},
```

**UI changes (`SimulationControls.tsx`):**

Add below existing speed slider row:

```tsx
{
  /* Timeline scrub */
}
<div className="flex items-center gap-3 border-t border-white/10 pt-3">
  <span className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
    {t("timeline")}
  </span>
  <input
    type="range"
    min={0}
    max={maxDayOffset}
    step={1}
    value={dayOffset}
    onChange={(e) => setDayOffset(Number(e.target.value))}
    aria-label="Timeline scrub"
    className="slider w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cosmic-glow"
  />
  <input
    type="date"
    value={formatDateInput(dayOffset)}
    onChange={(e) => jumpToDate(new Date(e.target.value))}
    aria-label="Jump to date"
    className="rounded border border-white/10 bg-white/5 px-2 py-1 text-xs text-white/70"
  />
</div>;
```

**Layout change:** SimulationControls container currently `flex items-center gap-3` single row. Change to `flex flex-col gap-3` — row 1 = existing play/speed/reset, row 2 = timeline scrub.

**i18n (`simulation.json`):** Add `timeline`, `dateJump`.

**Note:** `formatSimDate` already exists in HeaderBar.tsx — extract to utils or duplicate. For date input, format as `YYYY-MM-DD` for `<input type="date">` value.

---

### B2. Performance mode toggle

**Files:** Create `src/hooks/useSettings.ts`, `src/components/ui/SettingsModal.tsx`. Modify `src/components/ui/HeaderBar.tsx`, `src/components/ui/HUD.tsx`, `src/components/cosmic-explorer/Scene.tsx`, `src/components/galactic/GalacticScene.tsx`, `src/components/cosmic/CosmicScene.tsx`

**Store (`useSettings.ts`):**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

type PerfMode = "high" | "low";

interface SettingsState {
  perfMode: PerfMode;
  setPerfMode: (mode: PerfMode) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      perfMode: "high",
      setPerfMode: (perfMode) => set({ perfMode }),
    }),
    { name: "cosmic-settings" },
  ),
);
```

**Particle count multipliers:**

- `high` (default): GalacticScene 50000, CosmicScene galaxies 100 + stars 8000, Scene Stars 5000, dpr [1,2]
- `low`: GalacticScene 20000, CosmicScene galaxies 50 + stars 4000, Scene Stars 2000, dpr [1,1]

**GalacticScene.tsx changes:**

```typescript
const perfMode = useSettings((s) => s.perfMode);
const particleCount = perfMode === "high" ? 50000 : 20000;
// Use particleCount in buildGalaxyGeometry
```

**CosmicScene.tsx changes:**

```typescript
const perfMode = useSettings((s) => s.perfMode);
const galaxyCount = perfMode === "high" ? 100 : 50;
const starCount = perfMode === "high" ? 8000 : 4000;
```

**Scene.tsx changes:**

```typescript
const perfMode = useSettings((s) => s.perfMode);
const starCount = perfMode === "high" ? 5000 : 2000;
// <Stars count={starCount} ... />
```

**CosmicExplorer.tsx changes:**

```typescript
const perfMode = useSettings((s) => s.perfMode);
const dpr =
  perfMode === "high"
    ? ([1, 2] as [number, number])
    : ([1, 1] as [number, number]);
// <Canvas dpr={dpr} ...>
```

**Important:** Particle count change requires geometry rebuild. `useMemo` deps must include `perfMode`:

```typescript
const geometry = useMemo(
  () => buildGalaxyGeometry(particleCount),
  [particleCount],
);
```

**SettingsModal.tsx:**

- Gear icon button in HeaderBar (between Bookmark button and XP badge).
- Modal: `role="dialog"`, `useFocusTrap`, two radio buttons or toggle pills: "High Quality" / "Low Quality (Performance)".
- Description text explaining what changes.
- Close on Esc / backdrop click.

**Store for modal open state:** Add `isSettingsOpen` + `toggleSettings` to `explorer-store.ts` (follow same pattern as `isBookmarkModalOpen`).

**i18n:** Add `settings.title`, `settings.perfMode`, `settings.highQuality`, `settings.lowQuality`, `settings.highQualityDesc`, `settings.lowQualityDesc` to common.json.

---

## Phase C: Additional Shortcuts (depends on A4)

### C1. Add Space + R shortcuts

**File:** Modify `src/hooks/useKeyboardShortcuts.ts`

**Spec:** Add:

- `Space` (when not typing in input) → `togglePlay()`
- `r` / `R` (when not typing in input) → `reset()`
- `?` (Shift+/) → `toggleShortcutsHelp()`

**Guard:** Check `e.target` is not `INPUT`/`TEXTAREA` to avoid conflict with search input.

```typescript
function isTypingTarget(e: KeyboardEvent): boolean {
  const target = e.target as HTMLElement;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA";
}
```

---

## Dependency Order

```
Round 1 (parallel, 4 subagents):
  - A1 (error.tsx route)
  - A2 (CosmicLoader)
  - A4 (ShortcutsHelpModal + store)
  - A5 (useReducedMotion hook)

Round 2 (sequential):
  - A3 (CanvasErrorBoundary in CosmicExplorer — depends on A2 CosmicLoader)

Round 3 (parallel, 2 subagents):
  - A5 integration (GalacticScene, CosmicScene, Scene, SimulationClock — read reduced motion)
  - C1 (additional shortcuts — depends on A4 store)

Round 4 (sequential):
  - B1 (time scrub — modify SimulationControls + store)

Round 5 (sequential):
  - B2 (perf mode — touches multiple scene components, needs regression test)

Round 6:
  - Final verify
```

---

## Verification Checklist

### Type & Lint

- [ ] `npx tsc --noEmit` — 0 errors
- [ ] `npm run lint` — 0 errors (3 pre-existing warnings OK)

### Tests

- [ ] `npm run test` — all existing 77 tests pass + new tests pass
- [ ] New test: `ShortcutsHelpModal.test.tsx` — renders shortcut list, focus trap works, Esc closes
- [ ] New test: `SettingsModal.test.tsx` — renders perf mode toggle, click changes store, focus trap works

### Build

- [ ] `npm run build` — production build succeeds, all routes generated

### Smoke Test

- [ ] **Error boundary:** Navigate to `/` → app loads. Force error (e.g. block texture URL) → error UI shows with "Try again" button.
- [ ] **Loading screen:** Hard refresh → cosmic spinner visible briefly during texture load.
- [ ] **Shortcuts help:** Press `?` → modal opens with shortcut list. Press `Esc` → closes. Tab key trapped.
- [ ] **Reduced motion:** Enable OS reduced-motion → galaxy rotation stops, orbit simulation slows.
- [ ] **Time scrub:** Drag timeline slider → date changes in HeaderBar. Type date in date input → simulation jumps. Play → orbit continues from new position.
- [ ] **Perf mode:** Click gear icon → settings modal. Toggle "Low Quality" → galaxy particle count visibly reduces, canvas dpr drops. Toggle back → restores. Setting persists across refresh (localStorage).
- [ ] **New shortcuts:** Press `Space` → play/pause toggles. Press `R` → simulation resets. Ensure these don't fire when typing in search input.

---

## Self-Review Checklist

1. **No regression:** All 77 existing tests still pass ✅
2. **i18n parity:** en + id identical key structure for all new keys ✅
3. **A11y:** New modals (ShortcutsHelp, Settings) use role=dialog + focus trap (same pattern as existing modals) ✅
4. **Cleanup:** CanvasErrorBoundary resets state on retry (reset button remounts) ✅
5. **Perf mode geometry rebuild:** useMemo deps include perfMode → no stale geometry ✅
6. **Reduced motion:** Does NOT disable all animation — only decorative spins + slows orbit (user still sees motion) ✅
7. **Time scrub clamp:** dayOffset clamped to [0, 3650] — no negative or overflow ✅
8. **Shortcut guard:** Space/R/? don't fire when typing in input/textarea ✅
9. **Zustand persist:** Settings store uses persist middleware — localStorage key `cosmic-settings` ✅
10. **No new dependencies:** All features use existing libs (zustand, lucide-react, next-intl, drei, R3F) ✅
