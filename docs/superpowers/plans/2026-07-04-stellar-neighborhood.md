# Stellar Neighborhood Complete - Implementation Plan

> **Untuk agentic workers:** REQUIRED SUB-SKILL: Gunakan superpowers:subagent-driven-development atau superpowers:executing-plans untuk implementasi plan ini task-by-task. Steps menggunakan checkbox (`- [ ]`) syntax untuk tracking.

**Goal:** Menyelesaikan fitur Stellar Neighborhood hingga production-ready — fix critical bugs (memory leak, interaction), polish UX, dan lengkapi test coverage.

**Context:** MVP stellar sudah ada (61 bintang, 19 konstelasi, info panel, search stars), tapi analisis mendalam mengungkap 7 gap kritis yang harus diperbaiki sebelum fitur ini dianggap complete.

**Architecture:** Reuse pattern `CelestialBase` dari solar system, tapi perlu refactor `useSelection` hook agar generic untuk support stars/constellations, bukan hardcoded ke planets.

**Tech Stack:** React Three Fiber, Three.js, Zustand, GLSL shaders (reuse dari solar system), React Testing Library + Jest

**Branch:** `feature/stellar-neighborhood-complete` (dari `develop`)

---

## Temuan Analisis Mendalam

### 🔴 Critical Issues (P0)

1. **Memory leak** — 45 geometry objects dibuat ulang setiap frame di ConstellationLines
2. **useSelection hook hardcoded** — Hanya support planets, stars tidak dapat hover effect
3. **Constellations tidak clickable** — Tidak ada interaction handler atau integration ke search
4. **Store state incomplete** — Tidak ada `hoveredStar`/`hoveredConstellation`

### ⚠️ Important Issues (P1)

5. **StarGlow tidak responsive** — Scale hardcoded 2.5 untuk semua magnitude
6. **Zero component tests** — Hanya 26 test untuk utils, tidak ada test React components
7. **Constellation visual feedback kurang** — Color/opacity tidak berubah saat hover/select

### ✅ Already OK

- Search sudah support stars dengan camera fly-to ✓
- I18n lengkap (EN/ID) ✓
- Data astronomis solid (61 stars, 19 constellations) ✓
- Shader infrastructure ready untuk reuse ✓

---

## File Structure

### New Files (12)

```
src/hooks/useStarSelection.ts                     — Star-specific selection hook
src/hooks/useConstellationSelection.ts            — Constellation selection hook
src/components/stellar/constellations/ConstellationLabel.tsx  — 3D floating label
src/shaders/star/glow.vert.glsl                   — Star glow vertex shader (optional)
src/shaders/star/glow.frag.glsl                   — Star glow fragment shader (optional)
src/components/stellar/stars/__tests__/Star.test.tsx          — Star component test
src/components/stellar/stars/__tests__/StarGlow.test.tsx      — StarGlow test
src/components/stellar/constellations/__tests__/Constellation.test.tsx  — Constellation test
src/components/ui/__tests__/StellarInfoPanel.test.tsx         — Info panel test
src/hooks/data/__tests__/useStarData.test.tsx     — Hook test
src/hooks/data/__tests__/useConstellationData.test.tsx  — Hook test
src/lib/store/__tests__/explorer-store.test.tsx   — Store test
```

### Modified Files (9)

```
src/lib/store/explorer-store.ts                   — Add hoveredStar, hoveredConstellation
src/hooks/useSelection.ts                         — Refactor jadi generic atau deprecate
src/components/stellar/stars/Star.tsx             — Gunakan useStarSelection
src/components/stellar/stars/StarGlow.tsx         — Magnitude-responsive scaling
src/components/stellar/constellations/Constellation.tsx  — Add onClick handler
src/components/stellar/constellations/ConstellationLines.tsx  — Memoize + dispose
src/components/stellar/StellarScene.tsx           — Add cleanup useEffect
src/components/ui/SearchModal.tsx                 — Add constellations ke search results
package.json                                       — Add @testing-library/react, jsdom
jest.config.js                                     — Configure jsdom environment
```

---

## PHASE 1: Critical Fixes (P0 - Must Have)

### Task 1: Fix ConstellationLines Memory Leak

**Priority:** 🔴 P0 Critical

**Problem:** 45 `CatmullRomCurve3` + `TubeGeometry` dibuat ulang setiap render, menyebabkan memory leak massive dan FPS drop.

**Files:**

- Modify: `src/components/stellar/constellations/ConstellationLines.tsx`

**Steps:**

- [ ] **Step 1.1: Memoize geometry creation**

Wrap `CatmullRomCurve3` dan geometry creation dengan `useMemo`:

```tsx
const geometries = useMemo(() => {
  return lines
    .map((line) => {
      const starA = starPositions.get(line.from);
      const starB = starPositions.get(line.to);
      if (!starA || !starB) return null;

      const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(starA.x, starA.y, starA.z),
        new THREE.Vector3(starB.x, starB.y, starB.z),
      ]);
      const geometry = new THREE.TubeGeometry(path, 8, 0.15, 8, false);
      return { geometry, line };
    })
    .filter(Boolean);
}, [lines, starPositions]);
```

- [ ] **Step 1.2: Add cleanup on unmount**

```tsx
useEffect(() => {
  return () => {
    geometries.forEach((item) => item?.geometry.dispose());
  };
}, [geometries]);
```

- [ ] **Step 1.3: Update render to use memoized geometries**

```tsx
return (
  <group>
    {geometries.map((item, i) => (
      <mesh
        key={`${item.line.from}-${item.line.to}-${i}`}
        geometry={item.geometry}
      >
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    ))}
  </group>
);
```

**Verification:**

```bash
npm run dev
# Open browser devtools -> Performance tab -> Record
# Switch scale solar -> stellar -> solar
# Check memory tidak naik terus (seharusnya flat/turun saat keluar stellar)
```

---

### Task 2: Add Store State untuk Stars & Constellations

**Priority:** 🔴 P0 Critical

**Problem:** Store hanya punya `hoveredPlanet`, tidak ada `hoveredStar`/`hoveredConstellation`, menyebabkan hover state tidak bisa ditrack.

**Files:**

- Modify: `src/lib/store/explorer-store.ts`

**Steps:**

- [ ] **Step 2.1: Add state untuk hoveredStar dan hoveredConstellation**

Di interface `ExplorerState`:

```ts
// Hovered object (stars)
hoveredStar: string | null;
hoverStar: (star: string | null) => void;

// Hovered object (constellations)
hoveredConstellation: string | null;
hoverConstellation: (constellation: string | null) => void;
```

- [ ] **Step 2.2: Add implementation di create()**

```ts
// Hovered object (stars)
hoveredStar: null,
hoverStar: (star) => set({ hoveredStar: star }),

// Hovered object (constellations)
hoveredConstellation: null,
hoverConstellation: (constellation) => set({ hoveredConstellation: constellation }),
```

**Verification:**

```bash
npx tsc --noEmit
# Should compile without errors
```

---

### Task 3: Refactor useSelection untuk Support Stars

**Priority:** 🔴 P0 Critical

**Problem:** `useSelection` hook hardcoded ke `selectedPlanet`/`hoveredPlanet`, stars pakai `CelestialBase` tapi tidak dapat hover effect.

**Strategy:** Buat hook baru `useStarSelection` yang mirip pattern tapi pakai `selectedStar`/`hoveredStar`.

**Files:**

- Create: `src/hooks/useStarSelection.ts`
- Modify: `src/components/stellar/stars/Star.tsx`

**Steps:**

- [ ] **Step 3.1: Buat useStarSelection hook**

```ts
import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useStarSelection(id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedStar = useExplorerStore((s) => s.selectedStar);
  const isSelected = selectedStar === id;

  const selectStar = useExplorerStore((s) => s.selectStar);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  const handleClick = useCallback(
    (
      e: { stopPropagation: () => void },
      groupRef: React.RefObject<THREE.Group | null>,
    ) => {
      e.stopPropagation();
      if (isSelected) {
        selectStar(null);
        setCameraTarget(null);
      } else {
        selectStar(id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
          setIsTransitioning(true);
        }
      }
    },
    [id, isSelected, selectStar, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    useExplorerStore.getState().hoverStar(id);
  }, [id]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    useExplorerStore.getState().hoverStar(null);
  }, []);

  return {
    isSelected,
    isHovered: hovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  };
}
```

- [ ] **Step 3.2: Update Star.tsx untuk pakai useStarSelection**

Ganti import `useSelection` dengan `useStarSelection`, update `CelestialBase` props untuk pass handlers dari hook ini.

**Verification:**

```bash
npm run dev
# Hover over stars -> should see scale change
# Click star -> should see selection ring + info panel
```

---

### Task 4: Make Constellations Clickable

**Priority:** 🔴 P0 Critical

**Problem:** Constellations tidak punya interaction handler, user tidak bisa click untuk explore.

**Files:**

- Create: `src/hooks/useConstellationSelection.ts`
- Modify: `src/components/stellar/constellations/Constellation.tsx`
- Modify: `src/components/stellar/constellations/ConstellationLines.tsx`

**Steps:**

- [ ] **Step 4.1: Buat useConstellationSelection hook**

Mirip pattern `useStarSelection`, tapi pakai `selectedConstellation`/`hoveredConstellation`.

- [ ] **Step 4.2: Add onClick handler ke ConstellationLines**

Tambahkan invisible clickable mesh yang cover area konstelasi (bounding box dari semua stars di constellation):

```tsx
export function Constellation({ data, starPositions }: ConstellationProps) {
  const {
    isSelected,
    isHovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  } = useConstellationSelection(data.id);

  // Calculate bounding sphere untuk clickable area
  const boundingSphere = useMemo(() => {
    const positions = data.stars
      .map((id) => starPositions.get(id))
      .filter(Boolean);

    if (positions.length === 0) return null;

    const center = new THREE.Vector3();
    positions.forEach((p) => center.add(new THREE.Vector3(p.x, p.y, p.z)));
    center.divideScalar(positions.length);

    let radius = 0;
    positions.forEach((p) => {
      const dist = center.distanceTo(new THREE.Vector3(p.x, p.y, p.z));
      if (dist > radius) radius = dist;
    });

    return { center, radius: radius + 20 }; // +20 padding
  }, [data.stars, starPositions]);

  if (!boundingSphere) return null;

  return (
    <group>
      {/* Invisible clickable sphere */}
      <mesh
        position={[
          boundingSphere.center.x,
          boundingSphere.center.y,
          boundingSphere.center.z,
        ]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[boundingSphere.radius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <ConstellationLines
        lines={data.lines}
        starPositions={starPositions}
        isHovered={isHovered}
        isSelected={isSelected}
      />
    </group>
  );
}
```

- [ ] **Step 4.3: Update ConstellationLines untuk visual feedback**

Tambah props `isHovered` dan `isSelected`, adjust color/opacity:

```tsx
const color = isSelected ? "#00ffff" : isHovered ? "#6ab4ff" : "#4a9eff";
const opacity = isSelected ? 0.8 : isHovered ? 0.6 : 0.4;
```

**Verification:**

```bash
npm run dev
# Hover constellation -> lines brighten
# Click constellation -> StellarInfoPanel shows constellation info
```

---

### Task 5: Add Constellations ke Search Modal

**Priority:** 🔴 P0 Critical

**Problem:** Search modal hanya punya planets dan stars, constellations tidak bisa dicari.

**Files:**

- Modify: `src/components/ui/SearchModal.tsx`

**Steps:**

- [ ] **Step 5.1: Import useConstellationData**

```tsx
import { useConstellationData } from "@/hooks/data/useConstellationData";
```

- [ ] **Step 5.2: Add constellations ke allObjects**

```tsx
const { constellations } = useConstellationData();

const allObjects = [
  // ... existing objects
  ...constellations.map((c) => ({
    id: c.id,
    name: locale === "id" ? c.indonesianName : c.name,
    color: "#4a9eff",
    type: "constellation" as const,
    stars: c.stars,
    distanceScaled: undefined as number | undefined,
  })),
];
```

- [ ] **Step 5.3: Update getTypeLabel**

```tsx
const getTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    // ... existing
    constellation: tStellar("types.constellation"),
  };
  return typeMap[type] ?? type;
};
```

- [ ] **Step 5.4: Update handleSelect untuk constellations**

```tsx
} else if (obj.type === "constellation") {
  selectPlanet(null);
  selectStar(null);
  selectConstellation(obj.id);
  // Calculate centroid dari member stars untuk camera target
  const memberStars = stars.filter(s => obj.stars.includes(s.id));
  if (memberStars.length > 0) {
    const centroid = new THREE.Vector3();
    memberStars.forEach(s => centroid.add(new THREE.Vector3(s.x, s.y, s.z)));
    centroid.divideScalar(memberStars.length);
    setCameraTarget(centroid);
  }
  setSearchOpen(false);
}
```

- [ ] **Step 5.5: Add translation key**

Di `src/messages/en/stellar.json` dan `id/stellar.json`:

```json
"types": {
  "star": "star",
  "constellation": "constellation"
}
```

**Verification:**

```bash
npm run dev
# Cmd+K -> type "orion" -> should see constellation result
# Click result -> camera fly to Orion + show info panel
```

---

### Task 6: Add Cleanup on Scale Transition

**Priority:** 🔴 P0 Critical

**Problem:** Tidak ada disposal geometry saat keluar dari stellar scale, menyebabkan potential memory leak.

**Files:**

- Modify: `src/components/stellar/StellarScene.tsx`

**Steps:**

- [ ] **Step 6.1: Add useEffect cleanup**

```tsx
import { useEffect } from "react";

export function StellarScene() {
  const { stars } = useStarData();
  const { constellations } = useConstellationData();

  useEffect(() => {
    return () => {
      // Cleanup akan dipanggil saat component unmount (scale !== "stellar")
      // ConstellationLines sudah handle disposal sendiri via Task 1
      console.log("Stellar scene cleanup - disposing resources");
    };
  }, []);

  // ... rest of component
}
```

Note: Karena ConstellationLines sudah dispose geometries sendiri (Task 1), dan Stars pakai basic geometry yang di-manage React Three Fiber, cleanup ini lebih sebagai safety net dan logging.

**Verification:**

```bash
npm run dev
# Open console
# Switch solar -> stellar -> solar
# Should see "Stellar scene cleanup" log saat keluar dari stellar
```

---

## PHASE 2: Polish & Tests (P1 - Should Have)

### Task 7: Magnitude-Responsive StarGlow

**Priority:** ⚠️ P1 Important

**Problem:** StarGlow pakai `scale={2.5}` hardcoded untuk semua bintang, tidak astronomis accurate.

**Files:**

- Modify: `src/components/stellar/stars/StarGlow.tsx`
- Modify: `src/components/stellar/stars/Star.tsx`

**Steps:**

- [ ] **Step 7.1: Calculate glow scale dari magnitude**

Di `Star.tsx`:

```tsx
const glowScale = magnitudeToGlowScale(star.magnitude);

function magnitudeToGlowScale(magnitude: number): number {
  // Magnitude range: -1.5 (brightest) to 6.0 (dimmest visible)
  // Glow scale: 4.0 (bright) to 1.5 (dim)
  const minMag = -1.5;
  const maxMag = 6.0;
  const maxGlow = 4.0;
  const minGlow = 1.5;

  const normalized = Math.max(
    0,
    Math.min(1, (maxMag - magnitude) / (maxMag - minMag)),
  );
  return minGlow + normalized * (maxGlow - minGlow);
}
```

- [ ] **Step 7.2: Pass glowScale ke StarGlow**

```tsx
<StarGlow
  color={star.color}
  size={starSize}
  intensity={0.6}
  scale={glowScale}
/>
```

- [ ] **Step 7.3: Update StarGlow untuk accept scale prop**

```tsx
interface StarGlowProps {
  color: string;
  size: number;
  intensity?: number;
  scale?: number; // NEW
}

export function StarGlow({
  color,
  size,
  intensity = 0.6,
  scale = 2.5,
}: StarGlowProps) {
  return (
    <mesh scale={scale}>
      {" "}
      {/* Use prop instead of hardcoded 2.5 */}
      {/* ... rest unchanged */}
    </mesh>
  );
}
```

**Verification:**

```bash
npm run dev
# Sirius (magnitude -1.46) should have large bright glow
# Dimmer stars (magnitude 4+) should have smaller subtle glow
```

---

### Task 8: Setup Testing Library + jsdom

**Priority:** ⚠️ P1 Important

**Problem:** Tidak ada `@testing-library/react` atau `jsdom`, tidak bisa test React components.

**Files:**

- Modify: `package.json`
- Modify: `jest.config.js`

**Steps:**

- [ ] **Step 8.1: Install dependencies**

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

- [ ] **Step 8.2: Update jest.config.js**

```js
module.exports = {
  testEnvironment: "jsdom", // Change from "node"
  transform: {
    ...tsJestTransformCfg,
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(@react-three|three)/)"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // NEW
};
```

- [ ] **Step 8.3: Create jest.setup.js**

```js
import "@testing-library/jest-dom";
```

**Verification:**

```bash
npm run test
# Existing 26 tests should still pass
```

---

### Task 9: Write Component Tests

**Priority:** ⚠️ P1 Important

**Files:**

- Create: `src/components/stellar/stars/__tests__/Star.test.tsx`
- Create: `src/components/ui/__tests__/StellarInfoPanel.test.tsx`
- Create: `src/components/stellar/constellations/__tests__/Constellation.test.tsx`

**Steps:**

- [ ] **Step 9.1: Test Star component**

Mock Three.js, test rendering dan interaction:

```tsx
import { render } from "@testing-library/react";
import { Star } from "../Star";

jest.mock("@react-three/fiber", () => ({
  useFrame: jest.fn(),
}));

describe("Star", () => {
  it("renders without crashing", () => {
    const mockStar = {
      id: "sirius",
      name: "Sirius",
      x: 0,
      y: 0,
      z: 100,
      magnitude: -1.46,
      color: "#9db4ff",
      // ... other required fields
    };

    render(<Star star={mockStar} />);
    // Basic smoke test - jika render tanpa error, pass
  });
});
```

- [ ] **Step 9.2: Test StellarInfoPanel**

Test open/close, star vs constellation display:

```tsx
import { render, screen } from "@testing-library/react";
import { StellarInfoPanel } from "../StellarInfoPanel";

// Mock store
jest.mock("@/lib/store/explorer-store", () => ({
  useExplorerStore: () => ({
    selectedStar: "sirius",
    selectedConstellation: null,
    // ... mocks
  }),
}));

describe("StellarInfoPanel", () => {
  it("displays star info when star selected", () => {
    render(<StellarInfoPanel />);
    expect(screen.getByText("Sirius")).toBeInTheDocument();
  });
});
```

**Verification:**

```bash
npm run test
# Should see 26 + new component tests passing
```

---

### Task 10: Write Hook Tests

**Priority:** ⚠️ P1 Important

**Files:**

- Create: `src/hooks/data/__tests__/useStarData.test.tsx`
- Create: `src/hooks/data/__tests__/useConstellationData.test.tsx`

**Steps:**

- [ ] **Step 10.1: Test useStarData**

```tsx
import { renderHook } from "@testing-library/react";
import { useStarData } from "../useStarData";

describe("useStarData", () => {
  it("returns positioned stars", () => {
    const { result } = renderHook(() => useStarData());
    expect(result.current.stars.length).toBeGreaterThan(0);
    expect(result.current.stars[0]).toHaveProperty("x");
    expect(result.current.stars[0]).toHaveProperty("y");
    expect(result.current.stars[0]).toHaveProperty("z");
  });

  it("getStarById returns correct star", () => {
    const { result } = renderHook(() => useStarData());
    const sirius = result.current.getStarById("sirius");
    expect(sirius?.name).toBe("Sirius");
  });
});
```

**Verification:**

```bash
npm run test
```

---

## PHASE 3: Nice-to-Have (P2 - Optional)

### Task 11: Constellation 3D Labels (Optional)

**Priority:** 🟢 P2 Optional

**Files:**

- Create: `src/components/stellar/constellations/ConstellationLabel.tsx`
- Modify: `src/components/stellar/constellations/Constellation.tsx`

**Steps:**

- [ ] **Step 11.1: Create ConstellationLabel component**

```tsx
import { Html } from "@react-three/drei";
import { useLocale } from "next-intl";

export function ConstellationLabel({
  data,
  centroid,
}: {
  data: ConstellationData;
  centroid: THREE.Vector3;
}) {
  const locale = useLocale();
  const name = locale === "id" ? data.indonesianName : data.name;

  return (
    <Html
      position={[centroid.x, centroid.y + 15, centroid.z]}
      center
      distanceFactor={100}
      occlude={false}
      style={{ pointerEvents: "none" }}
    >
      <div className="select-none text-center whitespace-nowrap">
        <div className="text-xs font-semibold tracking-wider drop-shadow-lg text-cosmic-accent">
          {name}
        </div>
      </div>
    </Html>
  );
}
```

- [ ] **Step 11.2: Add ke Constellation.tsx**

Render label hanya saat `isHovered` atau `isSelected`.

**Verification:**

```bash
npm run dev
# Hover constellation -> label muncul
```

---

### Task 12: Star Glow Shader Upgrade (Optional)

**Priority:** 🟢 P2 Optional

**Files:**

- Create: `src/shaders/star/glow.vert.glsl`
- Create: `src/shaders/star/glow.frag.glsl`
- Modify: `src/components/stellar/stars/StarGlow.tsx`

**Approach:** Reuse `atmosphere.frag.glsl` pattern (fresnel glow), adapt untuk star dengan radial falloff.

---

### Task 13: Store Action Tests (Optional)

**Priority:** 🟢 P2 Optional

**Files:**

- Create: `src/lib/store/__tests__/explorer-store.test.tsx`

**Approach:** Test `selectStar`, `hoverStar`, `selectConstellation`, `hoverConstellation` actions.

---

## Verification Final

- [ ] **All tests pass**

```bash
npm run test
# Should see 26 existing + ~10-15 new tests passing
```

- [ ] **TypeScript compiles clean**

```bash
npx tsc --noEmit
```

- [ ] **Manual smoke test**

```bash
npm run dev
# 1. Switch solar -> stellar -> hover stars (should glow) -> click (info panel)
# 2. Hover constellations (lines brighten) -> click (info panel)
# 3. Cmd+K search "sirius" and "orion" -> both findable
# 4. Switch stellar -> solar -> check memory devtools (no leak)
```

- [ ] **Commit**

```bash
git add .
git commit -m "feat(stellar): complete stellar neighborhood with critical fixes and tests

- Fix ConstellationLines memory leak (45 geometries per frame)
- Add hover/selection for stars and constellations
- Make constellations clickable and searchable
- Add magnitude-responsive star glow
- Setup testing-library + write component/hook tests
- Add cleanup on scale transition

BREAKING: useSelection now deprecated, use useStarSelection/useConstellationSelection
"
```

---

## Success Criteria

✅ **Critical (P0) - All Must Pass:**

1. No memory leak saat switch scale (verified via Chrome DevTools)
2. Stars hover responsive (scale change visible)
3. Constellations clickable (info panel shows)
4. Search finds stars AND constellations
5. TypeScript compiles without errors

✅ **Important (P1) - Should Pass:** 6. Bright stars (Sirius) have larger glow than dim stars 7. At least 10 new component/hook tests written and passing 8. All 36+ tests pass (26 existing + new)

✅ **Optional (P2) - Nice to Have:** 9. Constellation labels muncul saat hover 10. Star glow pakai custom GLSL shader 11. Store actions fully tested
