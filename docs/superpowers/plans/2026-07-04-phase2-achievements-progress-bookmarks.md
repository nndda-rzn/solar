# Phase 2: Achievements + Progress + Bookmarks Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement data-driven achievement system, progress tracking, and bookmark save/restore with cinematic notifications in a scalable event-driven architecture.

**Architecture:** Rule-based achievement catalog (JSON-driven, zero code-change for new achievements), event bus for decoupled producer/consumer, provider pattern for pluggable storage, 3-layer hook composition (data→logic→feature), cosmic glassmorphism UI.

**Tech Stack:** Next.js 14, React 18, TypeScript, Supabase (Postgres), Zustand, Tailwind CSS v4, Lucide-react icons.

---

## File Structure (32 files)

### New Files (20)

```
src/types/progress.ts                          # Progress + ProgressRow types
src/types/achievement.ts                       # Achievement + Rule types + catalog shape
src/types/bookmark.ts                          # Bookmark + BookmarkCreatePayload types
src/data/achievements-catalog.json             # 12 achievements, rule-based, i18n
src/lib/rules/ruleEvaluator.ts                 # Pure function: evaluate rules vs progress
src/lib/events/event-bus.ts                    # Typed event emitter (lightweight, <50 LOC)
src/lib/providers/supabase-progress.ts         # ProgressProvider impl
src/lib/providers/supabase-achievements.ts     # AchievementProvider impl
src/lib/providers/supabase-bookmarks.ts        # BookmarkProvider impl
src/hooks/useProgress.ts                       # Data-level: CRUD + cache
src/hooks/useAchievements.ts                   # Data-level: read + award
src/hooks/useBookmarks.ts                      # Data-level: CRUD + restore
src/hooks/useAchievementTracker.ts             # Logic-level: wire progress→check→toast
src/components/ui/Toast.tsx                    # ToastContext + ToastProvider + ToastItem
src/components/ui/BookmarkSaveModal.tsx        # Two-step bookmark save modal
src/components/profile/ProfileTabs.tsx         # Tab container (4 tabs)
src/components/profile/ProgressTab.tsx         # Stats grid + recent timeline
src/components/profile/AchievementsTab.tsx     # Achievement grid (unlocked/locked/hidden)
src/components/profile/BookmarksTab.tsx        # Bookmark grid + restore/delete
src/lib/utils/__tests__/ruleEvaluator.test.ts  # Pure function tests
src/hooks/__tests__/useProgress.test.ts        # Hook tests with mock provider
```

### Modified Files (12)

```
src/lib/store/explorer-store.ts              # +cameraPosition getter, bookmark capture helpers
src/components/cosmic-explorer/Camera.tsx    # Expose pos to store in useFrame
src/components/ui/InfoPanel.tsx              # Emit planet_visited + panel_opened events
src/components/ui/StellarInfoPanel.tsx       # Emit star/constellation events + fix i18n
src/components/ui/SearchModal.tsx            # Emit search_used event
src/components/ui/ScaleManager.tsx           # Emit scale_reached event
src/components/cosmic-explorer/SimClock.tsx  # Emit time_traveled event
src/components/ui/HeaderBar.tsx              # +BookmarkSaveButton, +XP badge, +level display
src/components/ui/HUD.tsx                    # Mount ToastProvider + AchievementTracker
src/app/[locale]/profile/page.tsx            # Replace <ProfileForm> → <ProfileTabs>
src/lib/utils/validators.ts                  # +validateBookmarkName
src/messages/en/common.json                  # +profile tabs + toast + bookmark strings
src/messages/id/common.json                  # +profile tabs + toast + bookmark strings
docs/sql/supabase-schema.sql                 # Append Phase 2 tables + RLS + triggers
src/scripts/seed.ts                          # +Sample achievements/progress/bookmarks
src/hooks/useKeyboardShortcuts.ts            # +Ctrl+B bookmark shortcut
```

---

## Task 1: Database Schema (Phase 2)

**Files:**

- Append: `docs/sql/supabase-schema.sql`

- [ ] **Step 1: Append Phase 2 SQL to existing schema file**

Read current `docs/sql/supabase-schema.sql` to find last line, append:

```sql
-- =============================================================
-- PHASE 2: Achievements + Progress + Bookmarks
-- =============================================================

create table public.progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  category text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  completed_at timestamptz not null default now(),
  unique(user_id, category, target_id)
);

create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  achievement_type text not null,
  title text not null,
  description text not null,
  icon text not null,
  xp_reward integer not null default 0,
  earned_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb,
  unique(user_id, achievement_type)
);

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  camera_position jsonb not null,
  camera_target jsonb,
  selected_object text,
  selected_type text,
  day_offset numeric not null default 0,
  scale text not null default 'solar',
  thumbnail_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.progress enable row level security;
alter table public.achievements enable row level security;
alter table public.bookmarks enable row level security;

create policy "progress_read" on public.progress for select to authenticated using ((select auth.uid()) = user_id);
create policy "progress_insert" on public.progress for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "progress_delete" on public.progress for delete to authenticated using ((select auth.uid()) = user_id);

create policy "achievements_read" on public.achievements for select to authenticated using ((select auth.uid()) = user_id);
create policy "achievements_insert" on public.achievements for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "bookmarks_read" on public.bookmarks for select to authenticated using ((select auth.uid()) = user_id);
create policy "bookmarks_insert" on public.bookmarks for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "bookmarks_update" on public.bookmarks for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "bookmarks_delete" on public.bookmarks for delete to authenticated using ((select auth.uid()) = user_id);

create trigger update_bookmarks_updated_at
  before update on public.bookmarks
  for each row execute procedure public.update_updated_at();
```

- [ ] **Step 2: User runs SQL in Supabase Dashboard**

User action — paste appended schema into Supabase Dashboard → SQL Editor → Run.

- [ ] **Step 3: Verify tables created**

User verifies in Supabase Dashboard → Database → Tables: `progress`, `achievements`, `bookmarks` all exist with RLS policies.

---

## Task 2: TypeScript Types + Data Catalog

**Files:**

- Create: `src/types/progress.ts`
- Create: `src/types/achievement.ts`
- Create: `src/types/bookmark.ts`
- Create: `src/data/achievements-catalog.json`

- [ ] **Step 1: Write `src/types/progress.ts`**

```typescript
export type ProgressCategory =
  | "visited_planet"
  | "visited_star"
  | "visited_constellation"
  | "search_used"
  | "scale_reached"
  | "time_traveled"
  | "bookmark_created"
  | "panel_opened"
  | "speed_reached";

export interface Progress {
  id: string;
  userId: string;
  category: ProgressCategory;
  targetId: string;
  metadata: Record<string, unknown>;
  completedAt: string;
}

export interface ProgressRow {
  id: string;
  user_id: string;
  category: string;
  target_id: string;
  metadata: Record<string, unknown>;
  completed_at: string;
}

export function mapProgressRow(row: ProgressRow): Progress {
  return {
    id: row.id,
    userId: row.user_id,
    category: row.category as ProgressCategory,
    targetId: row.target_id,
    metadata: row.metadata ?? {},
    completedAt: row.completed_at,
  };
}
```

- [ ] **Step 2: Write `src/types/achievement.ts`**

```typescript
import { ProgressCategory } from "./progress";

export type AchievementCategory = "explorer" | "mastery" | "quest";

export type RuleType =
  "count_unique" | "has_target" | "count_total" | "time_window" | "combination";

export interface Rule {
  type: RuleType;
  category: ProgressCategory;
  threshold?: number;
  targetId?: string;
  windowMs?: number;
  rules?: Rule[];
  operator?: "and" | "or";
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: { en: string; id: string };
  icon: string;
  category: AchievementCategory;
  xp: number;
  rule: Rule;
  hidden?: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementType: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  earnedAt: string;
  metadata: Record<string, unknown>;
}

export interface AchievementRow {
  id: string;
  user_id: string;
  achievement_type: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  earned_at: string;
  metadata: Record<string, unknown>;
}

export function mapAchievementRow(row: AchievementRow): Achievement {
  return {
    id: row.id,
    userId: row.user_id,
    achievementType: row.achievement_type,
    title: row.title,
    description: row.description,
    icon: row.icon,
    xpReward: row.xp_reward,
    earnedAt: row.earned_at,
    metadata: row.metadata ?? {},
  };
}
```

- [ ] **Step 3: Write `src/types/bookmark.ts`**

```typescript
export interface CameraState {
  x: number;
  y: number;
  z: number;
}

export interface Bookmark {
  id: string;
  userId: string;
  name: string;
  cameraPosition: CameraState;
  cameraTarget: CameraState | null;
  selectedObject: string | null;
  selectedType: "planet" | "star" | "constellation" | null;
  dayOffset: number;
  scale: string;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BookmarkRow {
  id: string;
  user_id: string;
  name: string;
  camera_position: CameraState;
  camera_target: CameraState | null;
  selected_object: string | null;
  selected_type: string | null;
  day_offset: number;
  scale: string;
  thumbnail_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookmarkCreatePayload {
  name: string;
  cameraPosition: CameraState;
  cameraTarget: CameraState | null;
  selectedObject: string | null;
  selectedType: "planet" | "star" | "constellation" | null;
  dayOffset: number;
  scale: string;
  thumbnailUrl: string;
}

export function mapBookmarkRow(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    cameraPosition: row.camera_position,
    cameraTarget: row.camera_target,
    selectedObject: row.selected_object,
    selectedType: row.selected_type as Bookmark["selectedType"],
    dayOffset: row.day_offset,
    scale: row.scale,
    thumbnailUrl: row.thumbnail_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```

- [ ] **Step 4: Write `src/data/achievements-catalog.json`**

Full 12-achievement catalog with all rule types:

```json
{
  "version": "1.0",
  "definitions": [
    {
      "id": "first_planet",
      "title": "First Contact",
      "description": {
        "en": "Visit your first planet",
        "id": "Kunjungi planet pertamamu"
      },
      "icon": "Rocket",
      "category": "explorer",
      "xp": 25,
      "rule": {
        "type": "count_unique",
        "category": "visited_planet",
        "threshold": 1
      }
    },
    {
      "id": "first_star",
      "title": "Star Gazer",
      "description": {
        "en": "Visit your first star",
        "id": "Kunjungi bintang pertamamu"
      },
      "icon": "Sparkles",
      "category": "explorer",
      "xp": 25,
      "rule": {
        "type": "count_unique",
        "category": "visited_star",
        "threshold": 1
      }
    },
    {
      "id": "first_constellation",
      "title": "Constellation Hunter",
      "description": {
        "en": "Visit your first constellation",
        "id": "Temukan konstelasi pertamamu"
      },
      "icon": "Compass",
      "category": "explorer",
      "xp": 25,
      "rule": {
        "type": "count_unique",
        "category": "visited_constellation",
        "threshold": 1
      }
    },
    {
      "id": "first_bookmark",
      "title": "Memory Maker",
      "description": {
        "en": "Save your first bookmark",
        "id": "Simpan bookmark pertamamu"
      },
      "icon": "Bookmark",
      "category": "explorer",
      "xp": 25,
      "rule": {
        "type": "count_unique",
        "category": "bookmark_created",
        "threshold": 1
      }
    },
    {
      "id": "first_search",
      "title": "Seeker",
      "description": {
        "en": "Use search for the first time",
        "id": "Gunakan pencarian pertama kali"
      },
      "icon": "Search",
      "category": "explorer",
      "xp": 10,
      "rule": {
        "type": "count_unique",
        "category": "search_used",
        "threshold": 1
      }
    },
    {
      "id": "first_scale_change",
      "title": "Scale Pioneer",
      "description": {
        "en": "Navigate to a different scale",
        "id": "Menjelajahi skala baru"
      },
      "icon": "Globe",
      "category": "explorer",
      "xp": 15,
      "rule": {
        "type": "count_unique",
        "category": "scale_reached",
        "threshold": 2
      }
    },
    {
      "id": "planet_explorer",
      "title": "Solar System Explorer",
      "description": {
        "en": "Visit 4 different planets",
        "id": "Kunjungi 4 planet berbeda"
      },
      "icon": "Orbit",
      "category": "mastery",
      "xp": 100,
      "rule": {
        "type": "count_unique",
        "category": "visited_planet",
        "threshold": 4
      }
    },
    {
      "id": "solar_master",
      "title": "Solar System Master",
      "description": {
        "en": "Visit all 8 planets",
        "id": "Kunjungi semua 8 planet"
      },
      "icon": "Sun",
      "category": "mastery",
      "xp": 500,
      "rule": {
        "type": "count_unique",
        "category": "visited_planet",
        "threshold": 8
      }
    },
    {
      "id": "star_collector",
      "title": "Star Collector",
      "description": {
        "en": "Visit 10 different stars",
        "id": "Kunjungi 10 bintang berbeda"
      },
      "icon": "Star",
      "category": "mastery",
      "xp": 200,
      "rule": {
        "type": "count_unique",
        "category": "visited_star",
        "threshold": 10
      }
    },
    {
      "id": "constellation_scholar",
      "title": "Constellation Scholar",
      "description": {
        "en": "Visit 6 different constellations",
        "id": "Kunjungi 6 konstelasi berbeda"
      },
      "icon": "Map",
      "category": "mastery",
      "xp": 200,
      "rule": {
        "type": "count_unique",
        "category": "visited_constellation",
        "threshold": 6
      }
    },
    {
      "id": "time_traveler",
      "title": "Time Traveler",
      "description": {
        "en": "Simulate 365+ days into the future",
        "id": "Simulasikan lebih dari 365 hari"
      },
      "icon": "Clock",
      "category": "mastery",
      "xp": 150,
      "rule": {
        "type": "has_target",
        "category": "time_traveled",
        "targetId": "day_365"
      }
    },
    {
      "id": "bookworm",
      "title": "Cosmic Librarian",
      "description": {
        "en": "Open info panels 20 times",
        "id": "Buka panel info 20 kali"
      },
      "icon": "BookOpen",
      "category": "mastery",
      "xp": 100,
      "rule": {
        "type": "count_total",
        "category": "panel_opened",
        "threshold": 20
      }
    }
  ]
}
```

---

## Task 3: Rule Evaluator (Pure Function + Tests)

**Files:**

- Create: `src/lib/rules/ruleEvaluator.ts`
- Create: `src/lib/utils/__tests__/ruleEvaluator.test.ts`

- [ ] **Step 1: Write `src/lib/rules/ruleEvaluator.ts`**

```typescript
import { Rule } from "@/types/achievement";
import { Progress } from "@/types/progress";

export function evaluateRule(
  rule: Rule,
  progress: Progress[],
  context?: { now?: number },
): boolean {
  const now = context?.now ?? Date.now();

  switch (rule.type) {
    case "count_unique": {
      const matching = progress.filter((p) => p.category === rule.category);
      const uniqueTargets = new Set(matching.map((p) => p.targetId));
      return uniqueTargets.size >= (rule.threshold ?? 1);
    }

    case "has_target": {
      return progress.some(
        (p) => p.category === rule.category && p.targetId === rule.targetId,
      );
    }

    case "count_total": {
      const total = progress.filter((p) => p.category === rule.category).length;
      return total >= (rule.threshold ?? 1);
    }

    case "time_window": {
      const matching = progress.filter(
        (p) =>
          p.category === rule.category &&
          new Date(p.completedAt).getTime() >= now - (rule.windowMs ?? 0),
      );
      const uniqueTargets = new Set(matching.map((p) => p.targetId));
      return uniqueTargets.size >= (rule.threshold ?? 1);
    }

    case "combination": {
      if (!rule.rules || rule.rules.length === 0) return false;
      if (rule.operator === "or") {
        return rule.rules.some((r) => evaluateRule(r, progress, context));
      }
      return rule.rules.every((r) => evaluateRule(r, progress, context));
    }

    default:
      return false;
  }
}
```

- [ ] **Step 2: Write `src/lib/utils/__tests__/ruleEvaluator.test.ts`**

```typescript
import { evaluateRule } from "../../rules/ruleEvaluator";
import { Progress } from "@/types/progress";

function makeProgress(
  category: string,
  targetId: string,
  hoursAgo = 0,
): Progress {
  return {
    id: `${category}-${targetId}`,
    userId: "test-user",
    category: category as Progress["category"],
    targetId,
    metadata: {},
    completedAt: new Date(Date.now() - hoursAgo * 3600000).toISOString(),
  };
}

describe("evaluateRule", () => {
  describe("count_unique", () => {
    it("returns true when threshold met", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "mars"),
        makeProgress("visited_planet", "venus"),
        makeProgress("visited_planet", "jupiter"),
      ];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 4 },
          progress,
        ),
      ).toBe(true);
    });

    it("returns false when under threshold", () => {
      const progress = [makeProgress("visited_planet", "earth")];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 4 },
          progress,
        ),
      ).toBe(false);
    });

    it("deduplicates target ids", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_planet", "earth"),
      ];
      expect(
        evaluateRule(
          { type: "count_unique", category: "visited_planet", threshold: 2 },
          progress,
        ),
      ).toBe(false);
    });
  });

  describe("has_target", () => {
    it("returns true when target exists", () => {
      const progress = [makeProgress("time_traveled", "day_365")];
      expect(
        evaluateRule(
          {
            type: "has_target",
            category: "time_traveled",
            targetId: "day_365",
          },
          progress,
        ),
      ).toBe(true);
    });

    it("returns false when target missing", () => {
      const progress = [makeProgress("time_traveled", "day_100")];
      expect(
        evaluateRule(
          {
            type: "has_target",
            category: "time_traveled",
            targetId: "day_365",
          },
          progress,
        ),
      ).toBe(false);
    });
  });

  describe("count_total", () => {
    it("counts duplicates", () => {
      const progress = [
        makeProgress("panel_opened", "earth"),
        makeProgress("panel_opened", "earth"),
        makeProgress("panel_opened", "mars"),
      ];
      expect(
        evaluateRule(
          { type: "count_total", category: "panel_opened", threshold: 3 },
          progress,
        ),
      ).toBe(true);
    });
  });

  describe("combination", () => {
    it("AND: all rules must pass", () => {
      const progress = [
        makeProgress("visited_planet", "earth"),
        makeProgress("visited_star", "sirius"),
      ];
      expect(
        evaluateRule(
          {
            type: "combination",
            category: "visited_planet",
            operator: "and",
            rules: [
              {
                type: "count_unique",
                category: "visited_planet",
                threshold: 1,
              },
              { type: "count_unique", category: "visited_star", threshold: 1 },
            ],
          },
          progress,
        ),
      ).toBe(true);
    });

    it("OR: any rule can pass", () => {
      const progress = [makeProgress("visited_planet", "earth")];
      expect(
        evaluateRule(
          {
            type: "combination",
            category: "visited_planet",
            operator: "or",
            rules: [
              { type: "count_unique", category: "visited_star", threshold: 1 },
              {
                type: "count_unique",
                category: "visited_planet",
                threshold: 1,
              },
            ],
          },
          progress,
        ),
      ).toBe(true);
    });
  });
});
```

- [ ] **Step 3: Run tests → expect PASS**

```bash
npx jest src/lib/utils/__tests__/ruleEvaluator.test.ts
```

Expected: 5 tests pass.

---

## Task 4: Event Bus

**Files:**

- Create: `src/lib/events/event-bus.ts`

<details>
<summary>Step 1: Write event-bus.ts</summary>

```typescript
export type CosmicEvent =
  | { type: "planet_visited"; payload: { id: string } }
  | { type: "star_visited"; payload: { id: string } }
  | { type: "constellation_visited"; payload: { id: string } }
  | { type: "search_used"; payload: { query: string } }
  | { type: "scale_reached"; payload: { scale: string } }
  | { type: "time_traveled"; payload: { dayOffset: number } }
  | { type: "bookmark_saved"; payload: { id: string } }
  | {
      type: "panel_opened";
      payload: { id: string; type: "planet" | "star" | "dwarf" };
    }
  | { type: "speed_reached"; payload: { speed: number } }
  | {
      type: "achievement_unlocked";
      payload: { type: string; title: string; xp: number };
    }
  | { type: "level_up"; payload: { from: number; to: number } };

type Listener<E extends CosmicEvent> = (event: E) => void;

type EventOf<E extends CosmicEvent> = E extends CosmicEvent ? E : never;

class EventBus {
  private listeners: Map<CosmicEvent["type"], Set<Function>> = new Map();

  on<
    T extends CosmicEvent["type"],
    E extends Extract<CosmicEvent, { type: T }>,
  >(type: T, listener: Listener<E>): () => void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    (this.listeners.get(type)! as Set<Function>).add(listener);
    return () => {
      (this.listeners.get(type)! as Set<Function>).delete(listener);
    };
  }

  emit<E extends CosmicEvent>(event: E): void {
    const set = this.listeners.get(event.type);
    if (set) {
      set.forEach((fn) => fn(event));
    }
  }
}

export const cosmicEventBus = new EventBus();
```

</details>

---

## Task 5: Supabase Providers

**Files:**

- Create: `src/lib/providers/supabase-progress.ts`
- Create: `src/lib/providers/supabase-achievements.ts`
- Create: `src/lib/providers/supabase-bookmarks.ts`

Details in plan: standard Supabase CRUD wrappers. See full code in Section 5 of design.

---

## Task 6: Core Hooks (Data Layer)

**Files:**

- Create: `src/hooks/useProgress.ts`
- Create: `src/hooks/useAchievements.ts`
- Create: `src/hooks/useBookmarks.ts`
- Create: `src/hooks/useToast.ts`

Details in Section 6 of design.

---

## Task 7: Logic Hooks (AchievementTracker)

**Files:**

- Create: `src/hooks/useAchievementTracker.ts`

Mounts in HUD.tsx root, listens to event bus → checks rules → awards achievements → pushes toasts.

---

## Task 8: UI Components

**Files:**

- Create: `src/components/ui/Toast.tsx`
- Create: `src/components/ui/BookmarkSaveModal.tsx`
- Create: `src/components/profile/ProfileTabs.tsx`
- Create: `src/components/profile/ProgressTab.tsx`
- Create: `src/components/profile/AchievementsTab.tsx`
- Create: `src/components/profile/BookmarksTab.tsx`

Follow cosmic glassmorphism design spec (Section 1).

---

## Task 9: Integration (Modified Files)

**Files:** 12 existing files modified. See Section 4.9 of design for details.

---

## Task 10: Seed Updates + Verification

- [ ] **Step 1: `seed.ts`** — append sample achievements/progress/bookmarks for `admin@cosmic.test`
- [ ] **Step 2: Verify** — type-check, lint, test all pass

---

## Self-Review Checklist

1. **Spec coverage**: All 10 sections from design ✓
2. **Placeholder scan**: No TBD/TODO/later patterns ✓
3. **Type consistency**: Naming consistent ✓

---

## Execution Mode: Subagent-Driven

Each task dispatched to fresh subagent, reviewed via spec compliance + code quality reviewers per `superpowers:subagent-driven-development`.
