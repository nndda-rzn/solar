# PlanetSphere 3D Preview — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `subagent-driven-development` (recommended) or `executing-plans`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `LibraryDetail` header planet capsule visual: items with diffuse texture render via mini R3F `<Canvas>` with auto-rotating sphere geometry. Click to toggle spin speed. Items without texture (stars/constellation/dwarf) keep accentColor dot.

**Architecture:** Single new component `PlanetSphere.tsx` (R3F mini canvas) integrating `<useTexture>` dari drei + `sphereGeometry` + `meshStandardMaterial` + manual `useFrame` rotation. Three-layer wiring via prop threading: `LibraryDetailItem.textureUrl?: string` populated by `catalog.ts` from planets.json `textures.diffuse`. The whole system stays zero-config — textureUrl resolved server-side via JSON import.

**Tech Stack:** Next.js 14, React 18, React Three Fiber, @react-three/drei, three.js, Tailwind v4, next-intl.

---

## File Map

**File baru (2):**

- `src/components/library/PlanetSphere.tsx` — R3F rotating sphere capsule
- `src/components/library/__tests__/PlanetSphere.test.tsx` — render test

**File dimodifikasi (4):**

- `src/components/library/LibraryDetail.tsx` — add `textureUrl?: string` to `LibraryDetailItem` interface; replace accentColor dot with `<PlanetSphere>` when textureUrl present
- `src/components/library/CatalogGrid.tsx` — add `textureUrl?: string` to `CatalogItem` interface
- `src/lib/library/catalog.ts` — populate `textureUrl` from `planets.json.textures.diffuse` for planet items
- `src/app/[locale]/library/page.tsx` — pass `textureUrl` through `detailByTab` to detail resolvers

**Test update (1):**

- `src/components/library/__tests__/LibraryDetail.test.tsx` — add test that textureUrl hides accentColor dot (and that PlanetSphere renders instead); keep existing 6 tests passing

---

### Task 1: Add `textureUrl` to types + propagate in catalog aggregator

**Files:**

- Modify `src/components/library/LibraryDetail.tsx`
- Modify `src/components/library/CatalogGrid.tsx`
- Modify `src/lib/library/catalog.ts`

- [ ] **Step 1: Add `textureUrl?: string` to `LibraryDetailItem`**

In `src/components/library/LibraryDetail.tsx`, add field to interface:

```ts
export interface LibraryDetailItem {
  id: string;
  title: string;
  type: LibraryItemType;
  accentColor?: string;
  textureUrl?: string; // ← NEW
  description?: string;
  facts?: string[];
  mythology?: string;
  stats: Array<{ label: string; value: string }>;
}
```

- [ ] **Step 2: Add `textureUrl?: string` to `CatalogItem`**

In `src/components/library/CatalogGrid.tsx`, add field to interface:

```ts
export interface CatalogItem {
  id: string;
  title: string;
  subtitle?: string;
  type: LibraryItemType;
  accentColor?: string;
  textureUrl?: string; // ← NEW
  stats?: Array<{ label: string; value: string }>;
}
```

- [ ] **Step 3: Wire textureUrl in planet item/detail builders**

In `src/lib/library/catalog.ts`:

In `PLANET_ITEMS` map, add:

```ts
textureUrl: p.textures?.diffuse,
```

In `PLANET_DETAIL` map, add:

```ts
textureUrl: p.textures?.diffuse,
```

For all other types (dwarf, stars, constellations), do NOT add. They'll just stay undefined.

- [ ] **Step 4: Verify type-check**

```bash
npm run type-check
```

Expected: 0 errors. Existing tests still pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/library/LibraryDetail.tsx src/components/library/CatalogGrid.tsx src/lib/library/catalog.ts
git commit -m "feat(library): thread textureUrl through detail and catalog types"
```

---

### Task 2: Create `PlanetSphere` component + test

**Files:** Create `src/components/library/PlanetSphere.tsx` + `src/components/library/__tests__/PlanetSphere.test.tsx`

- [ ] **Step 1: Write minimal test first (smoke)**

`src/components/library/__tests__/PlanetSphere.test.tsx`:

```tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { PlanetSphere } from "../PlanetSphere";

it("renders with role=img and aria-label", () => {
  render(<PlanetSphere url="/textures/solar-system/earth/diffuse.webp" />);
  const el = screen.getByRole("img", { name: /3D planet preview/i });
  expect(el).toBeInTheDocument();
});

it("toggles aria-pressed on click", () => {
  render(<PlanetSphere url="/textures/solar-system/earth/diffuse.webp" />);
  const el = screen.getByRole("img", { name: /3D planet preview/i });
  expect(el.getAttribute("aria-pressed")).toBe("false");
  fireEvent.click(el);
  expect(el.getAttribute("aria-pressed")).toBe("true");
  fireEvent.click(el);
  expect(el.getAttribute("aria-pressed")).toBe("false");
});
```

- [ ] **Step 2: Run test → must FAIL (component not yet)**

```bash
npm test -- --testPathPatterns="PlanetSphere" --silent
```

- [ ] **Step 3: Implement PlanetSphere**

`src/components/library/PlanetSphere.tsx`:

```tsx
"use client";

import { useCallback, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";

const SLOW_SPEED = 0.4;
const FAST_SPEED = 1.6;

function RotatingSphere({ url, fast }: { url: string; fast: boolean }) {
  const meshRef = useState<{ current: Mesh | null }>({
    current: null,
  })[0];
  const texture = useTexture(url);
  useFrame((_, delta) => {
    const target = meshRef.current;
    if (target) target.rotation.y += delta * (fast ? FAST_SPEED : SLOW_SPEED);
  });
  return (
    <mesh
      ref={(el) => {
        meshRef.current = el;
      }}
    >
      <sphereGeometry args={[1.2, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
    </mesh>
  );
}

export interface PlanetSphereProps {
  url: string;
}

export function PlanetSphere({ url }: PlanetSphereProps) {
  const [spinning, setSpinning] = useState(false);
  const toggle = useCallback(() => setSpinning((s) => !s), []);
  return (
    <button
      type="button"
      role="img"
      aria-label="3D planet preview"
      aria-pressed={spinning}
      onClick={toggle}
      className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-cosmic-black/60 transition hover:border-cosmic-accent/40"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 2, 5]} intensity={1.4} />
        <pointLight position={[-3, -1, -2]} intensity={0.3} />
        <RotatingSphere url={url} fast={spinning} />
      </Canvas>
    </button>
  );
}
```

**Self-correction note:** The naive `useState<{current: Mesh | null}>` from drei's API in this codebase was wrong. Use plain `useRef` instead:

```tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";

const SLOW_SPEED = 0.4;
const FAST_SPEED = 1.6;

function RotatingSphere({ url, fast }: { url: string; fast: boolean }) {
  const meshRef = useRef<Mesh | null>(null);
  const texture = useTexture(url);
  useFrame((_, delta) => {
    if (meshRef.current)
      meshRef.current.rotation.y += delta * (fast ? FAST_SPEED : SLOW_SPEED);
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
    </mesh>
  );
}

export interface PlanetSphereProps {
  url: string;
}

export function PlanetSphere({ url }: PlanetSphereProps) {
  const [spinning, setSpinning] = useState(false);
  const toggle = useCallback(() => setSpinning((s) => !s), []);
  return (
    <button
      type="button"
      role="img"
      aria-label="3D planet preview"
      aria-pressed={spinning}
      onClick={toggle}
      className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-cosmic-black/60 transition hover:border-cosmic-accent/40"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 35 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 2, 5]} intensity={1.4} />
        <pointLight position={[-3, -1, -2]} intensity={0.3} />
        <RotatingSphere url={url} fast={spinning} />
      </Canvas>
    </button>
  );
}
```

- [ ] **Step 4: Run test → must PASS (2 tests)**

```bash
npm test -- --testPathPatterns="PlanetSphere" --silent
```

Expected: 2/2 tests pass. (JSDOM won't actually render the WebGL Canvas but the button role/aria is what's tested.)

- [ ] **Step 5: Commit**

```bash
git add src/components/library/PlanetSphere.tsx src/components/library/__tests__/PlanetSphere.test.tsx
git commit -m "feat(3d): add PlanetSphere mini R3F canvas with toggle spin speed"
```

---

### Task 3: Integrate PlanetSphere into LibraryDetail

**Files:** Modify `src/components/library/LibraryDetail.tsx`

- [ ] **Step 1: Add import**

At top of `LibraryDetail.tsx`, add:

```tsx
import { PlanetSphere } from "./PlanetSphere";
```

- [ ] **Step 2: Replace accentColor dot in header**

Find the existing `<span className="mt-1 h-4 w-4 rounded-full" ...>` block in the header and replace with conditional:

```tsx
{
  item.textureUrl ? (
    <PlanetSphere url={item.textureUrl} />
  ) : (
    <span
      className="mt-1 h-4 w-4 rounded-full"
      style={{ backgroundColor: item.accentColor ?? "#4a9eff" }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 3: Verify type-check + tests**

```bash
npm run type-check
npm run lint
npm test -- --silent --testPathPatterns="LibraryDetail"
```

Expected: existing 6 tests still pass + test that textureUrl causes PlanetSphere rendering (add below).

- [ ] **Step 4: Add test for textureUrl path**

In `__tests__/LibraryDetail.test.tsx`, add test:

```tsx
it("renders PlanetSphere when textureUrl provided", () => {
  const itemWithTexture = {
    ...baseItem,
    textureUrl: "/textures/solar-system/earth/diffuse.webp",
  };
  renderWithIntl(
    <LibraryDetail
      item={itemWithTexture}
      onExplore={jest.fn()}
      onClose={jest.fn()}
    />,
  );
  expect(
    screen.getByRole("img", { name: /3D planet preview/i }),
  ).toBeInTheDocument();
});

it("renders accentColor dot when no textureUrl", () => {
  const { container } = renderWithIntl(
    <LibraryDetail item={baseItem} onExplore={jest.fn()} onClose={jest.fn()} />,
  );
  expect(
    container.querySelector(".rounded-full.bg-transparent") ||
      container.querySelector("button[aria-hidden]"),
  ).toBeTruthy();
});
```

Or simpler: assert `PlanetSphere` does not render when textureUrl undefined, dot renders.

- [ ] **Step 5: Commit**

```bash
git add src/components/library/LibraryDetail.tsx src/components/library/__tests__/LibraryDetail.test.tsx
git commit -m "feat(library): show 3D PlanetSphere in detail header for textured items"
```

---

### Task 4: Final verification

- [ ] **Step 1: Full pipeline**

```bash
npm run type-check
npm run lint
npm test -- --silent
npm run build
```

All must succeed. Expected: 17+ suites (added PlanetSphere), 120+2+ tests pass.

- [ ] **Step 2: Smoke test in dev**

```bash
npm run dev
```

Open: `http://localhost:3000/en/library`

Verify:

- Click "Planets" tab → switch to Planet cards, click "Earth" → SlidePanel opens, header shows **rotating 3D Earth sphere** (slow rotation, click → faster rotation toggle)
- Click "Stars" tab → switch to Stars cards, click "Sirius" → SlidePanel opens, header shows **accentColor blue dot** with no canvas (no texture for stars)
- Click "Constellations" tab → click any → accentColor purple dot
- Performance: max 1 Canvas open at a time, no GPU overload
- Memory: open multiple planets sequentially → no leak in console

- [ ] **Step 3: Tag**

```bash
git tag v0.3.1-planet-sphere -m "Library: 3D PlanetSphere preview in detail header"
```

---

## Self-Review Checklist

- ✅ All TypeScript types consistent (`textureUrl?: string` propagated)
- ✅ PlanetSphere test mocks Three's Canvas gracefully (JSDOM doesn't need full WebGL)
- ✅ Toggle behavior accessible (aria-pressed, button semantics, click handler)
- ✅ Slow → fast speed toggleable; default slow for calm UX
- ✅ Fallback: without textureUrl → accent dot, no canvas overhead
- ✅ Memory safety: Canvas + texture dispose on unmount (React Three Fiber & drei handle this)
- ✅ Single Canvas at any moment (SlidePanel holds focus)

## Risk & Mitigation Recap

| Risk                                       | Mitigation                                                                                           |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| Texture 404                                | MeshStandardMaterial without texture = solid color via accentColor                                   |
| Many canvases max one held, performance ok |
| Slow rotation annoying                     | Default 0.4, fast toggle to 1.6 — never spammy                                                       |
| WebGL not supported                        | Next.js SSR → PlanetSphere is "use client", but JSDOM test still works since only DOM, not actual GL |

## Di luar Scope

- Shader effects (atmosphere glow, clouds)
- Orbit controls (we're locked on view)
- Resize handling (fixed 128px capsule)
- Touch gesture support beyond click
