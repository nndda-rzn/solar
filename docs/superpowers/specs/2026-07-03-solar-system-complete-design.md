# Solar System Complete — Design Specification

**Date:** 2026-07-03  
**Phase:** 1-2 (v0.1.0-alpha)  
**Approach:** Composition-based Modular System (Approach C)  
**Estimated Duration:** 7-8 days

---

## Overview

Complete the Solar System scale by adding: Earth's Moon, 5 Dwarf Planets (Pluto, Ceres, Eris, Haumea, Makemake), Asteroid Belt (~2000 InstancedMesh), Kuiper Belt (~1000 InstancedMesh), Sun Corona GLSL shader (3D noise + raymarching), Earth Day/Night shader, Procedural Surface shader (for dwarf planets), Atmosphere shader (improved), Post-processing Bloom effect.

This spec also establishes the **modular celestial architecture** that will be reused in Stellar/Galactic/Cosmic scales. A `CelestialBase` wrapper + composition pattern replaces the monolithic `Planet.tsx`, enabling future `Star`, `Galaxy`, `BlackHole` components to share selection, orbit, and label logic without code duplication.

---

## Decisions

| Decision              | Choice                                           | Rationale                                                    |
| --------------------- | ------------------------------------------------ | ------------------------------------------------------------ |
| Scope                 | Lengkap (Full)                                   | User preference; validates architecture before stellar phase |
| Dwarf planet textures | Procedural (GPU noise)                           | No texture files needed; ShaderMaterial with noise functions |
| Sun corona            | Advanced GLSL (raymarching + 3D noise + fresnel) | User preference; highest visual quality                      |
| Architecture          | Composition-based modular                        | Scalable to stellar/galactic; React-idiomatic                |

---

## Section 1: Architecture — Composition-based Modular

### Core Principle

Each celestial body = `CelestialBase` wrapper + specialized children (composition, not inheritance).

```tsx
<CelestialBase
  id="earth"
  name="Earth"
  position={pos}
  radius={5}
  onClick={handleClick}
  onHover={handleHover}
  selectionRing
  label="EARTH"
>
  <PlanetSurface
    textures={textures}
    radius={5}
    rotationSpeed={0.005}
    tilt={23.44}
  />
  <PlanetAtmosphere radius={5} color="#4A9EFF" />
  <PlanetClouds texture={cloudsTexture} radius={5} rotationSpeed={0.005} />
  <PlanetRing texture={ringTexture} radius={6.5} />
  <PlanetMoon orbitRadius={8} texture={moonTexture} />
</CelestialBase>
```

### Layer Structure

```
Layer 1: Hooks (pure logic, reusable)
  useOrbitAnimation(position, period, speed)
  useSelection(id, onClick, onHover)
  useProceduralTexture(params)
  useCelestialLabel(name, color)

Layer 2: CelestialBase (orchestrator)
  Position management (orbit or static)
  Click/hover/selection handling
  Scale animation on hover/select
  HTML label rendering
  Selection ring
  Children composition slot

Layer 3: Specialized Components (visual features)
  PlanetSurface, PlanetAtmosphere, PlanetClouds, PlanetRing, PlanetMoon
  ProceduralSurface, SunCorona, SunPointLight
  AsteroidBelt, KuiperBelt (InstancedMesh)
```

### Data-driven Architecture

Data files drive rendering decisions. Each celestial object is a JSON entry with visual config (textures or procedural parameters). Components read data via hooks and render appropriate layers.

### Key Design Decisions

1. `CelestialBase` = orchestrator, not visual component. Handles position, selection, label. Children handle visual features.
2. Hooks = pure logic, usable by Star/Galaxy components without `CelestialBase`.
3. `ProceduralSurface` = custom `ShaderMaterial` generating noise-based texture on GPU, no image files needed.
4. `Sun` does NOT use `CelestialBase` (different behavior — no orbit, different label style, always at origin).

---

## Section 2: Components

### New File Structure

```
src/components/cosmic-explorer/
  CelestialBase.tsx          (NEW) Base wrapper for all celestial objects

src/components/solar-system/
  sun/
    Sun.tsx                  (REFACTOR) Replace glow layers with corona shader
    SunCoronaShader.tsx      (NEW) GLSL coronal plasma with raymarching
    SunPointLight.tsx        (NEW) Extract point light config
  planets/
    Planet.tsx               (REFACTORED) ~60 lines using CelestialBase + composition
    PlanetSurface.tsx        (NEW) Texture mapping, material, rotation, tilt
    PlanetAtmosphere.tsx     (NEW) Backside glow mesh
    PlanetClouds.tsx         (NEW) Extracted from Planet.tsx CloudLayer
    PlanetRing.tsx           (NEW) Extracted from Planet.tsx RingLayer
    PlanetMoon.tsx           (NEW) Moon orbit around parent planet
  dwarf-planets/
    DwarfPlanetConfig.tsx    (NEW) Renders 5 dwarf planets from JSON
    ProceduralSurface.tsx     (NEW) Noise-based GPU texture material
  small-bodies/
    AsteroidBelt.tsx         (NEW) InstancedMesh ~2000 asteroids in torus ring
    KuiperBelt.tsx           (NEW) InstancedMesh ~1000 objects
```

### Component Interfaces

#### CelestialBase

```ts
interface CelestialBaseProps {
  id: string;
  name: string;
  position?: [number, number, number];
  orbitConfig?: OrbitConfig;
  radius: number;
  color?: string;
  onClick?: (id: string) => void;
  onHover?: (id: string | null) => void;
  selectionRing?: boolean;
  label?: string;
  children?: React.ReactNode;
}
```

#### PlanetSurface

```ts
interface PlanetSurfaceProps {
  textures: PlanetTextures;
  radius: number;
  rotationSpeed: number;
  tilt: number;
  color?: string;
}
```

#### PlanetAtmosphere

```ts
interface PlanetAtmosphereProps {
  radius: number;
  color: string;
  opacity?: number;
}
```

#### PlanetClouds

```ts
interface PlanetCloudsProps {
  texturePath: string;
  radius: number;
  rotationSpeed: number;
  opacity?: number;
}
```

#### PlanetRing

```ts
interface PlanetRingProps {
  texturePath: string;
  radius: number;
  innerMultiplier?: number;
  outerMultiplier?: number;
}
```

#### PlanetMoon

```ts
interface PlanetMoonProps {
  moonData: MoonData;
  parentPosition: THREE.Vector3;
  isPlaying: boolean;
  speed: number;
}
```

#### ProceduralSurface

```ts
interface ProceduralSurfaceProps {
  radius: number;
  baseColor: string;
  noiseScale: number;
  noiseType: "simplex" | "fbm" | "ridged";
  detailLevel: number;
  rotationSpeed: number;
  tilt: number;
}
```

### Refactored Planet.tsx

```tsx
export function Planet({ planet }: PlanetProps) {
  return (
    <CelestialBase
      id={planet.id}
      name={planet.name}
      orbitConfig={{
        distance: planet.distanceScaled * 10,
        period: planet.orbitalPeriod,
      }}
      radius={planet.radius * 2}
      color={planet.color}
      selectionRing
      label={planet.name.toUpperCase()}
    >
      <PlanetSurface
        textures={planet.textures}
        radius={planet.radius * 2}
        rotationSpeed={planet.rotationSpeed}
        tilt={planet.tilt}
        color={planet.color}
      />
      {planet.hasAtmosphere && (
        <PlanetAtmosphere
          radius={planet.radius * 2}
          color={planet.atmosphereColor}
        />
      )}
      {planet.textures.clouds && (
        <PlanetClouds
          texturePath={planet.textures.clouds}
          radius={planet.radius * 2}
          rotationSpeed={planet.rotationSpeed}
        />
      )}
      {planet.textures.ring && (
        <PlanetRing
          texturePath={planet.textures.ring}
          radius={planet.radius * 2}
        />
      )}
      {planet.moons?.map((moon) => (
        <PlanetMoon key={moon.id} moonData={moon} />
      ))}
    </CelestialBase>
  );
}
```

---

## Section 3: Data Flow

### Hook Contracts

#### useOrbitAnimation.ts

```ts
function useOrbitAnimation(
  config: OrbitConfig | null,
  isPlaying: boolean,
  speed: number,
  dayOffset: number,
): THREE.Vector3;
```

Reads `simulation-store` (isPlaying, speed, dayOffset). Uses `calculateOrbitalPosition()` from `astronomy.ts`. Returns Vector3 updated per frame. Returns `(0,0,0)` when `config` is null (static).

#### useSelection.ts

```ts
function useSelection(id: string): {
  isSelected: boolean;
  isHovered: boolean;
  handleClick: (e: ThreeEvent, groupRef: Ref) => void;
  handlePointerOver: () => void;
  handlePointerOut: () => void;
};
```

Reads/writes `explorer-store` (selectedPlanet, hoveredPlanet). Click sets `cameraTarget` from group world position. Triggers `setIsTransitioning(true)` on select.

#### useProceduralTexture.ts

```ts
function useProceduralTexture(config: ProceduralTextureConfig): ShaderMaterial;
```

Creates `THREE.ShaderMaterial` with noise shaders. Passes config as uniforms. Returns material ready to attach to mesh.

### Selection → Camera Flow

User clicks Planet → `CelestialBase.onClick` → `useSelection.handleClick` → reads `groupRef.getWorldPosition()` → `explorer-store.setCameraTarget(worldPos)` → `Camera.tsx` lerps to `worldPos + offset(10, 15, 20)` → `Camera.lookAt(worldPos)` → `InfoPanel` reads `selectedPlanet` → shows planet info.

### Moon Orbit Flow

Moon is rendered as child of `CelestialBase` group. Inherits parent position via Three.js scene graph. Moon's own `useOrbitAnimation` adds relative offset relative to parent. No need to manually track parent world position for basic orbit (children inherit transforms). Moon orbit uses local coordinates within parent group.

### Asteroid Belt Generation

On mount: generate 2000 random positions in torus ring (innerRadius → outerRadius, random angle, random height within thickness). Create InstancedMesh with dummy Object3D. Set matrix for each instance (position, rotation, scale). On frame: slowly rotate entire belt group around Y axis.

### Earth Day/Night Data

`PlanetSurface` detects `planet.id === "earth"` and applies day/night shader instead of standard material. Passes `u_sunPosition` (always 0,0,0 — sun at origin) and world position from CelestialBase group. Fragment shader computes `dot(normal, sunDir)` and blends between day texture and night emissive texture at the terminator.

### Resource Cleanup

On scale transition (solar → stellar): `useEffect` cleanup in `SolarSystemScene` disposes asteroid/kuiper belt geometries, procedural shader materials, and loaded textures. Prevents GPU memory leaks.

---

## Section 4: Shader System

### Directory

```
src/shaders/
  common/noise.glsl      — Simplex 3D, FBM, Ridged noise functions
  common/utils.glsl      — Math helpers, color conversion
  sun/corona.vert.glsl   — Vertex: pass position, normal, uv, worldPosition
  sun/corona.frag.glsl   — Volumetric raymarching corona with 3D FBM noise
  earth/daynight.vert.glsl — Standard pass through
  earth/daynight.frag.glsl — Day texture ↔ night texture blend at terminator
  procedural/procedural.vert.glsl — Standard pass through
  procedural/procedural.frag.glsl — FBM/Simplex/Ridged noise texture generation
  atmosphere/atmosphere.vert.glsl — Pass worldNormal, viewDirection
  atmosphere/atmosphere.frag.glsl — Fresnel-based atmospheric glow
```

### Shader 1: Sun Corona (Advanced GLSL)

- **Vertex:** Passes position, normal, uv, worldPosition. Slight vertex displacement from noise for organic shape.
- **Fragment:** Volumetric raymarching with:
  - 3D simplex noise for plasma turbulence
  - Density falloff by distance from sun center
  - Fresnel edge glow
  - 32 raymarch steps, early exit at opacity > 0.99
  - Uniforms: `u_time`, `u_sunRadius`, `u_coronaIntensity`, `u_color1`, `u_color2`
- **Render:** Sphere (radius 25), `BackSide`, `AdditiveBlending`, `depthWrite: false`, `transparent: true`
- **Performance:** LOD disable below distance 50 in scene units

### Shader 2: Earth Day/Night

- **Fragment:** Calculates `dot(worldNormal, sunDirection)`. Smoothstep transition at terminator. Mixes day texture and night emissive texture. Adds specular on ocean (day side).
- **Uniforms:** `u_dayTexture`, `u_nightTexture`, `u_sunPosition`, `u_ambientIntensity`

### Shader 3: Procedural Texture (Dwarf Planets)

- **Fragment:** GPU noise texture generation. Three modes: Simplex (smooth gradient), FBM (multi-octave fractal), Ridged (abs noise, ridge patterns). Maps noise [-1,1] to [0,1] and interpolates colors.
- **Uniforms:** `u_baseColor`, `u_secondaryColor`, `u_noiseScale`, `u_noiseType`, `u_detailLevel`, `u_roughness`, `u_sunPosition`

### Shader 4: Atmosphere

- **Fragment:** `1.0 - dot(viewDirection, worldNormal)` → fresnel. `pow(fresnel, u_falloff) * u_intensity` → glow output.
- **Render:** BackSide sphere (slightly larger than planet), `AdditiveBlending`, `depthWrite: false`

### Shader Loading

Add webpack rule in `next.config.mjs`:

```js
config.module.rules.push({ test: /\.glsl$/, type: "asset/source" });
```

Then import directly: `import coronaVert from '@/shaders/sun/corona.vert.glsl'`

### Performance Budgets

| Shader          | Max Instructions | Target FPS | LOD                      |
| --------------- | ---------------- | ---------- | ------------------------ |
| Sun Corona      | ~500             | 60fps      | Disable below scale 50   |
| Earth Day/Night | ~100             | 60fps      | Always on                |
| Procedural      | ~200             | 60fps      | Detail level by distance |
| Atmosphere      | ~50              | 60fps      | Disable when zoomed out  |

---

## Section 5: Testing, Error Handling & Post-Processing

### Testing

| Hook                   | Test File                      | Coverage                           |
| ---------------------- | ------------------------------ | ---------------------------------- |
| `useOrbitAnimation`    | `useOrbitAnimation.test.ts`    | Position at t=0, t=90, t=period    |
| `useSelection`         | `useSelection.test.ts`         | Click → store, hover, deselect     |
| `useProceduralTexture` | `useProceduralTexture.test.ts` | Material creation, uniform mapping |

### Error Handling

| Failure                         | Fallback                                            |
| ------------------------------- | --------------------------------------------------- |
| Planet texture load fails       | Solid color mesh (`planet.color`), log warning      |
| Sun corona shader compile error | Existing layered glow spheres (non-shader fallback) |
| GPU lacks GLSL features         | Procedural → solid color + normal map fallback      |
| FPS < 30 for > 2s               | Reduce asteroid belt 2000 → 500                     |
| FPS < 20                        | Disable sun corona shader → glow spheres            |
| FPS < 15                        | Disable atmosphere shaders                          |
| Recovery                        | Re-enable when FPS > 50 for 3 seconds               |

### Post-Processing: Bloom

Use `@react-three/postprocessing` (already installed). Add to `Scene.tsx`:

- `Bloom` (intensity 1.5, luminanceThreshold 0.6, luminanceSmoothing 0.9, mipmapBlur)
- `ToneMapping` (ACES_FILMIC)
- Disable Bloom on mobile (`window.innerWidth < 768`)
- Cost: ~2ms per frame

### Performance Benchmarks

| Metric               | Target                            |
| -------------------- | --------------------------------- |
| Initial load         | < 3s FCP                          |
| Frame rate           | 60 FPS idle & all planets visible |
| Asteroid belt render | < 1ms                             |
| Sun corona shader    | < 2ms                             |
| GPU memory           | < 512 MB                          |
| Bundle size          | < 500 kB gzip                     |

---

## File Manifest

### New Files (28)

| File                                                              | Description                            |
| ----------------------------------------------------------------- | -------------------------------------- |
| `src/components/cosmic-explorer/CelestialBase.tsx`                | Base wrapper for all celestial objects |
| `src/components/solar-system/sun/SunCoronaShader.tsx`             | GLSL corona with raymarching           |
| `src/components/solar-system/sun/SunPointLight.tsx`               | Extracted point light                  |
| `src/components/solar-system/planets/PlanetSurface.tsx`           | Texture + material + rotation          |
| `src/components/solar-system/planets/PlanetAtmosphere.tsx`        | Backside glow mesh                     |
| `src/components/solar-system/planets/PlanetClouds.tsx`            | Cloud layer component                  |
| `src/components/solar-system/planets/PlanetRing.tsx`              | Ring geometry component                |
| `src/components/solar-system/planets/PlanetMoon.tsx`              | Moon orbit rendering                   |
| `src/components/solar-system/dwarf-planets/DwarfPlanetConfig.tsx` | Renders 5 dwarf planets                |
| `src/components/solar-system/dwarf-planets/ProceduralSurface.tsx` | Noise-based GPU texture                |
| `src/components/solar-system/small-bodies/AsteroidBelt.tsx`       | InstancedMesh ~2000                    |
| `src/components/solar-system/small-bodies/KuiperBelt.tsx`         | InstancedMesh ~1000                    |
| `src/hooks/useOrbitAnimation.ts`                                  | Orbit position calculation hook        |
| `src/hooks/useSelection.ts`                                       | Click/hover/select logic hook          |
| `src/hooks/useProceduralTexture.ts`                               | GPU noise texture hook                 |
| `src/hooks/useCelestialLabel.ts`                                  | HTML label logic hook                  |
| `src/hooks/data/useDwarfPlanetData.ts`                            | Load dwarf-planets.json                |
| `src/data/solar-system/dwarf-planets.json`                        | 5 dwarf planets data                   |
| `src/data/solar-system/asteroid-belt.json`                        | Belt config                            |
| `src/data/solar-system/kuiper-belt.json`                          | Belt config                            |
| `src/shaders/common/noise.glsl`                                   | Simplex, FBM, Ridged noise             |
| `src/shaders/common/utils.glsl`                                   | Math helpers                           |
| `src/shaders/sun/corona.vert.glsl`                                | Sun corona vertex                      |
| `src/shaders/sun/corona.frag.glsl`                                | Sun corona fragment                    |
| `src/shaders/earth/daynight.vert.glsl`                            | Earth day/night vertex                 |
| `src/shaders/earth/daynight.frag.glsl`                            | Earth day/night fragment               |
| `src/shaders/procedural/procedural.vert.glsl`                     | Procedural vertex                      |
| `src/shaders/procedural/procedural.frag.glsl`                     | Procedural fragment                    |

### Modified Files (6)

| File                                               | Changes                                       |
| -------------------------------------------------- | --------------------------------------------- |
| `src/components/solar-system/SolarSystemScene.tsx` | Add belts, dwarf planets, barrel exports      |
| `src/components/solar-system/sun/Sun.tsx`          | Replace glow layers with `SunCoronaShader`    |
| `src/components/solar-system/planets/Planet.tsx`   | Refactor to use `CelestialBase` + composition |
| `src/components/cosmic-explorer/Scene.tsx`         | Add EffectComposer + Bloom                    |
| `src/data/solar-system/planets.json`               | Add `moons` array per planet                  |
| `next.config.mjs`                                  | Add `.glsl` webpack asset rule                |
