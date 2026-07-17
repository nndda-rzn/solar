# Phase 2 Completion — Achievements + Progress + Bookmarks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Selesaikan Phase 2 end-to-end — event bus integration ke seluruh komponen producer, hooks data/logic layer, UI components (Toast, BookmarkSaveModal, ProfileTabs), bookmark save/restore, achievement toast notifications, XP badge + level display.

**Branch:** `feature/stellar-neighborhood-complete` (lanjut, sudah ada foundation)

**Context:** Foundation Phase 2 sudah ada (types, catalog, rule evaluator + tests, event bus, 3 providers, `useProgress`, `useAchievements`, DB schema, seed script). Yang belum: logic hooks, UI components, event emit integration, store camera position, profile tabs, i18n strings.

**Architecture:** Event-driven (cosmicEventBus), 3-layer hook composition (data→logic→feature), provider pattern for storage, cosmic glassmorphism UI, framer-motion untuk toast animation.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase (Postgres), Zustand, Tailwind CSS v4, Lucide-react icons, framer-motion (NEW).

---

## Decisions (user-approved)

- **Toast animation:** framer-motion (install baru, ~50KB bundle)
- **Bookmark thumbnail:** skip — simpan metadata saja (scale, selected object, date, camera position)
- **XP/Level formula:** linear — `level = floor(totalXp / 100)`
- **Profile page layout:** full-page tabs (horizontal tabs di atas, content di bawah)

---

## Foundation (sudah ada — JANGAN re-create)

| File                                            | Status | Catatan                                                                       |
| ----------------------------------------------- | ------ | ----------------------------------------------------------------------------- |
| `src/types/progress.ts`                         | ✅     | Progress + ProgressRow + mapProgressRow                                       |
| `src/types/achievement.ts`                      | ✅     | Achievement + Rule + AchievementDefinition + mapAchievementRow                |
| `src/types/bookmark.ts`                         | ✅     | Bookmark + BookmarkRow + BookmarkCreatePayload + mapBookmarkRow               |
| `src/data/achievements-catalog.json`            | ✅     | 12 achievements, rule-based, i18n en/id                                       |
| `src/lib/rules/ruleEvaluator.ts`                | ✅     | 5 rule types: count_unique, has_target, count_total, time_window, combination |
| `src/lib/utils/__tests__/ruleEvaluator.test.ts` | ✅     | 5 test suites passing                                                         |
| `src/lib/events/event-bus.ts`                   | ✅     | Typed emitter, 11 event types. Lint fixed (typed listeners).                  |
| `src/lib/providers/supabase-progress.ts`        | ✅     | `list`, `track`, `hasProgress`, `delete`                                      |
| `src/lib/providers/supabase-achievements.ts`    | ✅     | `list`, `award`                                                               |
| `src/lib/providers/supabase-bookmarks.ts`       | ✅     | `list`, `create`, `rename`, `remove`                                          |
| `src/hooks/useProgress.ts`                      | ✅     | auth-gated, cache, track/hasProgress/getCount/getUniqueCount/getRecent        |
| `src/hooks/useAchievements.ts`                  | ✅     | auth-gated, list, isEarned, totalXp, checkAndAward                            |
| `docs/sql/supabase-schema.sql`                  | ✅     | Phase 2 tables + RLS + triggers                                               |
| `src/scripts/seed.ts`                           | ✅     | Sample data                                                                   |

---

## File Structure

### New Files (10)

```
src/hooks/useBookmarks.ts                    # Data: bookmark CRUD + cache
src/hooks/useToast.ts                        # Logic: toast context hook
src/hooks/useAchievementTracker.ts           # Logic: wire progress→check→toast
src/components/ui/Toast.tsx                  # ToastProvider + ToastItem (framer-motion)
src/components/ui/BookmarkSaveModal.tsx      # Two-step bookmark save modal
src/components/profile/ProfileTabs.tsx       # Tab container (4 tabs, full-page)
src/components/profile/ProgressTab.tsx       # Stats grid + recent timeline
src/components/profile/AchievementsTab.tsx   # Achievement grid (unlocked/locked/hidden)
src/components/profile/BookmarksTab.tsx      # Bookmark grid + restore/delete
```

### Modified Files (13)

```
src/lib/store/explorer-store.ts              # +cameraPosition, +isBookmarkModalOpen, +bookmark capture helper
src/components/cosmic-explorer/Camera.tsx    # Expose pos to store (throttled)
src/hooks/useKeyboardShortcuts.ts            # +Ctrl+B bookmark shortcut
src/components/ui/HUD.tsx                    # Mount ToastProvider + AchievementTracker + BookmarkSaveModal
src/components/ui/HeaderBar.tsx              # +Bookmark button, +XP badge, +level display
src/components/ui/InfoPanel.tsx              # Emit planet_visited + panel_opened events
src/components/ui/StellarInfoPanel.tsx       # Emit star_visited + constellation_visited + panel_opened
src/components/ui/SearchModal.tsx            # Emit search_used event
src/components/cosmic-explorer/ScaleManager.tsx   # Emit scale_reached event
src/components/ui/ScaleIndicator.tsx        # Emit scale_reached (manual click)
src/lib/store/simulation-store.ts           # Emit time_traveled on threshold cross
src/app/[locale]/profile/page.tsx           # Replace <ProfileForm> → <ProfileTabs>
src/lib/utils/validators.ts                 # +validateBookmarkName
src/messages/en/common.json                 # +profile tabs + toast + bookmark + XP strings
src/messages/id/common.json                 # +profile tabs + toast + bookmark + XP strings
```

### New Dependency

```
framer-motion   # Toast animation (install: npm install framer-motion)
```

---

## Dependency Graph (eksekusi paralel)

```
Group A (hooks: 3 subagents) ──┐
                               ├──> Group C (store+integration) ──> Group D (emit: 5 subagents) ──┐
Group B (UI: 6 subagents) ─────┤                                                                  │
                               │                                                                  │
Group E (i18n+validators+page) ┘                                                                  │
                                                                                                  │
                                                                                          Group F (verify)
```

- **Round 1 (paralel):** Groups A + B + E (10 subagents)
- **Round 2 (sequential):** Group C (5 tasks, depend on A+B types)
- **Round 3 (paralel):** Group D (5 subagents, depend on C1 store)
- **Round 4 (sequential):** Group F verification

---

## Group A: Hooks Data/Logic Layer (paralel, 3 subagents)

### A1. `src/hooks/useBookmarks.ts`

**Pattern:** `useProgress.ts` (auth-gated, cache, CRUD).

**API:**

```typescript
export function useBookmarks() {
  // Returns:
  bookmarks: Bookmark[];
  isLoading: boolean;
  create(payload: BookmarkCreatePayload): Promise<Bookmark | null>;
  rename(id: string, name: string): Promise<void>;
  remove(id: string): Promise<void>;
}
```

**Implementation notes:**

- `useEffect` on `user`/`isAuthenticated` → `supabaseBookmarkProvider.list(user.id)`.
- `create` calls provider → push to cache.
- `rename` calls provider → update cache.
- `remove` calls provider → filter out from cache.
- `userIdRef` pattern dari `useProgress`.

### A2. `src/hooks/useToast.ts`

**Type:**

```typescript
export interface Toast {
  id: string;
  title: string;
  description?: string;
  icon?: string; // Lucide icon name
  variant?: "achievement" | "info" | "error";
}
```

**API:**

```typescript
export function useToast() {
  // Returns:
  toasts: Toast[];
  push(toast: Omit<Toast, "id">): string;  // returns id
  dismiss(id: string): void;
}
```

**Implementation notes:**

- React Context + useState.
- `push` generates id (crypto.randomUUID()), auto-dismiss after 5s via setTimeout.
- `dismiss` clears timeout + removes.

### A3. `src/hooks/useAchievementTracker.ts`

**Logic:** Mount di HUD (invisible component). Subscribe `cosmicEventBus`.

**Flow:**

1. `cosmicEventBus.on("planet_visited")` → `useProgress.track("visited_planet", id)`.
2. `cosmicEventBus.on("star_visited")` → `useProgress.track("visited_star", id)`.
3. `cosmicEventBus.on("constellation_visited")` → `useProgress.track("visited_constellation", id)`.
4. `cosmicEventBus.on("search_used")` → `useProgress.track("search_used", query)`.
5. `cosmicEventBus.on("scale_reached")` → `useProgress.track("scale_reached", scale)`.
6. `cosmicEventBus.on("time_traveled")` → if dayOffset >= 365: `useProgress.track("time_traveled", "day_365")`.
7. `cosmicEventBus.on("bookmark_saved")` → `useProgress.track("bookmark_created", id)`.
8. `cosmicEventBus.on("panel_opened")` → `useProgress.track("panel_opened", id)`.
9. `cosmicEventBus.on("speed_reached")` → `useProgress.track("speed_reached", String(speed))`.

**After each track:** call `useAchievements.checkAndAward(progress)`. For each newly-awarded achievement:

- `cosmicEventBus.emit({ type: "achievement_unlocked", payload: { achievementType, title, xp } })`.
- `useToast.push({ title: "Achievement Unlocked!", description: title, icon, variant: "achievement" })`.
- Compute level: `floor(totalXp / 100)`. If level increased: `cosmicEventBus.emit({ type: "level_up", payload: { from, to } })` + toast.

**Implementation:**

- Returns `null` (invisible). Uses `useProgress`, `useAchievements`, `useToast`.
- `useEffect` with empty deps → subscribe once, cleanup on unmount.

---

## Group B: UI Components (paralel, 6 subagents)

### B1. `src/components/ui/Toast.tsx`

**Structure:** `ToastProvider` (context) + `ToastContainer` (renders stack) + `ToastItem`.

**Design:** Cosmic glassmorphism.

- Position: `fixed top-4 right-4 z-[100]`, stack vertical.
- `framer-motion`: `AnimatePresence` + `motion.div` with `initial={{opacity:0, x:50}}` `animate={{opacity:1, x:0}}` `exit={{opacity:0, x:50}}`.
- Variants:
  - `achievement`: gold border (`border-yellow-400/40`), `bg-yellow-400/10`, Sparkles icon.
  - `info`: blue border (`border-cosmic-accent/40`), `bg-cosmic-accent/10`.
  - `error`: red border (`border-red-400/40`), `bg-red-400/10`.

**Context:** `useToast()` hook reads from this provider.

### B2. `src/components/ui/BookmarkSaveModal.tsx`

**Props:** none (reads store `isBookmarkModalOpen`, `cameraPosition`, `cameraTarget`, `selectedPlanet`/`selectedStar`/`selectedConstellation`, `dayOffset`, `scale`).

**Flow:**

1. Modal open when `isBookmarkModalOpen === true`.
2. Input: name (validated `validateBookmarkName`, 1-50 chars).
3. Show summary: scale, selected object, date.
4. Save → `useBookmarks.create({ name, cameraPosition, cameraTarget, selectedObject, selectedType, dayOffset, scale, thumbnailUrl: "" })`.
5. Emit `cosmicEventBus.emit({ type: "bookmark_saved", payload: { id } })`.
6. Close modal.
7. Toast: "Bookmark saved".

**Design:** Centered modal, backdrop blur, cosmic glassmorphism. framer-motion enter/exit.

### B3. `src/components/profile/ProfileTabs.tsx`

**Layout:** Full-page. Horizontal tabs di atas, content di bawah.

**Tabs:**

1. Profile (render `<ProfileForm />` existing)
2. Progress (render `<ProgressTab />`)
3. Achievements (render `<AchievementsTab />`)
4. Bookmarks (render `<BookmarksTab />`)

**State:** `useState<number>(0)` untuk active tab index.

**Design:** Tabs pill-style, active = `bg-cosmic-accent/20 text-cosmic-accent border-cosmic-accent/40`.

### B4. `src/components/profile/ProgressTab.tsx`

**Data:** `useProgress()`.

**Layout:**

- Stats grid (6 cards): Planets Visited (`getUniqueCount("visited_planet")`), Stars (`visited_star`), Constellations (`visited_constellation`), Searches (`search_used`), Bookmarks (`bookmark_created`), Panels Opened (`panel_opened`).
- Recent Timeline: `getRecent(10)` → list dengan icon per category + relative time.

### B5. `src/components/profile/AchievementsTab.tsx`

**Data:** `useAchievements()` (catalog + earned + isEarned + totalXp).

**Layout:**

- Header: total XP + level badge (`floor(totalXp / 100)`).
- Grid 12 achievements (3 cols desktop, 2 cols tablet, 1 col mobile).
- States:
  - Unlocked (`isEarned(def.id)`): full color, Sparkles icon, earned date.
  - Locked (not `def.hidden`): greyed, Lock icon, description visible.
  - Hidden (`def.hidden && !isEarned`): ??? placeholder, "Hidden achievement".

### B6. `src/components/profile/BookmarksTab.tsx`

**Data:** `useBookmarks()`.

**Layout:**

- Grid bookmarks (responsive).
- Each card: name, scale badge, created date, Restore button, Delete button.
- Empty state: "No bookmarks yet. Press Ctrl+B to save your current view."

**Restore action:**

1. `setScale(bookmark.scale)`.
2. `setCameraTarget(bookmark.cameraTarget ?? bookmark.cameraPosition)`.
3. `selectPlanet/Star/Constellation(bookmark.selectedObject)` based on `selectedType`.
4. `setDayOffset(bookmark.dayOffset)` (simulation-store).

**Delete action:** confirm → `useBookmarks.remove(id)` → toast.

---

## Group C: Store & Integration (sequential, 5 tasks)

### C1. Modify `src/lib/store/explorer-store.ts`

**Add to interface + impl:**

```typescript
// Camera position (for bookmark capture)
cameraPosition: THREE.Vector3 | null;
setCameraPosition: (pos: THREE.Vector3 | null) => void;

// Bookmark modal
isBookmarkModalOpen: boolean;
toggleBookmarkModal: () => void;
setBookmarkModalOpen: (isOpen: boolean) => void;
```

**Add helper (non-state, reads current state):**

```typescript
// In component, use useExplorerStore.getState() to capture:
// { cameraPosition, cameraTarget, selectedPlanet/Star/Constellation, dayOffset (from sim store), scale }
```

Note: `dayOffset` lives in `simulation-store.ts`. Bookmark capture reads from both stores.

### C2. Modify `src/components/cosmic-explorer/Camera.tsx`

**Current:** holds `cameraRef` locally, reads `cameraTarget`, lerps. No store write.

**Change:** In `useFrame`, every 10 frames, write camera position to store:

```typescript
if (frameCount % 10 === 0) {
  setCameraPosition(camera.position.clone());
}
```

Throttle to avoid re-renders every frame.

### C3. Modify `src/hooks/useKeyboardShortcuts.ts`

**Add:** `Ctrl+B` → `toggleBookmarkModal()`.

```typescript
if ((e.metaKey || e.ctrlKey) && e.key === "b") {
  e.preventDefault();
  useExplorerStore.getState().toggleBookmarkModal();
}
```

### C4. Modify `src/components/ui/HUD.tsx`

**Current:** renders HeaderBar, BackButton, SimulationControls, ScaleIndicator, InfoPanel, StellarInfoPanel, SearchModal.

**Change:**

1. Wrap entire return with `<ToastProvider>`.
2. Add `<AchievementTracker />` (invisible, from A3).
3. Add `<BookmarkSaveModal />` (from B2).

```tsx
return (
  <ToastProvider>
    <div className="pointer-events-none fixed inset-0 z-10">
      <HeaderBar />
      <BackButton />
      <SimulationControls />
      <ScaleIndicator />
      <InfoPanel />
      <StellarInfoPanel />
      <SearchModal />
      <AchievementTracker />
      <BookmarkSaveModal />
    </div>
  </ToastProvider>
);
```

### C5. Modify `src/components/ui/HeaderBar.tsx`

**Add to right section (before LanguageToggle):**

1. **Bookmark button:**

```tsx
<button onClick={toggleBookmarkModal} ...>
  <Bookmark className="h-3.5 w-3.5" />
  <kbd>⌘B</kbd>
</button>
```

2. **XP badge + level:**

```tsx
const { totalXp, achievements } = useAchievements();
const level = Math.floor(totalXp / 100);
// Render: Level badge (Lv. {level}) + XP progress bar ({totalXp % 100}/100 XP)
```

Note: `useAchievements` is auth-gated. If not authenticated, hide XP badge.

---

## Group D: Event Bus Emit Integration (paralel, 5 subagents)

### D1. `src/components/ui/InfoPanel.tsx`

**Emit on panel open** (when `selectedPlanet` becomes set):

```typescript
useEffect(() => {
  if (!selectedPlanet) return;
  const panelType = isDwarfPlanet ? "dwarf" : "planet";
  cosmicEventBus.emit({
    type: "panel_opened",
    payload: { id: selectedPlanet, panelType },
  });
  cosmicEventBus.emit({
    type: "planet_visited",
    payload: { id: selectedPlanet },
  });
}, [selectedPlanet, isDwarfPlanet]);
```

Note: `CosmicEvent` type currently has `panelType: "planet" | "star" | "dwarf"`. Verify dwarf is included.

### D2. `src/components/ui/StellarInfoPanel.tsx`

**Emit on star/constellation selected:**

```typescript
useEffect(() => {
  if (!selectedStar) return;
  cosmicEventBus.emit({ type: "star_visited", payload: { id: selectedStar } });
  cosmicEventBus.emit({
    type: "panel_opened",
    payload: { id: selectedStar, panelType: "star" },
  });
}, [selectedStar]);

useEffect(() => {
  if (!selectedConstellation) return;
  cosmicEventBus.emit({
    type: "constellation_visited",
    payload: { id: selectedConstellation },
  });
  cosmicEventBus.emit({
    type: "panel_opened",
    payload: { id: selectedConstellation, panelType: "star" },
  });
}, [selectedConstellation]);
```

### D3. `src/components/ui/SearchModal.tsx`

**Emit on search submit** (inside `handleSelect` or on Enter):

```typescript
cosmicEventBus.emit({ type: "search_used", payload: { query } });
```

Place at start of `handleSelect` (L102) or in `handleKeyDown` Enter branch (L156).

### D4. `src/components/cosmic-explorer/ScaleManager.tsx` + `src/components/ui/ScaleIndicator.tsx`

**Emit on scale change:**

```typescript
// ScaleManager.tsx — in useFrame when setScale called:
cosmicEventBus.emit({ type: "scale_reached", payload: { scale: newScale } });

// ScaleIndicator.tsx — on manual click:
cosmicEventBus.emit({ type: "scale_reached", payload: { scale } });
```

Throttle in ScaleManager (only emit when scale actually changes, which is already gated by `if (newScale !== scale)`).

### D5. `src/lib/store/simulation-store.ts`

**Emit on dayOffset threshold cross:**

Add thresholds: day_100, day_365. Track last-emitted threshold.

```typescript
// In advanceDayOffset or setDayOffset:
const thresholds = [100, 365];
const newThresholds = thresholds.filter((t) => newDayOffset >= t);
const prevThresholds = thresholds.filter((t) => prevDayOffset >= t);
const crossed = newThresholds.filter((t) => !prevThresholds.includes(t));
crossed.forEach((t) => {
  cosmicEventBus.emit({ type: "time_traveled", payload: { dayOffset: t } });
});
```

Or simpler: emit in `SimulationClock.tsx` after `advanceDayOffset`, check if crossed 365.

Note: `CosmicEvent` payload is `{ dayOffset: number }`. Achievement rule uses `targetId: "day_365"`. AchievementTracker maps: if `dayOffset >= 365` → track `time_traveled` with targetId `day_365`.

---

## Group E: i18n + Validators + Profile Page (paralel, 3 subagents)

### E1. `src/messages/en/common.json` + `src/messages/id/common.json`

**Add keys:**

```json
{
  "profile": {
    "title": "My Profile",
    "tabs": {
      "profile": "Profile",
      "progress": "Progress",
      "achievements": "Achievements",
      "bookmarks": "Bookmarks"
    }
  },
  "progress": {
    "stats": {
      "planetsVisited": "Planets Visited",
      "starsVisited": "Stars Visited",
      "constellationsVisited": "Constellations Visited",
      "searchesUsed": "Searches Used",
      "bookmarksSaved": "Bookmarks Saved",
      "panelsOpened": "Panels Opened"
    },
    "recentActivity": "Recent Activity",
    "empty": "No activity yet. Start exploring!"
  },
  "achievements": {
    "title": "Achievements",
    "level": "Level",
    "totalXp": "Total XP",
    "unlocked": "Unlocked",
    "locked": "Locked",
    "hidden": "Hidden Achievement",
    "xp": "XP"
  },
  "bookmarks": {
    "title": "Bookmarks",
    "save": "Save Bookmark",
    "namePlaceholder": "Bookmark name",
    "saveSuccess": "Bookmark saved",
    "restore": "Restore",
    "delete": "Delete",
    "confirmDelete": "Delete this bookmark?",
    "empty": "No bookmarks yet. Press Ctrl+B to save your current view.",
    "scale": "Scale"
  },
  "toast": {
    "achievementUnlocked": "Achievement Unlocked!",
    "levelUp": "Level Up!",
    "bookmarkSaved": "Bookmark Saved",
    "reachedLevel": "Reached Level {level}"
  },
  "header": {
    "bookmark": "Bookmark",
    "level": "Level",
    "xp": "XP"
  }
}
```

**ID version:** translate values, keep keys identical.

### E2. `src/lib/utils/validators.ts`

**Add:**

```typescript
export function validateBookmarkName(name: string): string | undefined {
  const trimmed = name.trim();
  if (trimmed.length === 0) return "Bookmark name is required";
  if (trimmed.length > 50) return "Bookmark name must be 50 characters or less";
  return undefined;
}
```

### E3. `src/app/[locale]/profile/page.tsx`

**Change:**

```tsx
// Before: <ProfileForm />
// After:
import { ProfileTabs } from "@/components/profile/ProfileTabs";
// ... <ProfileTabs />
```

Full-page layout (remove max-w-lg constraint, use max-w-4xl).

---

## Group F: Verification (sequential, last)

- [ ] **F1. Type-check:** `npx tsc --noEmit` — zero errors
- [ ] **F2. Lint:** `npm run lint` — zero errors
- [ ] **F3. Test:** `npm run test` — all existing + ruleEvaluator pass
- [ ] **F4. Build:** `npm run build` — production build succeeds
- [ ] **F5. Smoke test:** login → explore planet (emit planet_visited) → achievement toast appears → Ctrl+B save bookmark → profile page tabs show data → restore bookmark works

---

## Execution Mode: Subagent-Driven

**Round 1 (paralel, 10 subagents):** Groups A (3) + B (6) + E (3)

- A1, A2, A3, B1-B6, E1, E2, E3 dispatched concurrently.
- B1 depends on A2 (useToast) types only — but types are defined in plan, so can proceed in parallel.

**Round 2 (sequential, 5 tasks):** Group C

- C1 (store) → C2 (Camera) → C3 (keyboard) → C4 (HUD) → C5 (HeaderBar).
- Each reviewed before next.

**Round 3 (paralel, 5 subagents):** Group D

- D1, D2, D3, D4, D5 concurrent. Depend on C1 (store) done.

**Round 4 (sequential):** Group F verification.

---

## Self-Review Checklist

1. **Spec coverage:** All foundation gaps addressed ✓
2. **No placeholder scan:** No TBD/TODO/later patterns ✓
3. **Type consistency:** `CosmicEvent` panelType includes `"dwarf"` — verify event-bus.ts:9 ✓
4. **i18n parity:** en + id identical key structure ✓
5. **Auth-gating:** All data hooks auth-gated (useBookmarks follows useProgress pattern) ✓
6. **Cleanup:** AchievementTracker unsubscribes on unmount ✓
7. **Throttle:** Camera position write throttled (every 10 frames) ✓
8. **Bundle:** framer-motion adds ~50KB — acceptable for toast animation ✓
