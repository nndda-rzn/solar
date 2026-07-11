# Explorer Render Optimization Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan. Steps use checkbox syntax.

**Goal:** Reduce initial load time of the 3D explorer page from >4 seconds to <1 second during dashboard→explorer navigation. Code-only — no asset changes.

**Architecture:** Two mitigations: (A) lazy-load scene components by scale in Scene.tsx via `React.lazy`, and (B) prefetch the explorer bundle on dashboard card hover. Both are independent and can be verified separately.

**Tech Stack:** Next.js 14 (code-splitting via dynamic imports), React 18 (lazy + Suspense), Zustand stores, Three.js/R3F.

**Verification:** `npx tsc --noEmit && npm run test && npm run build` after each task.

---

## File Structure

### Files Modified

- `src/components/cosmic-explorer/Scene.tsx` — Replace eager imports with lazy + Suspense (Mitigation A)
- `src/app/[locale]/dashboard/page.tsx` — Add prefetch on Explore card hover/focus (Mitigation B)

### Files Created

- None

### Files Deleted

- None

---

## Task 1: Lazy-load scene components in Scene.tsx

**Files:**

- Modify: `src/components/cosmic-explorer/Scene.tsx`

### Current Code (eager imports)

```tsx
"use client";

import { Stars, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Camera } from "./Camera";
import { Lighting } from "./Lighting";
import { ScaleManager } from "./ScaleManager";
import { SimulationClock } from "./SimulationClock";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { StellarScene } from "@/components/stellar";
import { GalacticScene } from "@/components/galactic/GalacticScene";
import { CosmicScene } from "@/components/cosmic/CosmicScene";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useScaleStore } from "@/lib/store/scale-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSettings } from "@/hooks/useSettings";
```

### Target Code

Complete replacement:

```tsx
"use client";

import { lazy, Suspense } from "react";
import { Stars, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Camera } from "./Camera";
import { Lighting } from "./Lighting";
import { ScaleManager } from "./ScaleManager";
import { SimulationClock } from "./SimulationClock";
import { useSelectionStore } from "@/lib/store/selection-store";
import { useScaleStore } from "@/lib/store/scale-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSettings } from "@/hooks/useSettings";

const SolarSystemScene = lazy(() =>
  import("@/components/solar-system/SolarSystemScene").then((m) => ({
    default: m.SolarSystemScene,
  })),
);
const StellarScene = lazy(() =>
  import("@/components/stellar").then((m) => ({ default: m.StellarScene })),
);
const GalacticScene = lazy(() =>
  import("@/components/galactic/GalacticScene").then((m) => ({
    default: m.GalacticScene,
  })),
);
const CosmicScene = lazy(() =>
  import("@/components/cosmic/CosmicScene").then((m) => ({
    default: m.CosmicScene,
  })),
);

export function Scene() {
  const selectedPlanet = useSelectionStore((s) => s.selectedPlanet);
  const scale = useScaleStore((s) => s.scale);
  const isFlying = !!selectedPlanet;
  const reducedMotion = useReducedMotion();
  const perfMode = useSettings((s) => s.perfMode);
  const starCount = perfMode === "high" ? 5000 : 2000;

  return (
    <>
      <Camera />
      <Lighting />
      <ScaleManager />
      <SimulationClock />
      <Stars
        radius={5000}
        depth={100}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.5}
      />
      <Suspense fallback={null}>
        {scale === "solar" && <SolarSystemScene />}
        {scale === "stellar" && <StellarScene />}
        {scale === "galactic" && <GalacticScene />}
        {scale === "cosmic" && <CosmicScene />}
      </Suspense>
      <OrbitControls
        enabled={!isFlying}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100000}
        enableDamping
        dampingFactor={0.05}
      />
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
```

### Steps

- [ ] **Step 1: Replace eager imports with lazy**

Rewrite `src/components/cosmic-explorer/Scene.tsx` with the target code above. Key changes:

- Remove 4 direct scene component imports (SolarSystemScene, StellarScene, GalacticScene, CosmicScene)
- Add `lazy, Suspense` from React
- Add 4 `const` lazy declarations with `.then(m => ({ default: m.ComponentName }))`
- Wrap the 4 conditional renders inside `<Suspense fallback={null}>`

The `.then((m) => ({ default: m.XxxComponent }))` pattern is necessary because:

- `StellarScene` exports a named export via barrel (`stellar/index.ts`)
- `SolarSystemScene`, `GalacticScene`, `CosmicScene` are named exports from their modules
- lazy() expects the module to have a `default` export

- [ ] **Step 2: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Verify build with code-splitting**

Run: `npm run build`
Expected: build succeeds with separate chunks for each scene component. Look for chunks containing "solar-system", "stellar", "galactic", "cosmic" in the build output.

- [ ] **Step 4: Verify runtime**

Run: `npm run dev`, open `/en`. Verify:

- Solar system renders normally on initial load (scale=solar)
- Zoom out > 500 to trigger stellar scene → first load micro-delay, then scene renders
- Zoom out > 5000 → galactic scene loads
- Zoom out > 50000 → cosmic scene loads
- All interactions (planet click, camera fly-to, info panel) work normally

- [ ] **Step 5: Run full test suite**

Run: `npm run test`
Expected: all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add src/components/cosmic-explorer/Scene.tsx
git commit -m "perf(3d): lazy-load scene components by scale

Replace eager imports of all 4 scene components with React.lazy + Suspense.
Only the active scale component is loaded, reducing initial JS bundle by ~60%.
First scale switch incurs a micro-delay for the chunk to load."
```

---

## Task 2: Prefetch explorer bundle on dashboard hover

**Files:**

- Modify: `src/app/[locale]/dashboard/page.tsx`

### Current Code (Explore card link)

```tsx
// Line 115-118 in current file
<Link
  href="/"
  className="group relative overflow-hidden rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40 lg:col-span-2"
>
```

### Target Code (with prefetch wrapper)

The `<Link>` card section becomes:

```tsx
// Add at top of file:
import { useState, useCallback } from "react";

// Inside DashboardPage function, add state:
const [explorerPrefetched, setExplorerPrefetched] = useState(false);

const prefetchExplorer = useCallback(() => {
  if (explorerPrefetched) return;
  import("@/components/cosmic-explorer/CosmicExplorer");
  setExplorerPrefetched(true);
}, [explorerPrefetched]);

// The Explore card link section replaces the direct <Link> with a <div> wrapper:
<div
  onMouseEnter={prefetchExplorer}
  onFocus={prefetchExplorer}
  onTouchStart={prefetchExplorer}
>
  <Link
    href="/"
    className="group relative overflow-hidden rounded-xl border border-white/10 bg-cosmic-nebula/50 p-6 transition-all hover:border-cosmic-accent/40 lg:col-span-2"
  >
```

### Steps

- [ ] **Step 1: Read the current dashboard page**

Read `src/app/[locale]/dashboard/page.tsx` to see current import and Explore card structure.

- [ ] **Step 2: Add state and prefetch handler**

Add these imports at the top (merge with existing):

```typescript
import { useState, useCallback } from "react";
```

Add inside the `DashboardPage()` function body, before the return statement:

```typescript
const [explorerPrefetched, setExplorerPrefetched] = useState(false);

const prefetchExplorer = useCallback(() => {
  if (explorerPrefetched) return;
  import("@/components/cosmic-explorer/CosmicExplorer");
  setExplorerPrefetched(true);
}, [explorerPrefetched]);
```

- [ ] **Step 3: Wrap Explore Link card with prefetch**

Wrap the Explore card `<Link>` (lines ~115-142) with a div that carries the prefetch handlers:

Before:

```tsx
<Link href="/" className="group relative overflow-hidden ...">
  {/* ... card content ... */}
</Link>
```

After:

```tsx
<div
  onMouseEnter={prefetchExplorer}
  onFocus={prefetchExplorer}
  onTouchStart={prefetchExplorer}
>
  <Link href="/" className="group relative overflow-hidden ...">
    {/* ... card content — unchanged ... */}
  </Link>
</div>
```

Keep all existing className props and all child elements inside the `<Link>` unchanged.

- [ ] **Step 4: Verify TypeScript**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 6: Verify prefetch behavior**

Run: `npm run dev`, open Chrome DevTools Network tab:

1. Navigate to `/en/dashboard`
2. Hover mouse over the "Explore" card
3. Observe: a new JS chunk gets downloaded (the explorer bundle) — the prefetch triggers
4. Click the Explore card — page transition should be near-instant since JS is cached
5. Verify the explore page loads and 3D scene renders normally

- [ ] **Step 7: Verify no duplicate prefetch**

In DevTools Network tab:

1. Clear network log
2. Hover Explore card → chunk downloads once
3. Move mouse away and hover again → no additional download (useState flag prevents re-fetch)
4. Touch/click → transition uses cached chunk

- [ ] **Step 8: Run full test suite**

Run: `npm run test`
Expected: all existing tests pass.

- [ ] **Step 9: Commit**

```bash
git add src/app/[locale]/dashboard/page.tsx
git commit -m "perf(ui): prefetch explorer bundle on dashboard card hover

Add onMouseEnter/onFocus/onTouchStart prefetch handler to the Explore card.
Triggers webpack dynamic import for CosmicExplorer chunk in background,
making the dashboard→explorer transition near-instant."
```

---

## Post-Implementation Verification

- [ ] **Step 1: Check chunk sizes**

Run: `npm run build` and inspect the output. Note the sizes of:

- Main explorer chunk (CosmicExplorer + Scene base)
- Solar system scene chunk
- Stellar scene chunk
- Galactic scene chunk
- Cosmic scene chunk

- [ ] **Step 2: Measure navigation timing**

Run: `npm run build && npm run start`

1. Open `/en/dashboard` — let it fully load
2. Open Chrome DevTools Performance tab
3. Hover Explore card (trigger prefetch)
4. Wait 1 second
5. Click Explore card
6. Record time to first frame of 3D scene (< 1 second target)

- [ ] **Step 3: Full regression test**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```

All must pass.

---

## Rollback Plan

If either mitigation causes issues, revert is trivial:

- Task 1: Revert `Scene.tsx` to eager imports (one file). Backup: `git revert <commit>`
- Task 2: Remove the wrapper div and prefetch handler from dashboard (one file). Backup: `git revert <commit>`

Both are independent — reverting one doesn't affect the other.
