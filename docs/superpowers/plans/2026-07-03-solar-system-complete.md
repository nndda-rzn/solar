# Solar System Complete Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the Solar System scale with modular architecture (CelestialBase pattern) that enables reuse for Stellar/Galactic/Cosmic scales.

**Architecture:** Composition-based modular — CelestialBase wrapper handles position, selection, label; specialized children (PlanetSurface, PlanetAtmosphere, etc.) handle visual features. 4 custom GLSL shaders. InstancedMesh for asteroid/kuiper belts.

**Tech Stack:** React Three Fiber, Three.js, Zustand, GLSL, @react-three/postprocessing

**Branch:** `feature/solar-system-complete` (from `develop`)

---

## File Structure

### New Files (28)

```
src/shaders/common/noise.glsl              — 3D simplex, FBM, ridged noise functions
src/shaders/common/utils.glsl              — Remap, hash21, rotation helpers
src/shaders/sun/corona.vert.glsl           — Sun corona vertex shader
src/shaders/sun/corona.frag.glsl           — Sun corona fragment shader (raymarching)
src/shaders/earth/daynight.vert.glsl       — Earth day/night vertex shader
src/shaders/earth/daynight.frag.glsl       — Earth day/night fragment shader
src/shaders/procedural/procedural.vert.glsl — Procedural texture vertex shader
src/shaders/procedural/procedural.frag.glsl — Procedural texture fragment shader
src/shaders/atmosphere/atmosphere.vert.glsl — Atmosphere vertex shader
src/shaders/atmosphere/atmosphere.frag.glsl — Atmosphere fragment shader
src/hooks/useOrbitAnimation.ts             — Orbit position calculation per frame
src/hooks/useSelection.ts                  — Click/hover/select → store actions
src/hooks/useProceduralTexture.ts          — Create ShaderMaterial with noise
src/hooks/useCelestialLabel.ts             — HTML label position calculation
src/hooks/data/useDwarfPlanetData.ts       — Load dwarf-planets.json
src/data/solar-system/dwarf-planets.json   — 5 dwarf planets + procedural params
src/data/solar-system/asteroid-belt.json   — Belt config (count, radius, speed)
src/data/solar-system/kuiper-belt.json     — Belt config
src/types/celestial/dwarf-planet.ts        — DwarfPlanetData, ProceduralTextureConfig
src/components/cosmic-explorer/CelestialBase.tsx — Base wrapper (position, selection, label)
src/components/solar-system/sun/SunCoronaShader.tsx — GLSL corona mesh
src/components/solar-system/sun/SunPointLight.tsx  — Extracted point light
src/components/solar-system/planets/PlanetSurface.tsx      — Texture mesh + rotation
src/components/solar-system/planets/PlanetAtmosphere.tsx   — Fresnel glow mesh
src/components/solar-system/planets/PlanetClouds.tsx       — Cloud rotation layer
src/components/solar-system/planets/PlanetRing.tsx         — Ring geometry mesh
src/components/solar-system/planets/PlanetMoon.tsx         — Moon orbit mesh
src/components/solar-system/dwarf-planets/DwarfPlanetConfig.tsx — Renders 5 dwarf planets
src/components/solar-system/dwarf-planets/ProceduralSurface.tsx  — Noise-based material
src/components/solar-system/small-bodies/AsteroidBelt.tsx  — InstancedMesh ~2000
src/components/solar-system/small-bodies/KuiperBelt.tsx    — InstancedMesh ~1000
```

### Modified Files (6)

```
next.config.mjs                            — Add .glsl webpack rule
src/data/solar-system/planets.json         — Add moons array per planet
src/types/celestial/planet.ts              — Add MoonData, moons array to PlanetData
src/components/solar-system/SolarSystemScene.tsx — Add belts, dwarf planets, Suspense
src/components/solar-system/sun/Sun.tsx     — Replace glow layers → SunCoronaShader
src/components/solar-system/planets/Planet.tsx   — Refactor → CelestialBase composition
src/components/cosmic-explorer/Scene.tsx    — Add EffectComposer + Bloom
```

---

## Task 1: Setup — GLSL Webpack Rule + Branch

**Files:**

- Modify: `next.config.mjs`

- [ ] **Step 1: Create feature branch**

```bash
git checkout develop
git pull origin develop
git checkout -b feature/solar-system-complete
```

- [ ] **Step 2: Add .glsl webpack rule to next.config.mjs**

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      type: "asset/source",
    });
    return config;
  },
};

export default nextConfig;
```

- [ ] **Step 3: Verify build works**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 4: Commit setup**

```bash
git add next.config.mjs
git commit -m "chore(config): add GLSL webpack asset rule for shader loading"
```

---

## Task 2: Data Files — Dwarf Planets

**Files:**

- Create: `src/data/solar-system/dwarf-planets.json`
- Create: `src/types/celestial/dwarf-planet.ts`
- Modify: `src/types/celestial/planet.ts` (add MoonData)

- [ ] **Step 1: Add MoonData type to planet.ts**

Add to end of `src/types/celestial/planet.ts`:

```ts
export interface MoonData {
  id: string;
  name: string;
  radius: number;
  orbitRadius: number;
  orbitalPeriod: number;
  texture?: string;
  color: string;
}
```

Also modify `PlanetData` — change `moons: number` to `moons: MoonData[]`:

```ts
export interface PlanetData {
  id: string;
  name: string;
  slug: string;
  radius: number;
  distance: number;
  distanceScaled: number;
  orbitalPeriod: number;
  rotationSpeed: number;
  tilt: number;
  mass: string;
  temperature: string;
  moonCount: number;
  moons: MoonData[];
  description: string;
  funFacts: string[];
  textures: PlanetTextures;
  hasRing?: boolean;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
  color?: string;
}
```

Note: Keep `moonCount` as number field for display, rename old `moons: number` → `moonCount`. Add `moons: MoonData[]` for actual moon objects.

- [ ] **Step 2: Create dwarf-planet.ts type**

```ts
export interface ProceduralTextureConfig {
  baseColor: string;
  noiseScale: number;
  noiseType: "simplex" | "fbm" | "ridged";
  detailLevel: number;
}

export interface DwarfPlanetData {
  id: string;
  name: string;
  slug: string;
  radius: number;
  distance: number;
  distanceScaled: number;
  orbitalPeriod: number;
  rotationSpeed: number;
  tilt: number;
  mass: string;
  temperature: string;
  moonCount: number;
  description: string;
  funFacts: string[];
  proceduralTexture: ProceduralTextureConfig;
  color: string;
}
```

- [ ] **Step 3: Create dwarf-planets.json**

```json
{
  "dwarfPlanets": [
    {
      "id": "pluto",
      "name": "Pluto",
      "slug": "pluto",
      "radius": 1.0,
      "distance": 39.48,
      "distanceScaled": 40,
      "orbitalPeriod": 90560,
      "rotationSpeed": -0.001,
      "tilt": 122.53,
      "mass": "1.30 × 10²² kg",
      "temperature": "-225°C",
      "moonCount": 5,
      "description": "Planet katai paling terkenal di sabuk Kuiper. Dulunya planet kesembilan, sekarang diklasifikasikan sebagai dwarf planet.",
      "funFacts": [
        "Pluto lebih kecil dari bulan Bumi",
        "Satu tahun di Pluto sama dengan 248 tahun Bumi",
        "Pluto memiliki jantung es yang terlihat dari foto New Horizons"
      ],
      "proceduralTexture": {
        "baseColor": "#C4A882",
        "noiseScale": 0.6,
        "noiseType": "fbm",
        "detailLevel": 4
      },
      "color": "#C4A882"
    },
    {
      "id": "ceres",
      "name": "Ceres",
      "slug": "ceres",
      "radius": 0.8,
      "distance": 2.77,
      "distanceScaled": 14,
      "orbitalPeriod": 1682,
      "rotationSpeed": 0.003,
      "tilt": 4.0,
      "mass": "9.39 × 10²⁰ kg",
      "temperature": "-105°C",
      "moonCount": 0,
      "description": "Objek terbesar di sabuk asteroid. Satu-satunya dwarf planet di inner solar system.",
      "funFacts": [
        "Ceres menyimpan 25% massa sabuk asteroid",
        "Mungkin memiliki samudra air di bawah permukaan",
        "Ditemukan tahun 1801, dulunya dikategorikan planet"
      ],
      "proceduralTexture": {
        "baseColor": "#7A7A6D",
        "noiseScale": 0.8,
        "noiseType": "simplex",
        "detailLevel": 2
      },
      "color": "#7A7A6D"
    },
    {
      "id": "eris",
      "name": "Eris",
      "slug": "eris",
      "radius": 1.1,
      "distance": 67.78,
      "distanceScaled": 45,
      "orbitalPeriod": 204199,
      "rotationSpeed": 0.002,
      "tilt": 78.0,
      "mass": "1.66 × 10²² kg",
      "temperature": "-243°C",
      "moonCount": 1,
      "description": "Dwarf planet paling masif di solar system. Namanya diambil dari dewi perselisihan Greek.",
      "funFacts": [
        "Eris lebih masif dari Pluto",
        "Penemuan Eris yang mendorong reklassifikasi Pluto",
        "Satu orbit Eris memakan waktu 559 tahun"
      ],
      "proceduralTexture": {
        "baseColor": "#E0DDD5",
        "noiseScale": 0.5,
        "noiseType": "fbm",
        "detailLevel": 3
      },
      "color": "#E0DDD5"
    },
    {
      "id": "haumea",
      "name": "Haumea",
      "slug": "haumea",
      "radius": 0.9,
      "distance": 43.13,
      "distanceScaled": 42,
      "orbitalPeriod": 103774,
      "rotationSpeed": 0.01,
      "tilt": 126.0,
      "mass": "4.00 × 10²¹ kg",
      "temperature": "-241°C",
      "moonCount": 2,
      "description": "Dwarf planet berbentuk elips karena rotasi super cepat. Namanya dari dewi fertilitas Hawaii.",
      "funFacts": [
        "Haumea berotasi setiap 4 jam — tercepat di solar system",
        "Bentuknya seperti rugby ball karena rotasi cepat",
        "Memiliki 2 bulan kecil: Hi'iaka dan Namaka"
      ],
      "proceduralTexture": {
        "baseColor": "#B8B0A0",
        "noiseScale": 0.7,
        "noiseType": "ridged",
        "detailLevel": 3
      },
      "color": "#B8B0A0"
    },
    {
      "id": "makemake",
      "name": "Makemake",
      "slug": "makemake",
      "radius": 0.9,
      "distance": 45.79,
      "distanceScaled": 43,
      "orbitalPeriod": 111845,
      "rotationSpeed": 0.003,
      "tilt": 87.0,
      "mass": "3.10 × 10²¹ kg",
      "temperature": "-239°C",
      "moonCount": 1,
      "description": "Dwarf planet di sabuk Kuiper. Namanya dari dewa pencipta Rapa Nui.",
      "funFacts": [
        "Makemake adalah satu dari 3 dwarf planet di Kuiper Belt",
        "Warna permukaannya merah-coklat",
        "Ditemukan tahun 2005, saat Easter Week"
      ],
      "proceduralTexture": {
        "baseColor": "#A0522D",
        "noiseScale": 0.6,
        "noiseType": "fbm",
        "detailLevel": 4
      },
      "color": "#A0522D"
    }
  ]
}
```

- [ ] **Step 4: Update planets.json to add MoonData**

Add `moonCount` field (rename old `moons: number` → `moonCount`) and `moons: MoonData[]` array to each planet. Only Earth gets actual moon data initially; others get empty `moons: []`.

For Earth, add:

```json
"moonCount": 1,
"moons": [
  {
    "id": "moon",
    "name": "Moon",
    "radius": 0.8,
    "orbitRadius": 8,
    "orbitalPeriod": 27.3,
    "texture": "/textures/extras/moon.webp",
    "color": "#C0C0C0"
  }
]
```

For other planets, add `"moonCount": <original_number>, "moons": []`.

- [ ] **Step 5: Create belt config JSONs**

`src/data/solar-system/asteroid-belt.json`:

```json
{
  "count": 2000,
  "innerRadius": 120,
  "outerRadius": 165,
  "thickness": 5,
  "sizeRange": [0.1, 0.6],
  "distribution": "uniform",
  "orbitSpeed": 0.0002,
  "color": "#8B7355"
}
```

`src/data/solar-system/kuiper-belt.json`:

```json
{
  "count": 1000,
  "innerRadius": 350,
  "outerRadius": 400,
  "thickness": 8,
  "sizeRange": [0.2, 0.8],
  "distribution": "uniform",
  "orbitSpeed": 0.0001,
  "color": "#696969"
}
```

- [ ] **Step 6: Verify type-check**

Run: `npm run type-check`
Expected: Passes (may have errors in Planet.tsx until refactored — fix temporarily)

- [ ] **Step 7: Commit data files**

```bash
git add src/types/ src/data/
git commit -m "feat(3d): add dwarf planet data, belt configs, moon type system"
```

---

## Task 3: Shader Common — Noise & Utils

**Files:**

- Create: `src/shaders/common/noise.glsl`
- Create: `src/shaders/common/utils.glsl`

- [ ] **Step 1: Create noise.glsl**

```glsl
// Simplex 3D noise — Stefan Gustavson implementation
// https://github.com/stegu/webgl-noise

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// FBM (Fractal Brownian Motion)
float fbm(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < octaves; i++) {
    value += amplitude * snoise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// Ridged noise
float ridged(vec3 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  float weight = 1.0;
  for (int i = 0; i < octaves; i++) {
    float n = 1.0 - abs(snoise(p * frequency));
    n = n * n;
    value += n * amplitude * weight;
    weight *= n;
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}
```

- [ ] **Step 2: Create utils.glsl**

```glsl
float remap(float value, float low1, float high1, float low2, float high2) {
  return low2 + (value - low1) * (high2 - low2) / (high1 - low1);
}

vec3 remap(vec3 value, float low1, float high1, float low2, float high2) {
  return vec3(
    remap(value.x, low1, high1, low2, high2),
    remap(value.y, low1, high1, low2, high2),
    remap(value.z, low1, high1, low2, high2)
  );
}

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

mat2 rotation2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}
```

- [ ] **Step 3: Verify webpack loads .glsl correctly**

Create a temporary test: import `noise.glsl` in any existing component, verify it logs the string content, then remove.

- [ ] **Step 4: Commit shaders common**

```bash
git add src/shaders/
git commit -m "feat(3d): add GLSL noise and utility shader functions"
```

---

## Task 4: Shader — Procedural Texture

**Files:**

- Create: `src/shaders/procedural/procedural.vert.glsl`
- Create: `src/shaders/procedural/procedural.frag.glsl`

- [ ] **Step 1: Create procedural.vert.glsl**

```glsl
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Create procedural.frag.glsl**

```glsl
#pragma include <common/noise.glsl>
#pragma include <common/utils.glsl>

uniform vec3 u_baseColor;
uniform vec3 u_secondaryColor;
uniform float u_noiseScale;
uniform int u_noiseType;
uniform int u_detailLevel;
uniform float u_roughness;
uniform vec3 u_sunPosition;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 noisePos = vWorldPosition * u_noiseScale;
  float n;

  if (u_noiseType == 0) {
    n = snoise(noisePos);
  } else if (u_noiseType == 1) {
    n = fbm(noisePos, u_detailLevel);
  } else {
    n = ridged(noisePos, u_detailLevel);
  }

  float t = remap(n, -1.0, 1.0, 0.0, 1.0);
  vec3 surfaceColor = mix(u_baseColor, u_secondaryColor, t);

  vec3 sunDir = normalize(u_sunPosition - vWorldPosition);
  float diffuse = max(dot(vNormal, sunDir), 0.0);
  float ambient = 0.15;
  float light = ambient + diffuse * 0.85;

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
  rim = pow(rim, 3.0) * 0.3;

  vec3 finalColor = surfaceColor * light + vec3(0.4, 0.5, 0.6) * rim;
  gl_FragColor = vec4(finalColor, 1.0);
}
```

Note: `#pragma include` won't work natively with Three.js. In the component, we'll concatenate the shader strings manually.

- [ ] **Step 3: Commit procedural shader**

```bash
git add src/shaders/procedural/
git commit -m "feat(3d): add procedural texture GLSL shaders for dwarf planets"
```

---

## Task 5: Hook — useProceduralTexture

**Files:**

- Create: `src/hooks/useProceduralTexture.ts`

- [ ] **Step 1: Create useProceduralTexture.ts**

```ts
import { useMemo } from "react";
import * as THREE from "three";
import { ProceduralTextureConfig } from "@/types/celestial/dwarf-planet";

import proceduralVert from "@/shaders/procedural/procedural.vert.glsl";
import proceduralFragRaw from "@/shaders/procedural/procedural.frag.glsl";
import noiseGlsl from "@/shaders/common/noise.glsl";
import utilsGlsl from "@/shaders/common/utils.glsl";

const NOISE_TYPE_MAP = { simplex: 0, fbm: 1, ridged: 2 } as const;

export function useProceduralTexture(
  config: ProceduralTextureConfig,
): THREE.ShaderMaterial {
  const baseColor = new THREE.Color(config.baseColor);
  const secondaryColor = baseColor.clone().offsetHSL(0.05, -0.1, 0.1);

  const material = useMemo(() => {
    const fragmentShader = proceduralFragRaw
      .replace("#pragma include <common/noise.glsl>", noiseGlsl)
      .replace("#pragma include <common/utils.glsl>", utilsGlsl);

    return new THREE.ShaderMaterial({
      vertexShader: proceduralVert,
      fragmentShader,
      uniforms: {
        u_baseColor: { value: baseColor },
        u_secondaryColor: { value: secondaryColor },
        u_noiseScale: { value: config.noiseScale },
        u_noiseType: { value: NOISE_TYPE_MAP[config.noiseType] },
        u_detailLevel: { value: config.detailLevel },
        u_roughness: { value: 0.7 },
        u_sunPosition: { value: new THREE.Vector3(0, 0, 0) },
      },
    });
  }, [config, baseColor, secondaryColor]);

  return material;
}
```

- [ ] **Step 2: Commit hook**

```bash
git add src/hooks/useProceduralTexture.ts
git commit -m "feat(3d): add useProceduralTexture hook for GPU noise materials"
```

---

## Task 6: Hook — useOrbitAnimation + useSelection + useCelestialLabel

**Files:**

- Create: `src/hooks/useOrbitAnimation.ts`
- Create: `src/hooks/useSelection.ts`
- Create: `src/hooks/useCelestialLabel.ts`

- [ ] **Step 1: Create useOrbitAnimation.ts**

```ts
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { calculateOrbitalPosition } from "@/lib/utils/astronomy";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface OrbitConfig {
  distance: number;
  period: number;
  initialOffset?: number;
}

export function useOrbitAnimation(
  config: OrbitConfig | null,
  groupRef: React.RefObject<THREE.Group | null>,
) {
  const positionRef = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!config || !groupRef.current) return;

    const { isPlaying, speed } = useSimulationStore.getState();
    if (!isPlaying) return;

    const dayOffset = state.clock.getElapsedTime() * speed;
    const pos = calculateOrbitalPosition(
      config.distance,
      config.period,
      dayOffset,
      0,
    );

    positionRef.current.set(pos.x, pos.y, pos.z);
    groupRef.current.position.copy(positionRef.current);
  });

  return positionRef;
}
```

- [ ] **Step 2: Create useSelection.ts**

```ts
import { useState, useCallback } from "react";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function useSelection(id: string) {
  const [hovered, setHovered] = useState(false);

  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const isSelected = selectedPlanet === id;

  const selectPlanet = useExplorerStore((s) => s.selectPlanet);
  const setCameraTarget = useExplorerStore((s) => s.setCameraTarget);
  const setIsTransitioning = useExplorerStore((s) => s.setIsTransitioning);

  const handleClick = useCallback(
    (
      e: { stopPropagation: () => void },
      groupRef: React.RefObject<THREE.Group | null>,
    ) => {
      e.stopPropagation();
      if (isSelected) {
        selectPlanet(null);
        setCameraTarget(null);
      } else {
        selectPlanet(id);
        if (groupRef.current) {
          const pos = new THREE.Vector3();
          groupRef.current.getWorldPosition(pos);
          setCameraTarget(pos);
          setIsTransitioning(true);
        }
      }
    },
    [id, isSelected, selectPlanet, setCameraTarget, setIsTransitioning],
  );

  const handlePointerOver = useCallback(() => {
    setHovered(true);
    useExplorerStore.getState().hoverPlanet(id);
  }, [id]);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    useExplorerStore.getState().hoverPlanet(null);
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

- [ ] **Step 3: Create useCelestialLabel.ts**

```ts
import { useMemo } from "react";

export function useCelestialLabel(
  name: string,
  radius: number,
  color?: string,
) {
  const position = useMemo(
    () => [0, radius * 2 + 1.5, 0] as [number, number, number],
    [radius],
  );

  const style = useMemo(
    () => ({
      color: color || "#ffffffcc",
      fontSize: "10px",
      fontWeight: "600",
      letterSpacing: "0.1em",
      textTransform: "uppercase" as const,
      pointerEvents: "none" as const,
      userSelect: "none" as const,
      whiteSpace: "nowrap" as const,
      textAlign: "center" as const,
      dropShadow: "0 2px 4px rgba(0,0,0,0.5)",
    }),
    [color],
  );

  return { position, style, text: name.toUpperCase() };
}
```

- [ ] **Step 4: Commit hooks**

```bash
git add src/hooks/useOrbitAnimation.ts src/hooks/useSelection.ts src/hooks/useCelestialLabel.ts
git commit -m "feat(3d): add useOrbitAnimation, useSelection, useCelestialLabel hooks"
```

---

## Task 7: Component — ProceduralSurface + useDwarfPlanetData

**Files:**

- Create: `src/hooks/data/useDwarfPlanetData.ts`
- Create: `src/components/solar-system/dwarf-planets/ProceduralSurface.tsx`

- [ ] **Step 1: Create useDwarfPlanetData.ts**

```ts
import { useMemo } from "react";
import dwarfPlanetsData from "@/data/solar-system/dwarf-planets.json";
import { DwarfPlanetData } from "@/types/celestial/dwarf-planet";

export function useDwarfPlanetData() {
  const dwarfPlanets = useMemo(
    () => dwarfPlanetsData.dwarfPlanets as DwarfPlanetData[],
    [],
  );

  const getDwarfPlanetBySlug = useMemo(
    () => (slug: string) => dwarfPlanets.find((dp) => dp.slug === slug),
    [dwarfPlanets],
  );

  return { dwarfPlanets, getDwarfPlanetBySlug };
}
```

- [ ] **Step 2: Create ProceduralSurface.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useProceduralTexture } from "@/hooks/useProceduralTexture";
import { ProceduralTextureConfig } from "@/types/celestial/dwarf-planet";

interface ProceduralSurfaceProps {
  radius: number;
  proceduralTexture: ProceduralTextureConfig;
  rotationSpeed: number;
  tilt: number;
}

export function ProceduralSurface({
  radius,
  proceduralTexture,
  rotationSpeed,
  tilt,
}: ProceduralSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useProceduralTexture(proceduralTexture);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/data/useDwarfPlanetData.ts src/components/solar-system/dwarf-planets/
git commit -m "feat(3d): add ProceduralSurface component and dwarf planet data hook"
```

---

## Task 8: Component — CelestialBase

**Files:**

- Create: `src/components/cosmic-explorer/CelestialBase.tsx`

- [ ] **Step 1: Create CelestialBase.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useOrbitAnimation } from "@/hooks/useOrbitAnimation";
import { useSelection } from "@/hooks/useSelection";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface OrbitConfig {
  distance: number;
  period: number;
  initialOffset?: number;
}

interface CelestialBaseProps {
  id: string;
  name: string;
  radius: number;
  color?: string;
  orbitConfig?: OrbitConfig;
  position?: [number, number, number];
  selectionRing?: boolean;
  label?: string;
  children?: React.ReactNode;
}

export function CelestialBase({
  id,
  name,
  radius,
  color,
  orbitConfig,
  position,
  selectionRing = true,
  label,
  children,
}: CelestialBaseProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const {
    isSelected,
    isHovered,
    handleClick,
    handlePointerOver,
    handlePointerOut,
  } = useSelection(id);

  useOrbitAnimation(orbitConfig || null, groupRef);

  useFrame(() => {
    if (!meshRef.current) return;
    const targetScale = isHovered || isSelected ? 1.15 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1,
    );
  });

  const onClick = (e: { stopPropagation: () => void }) => {
    handleClick(e, groupRef);
  };

  const initialPosition = position
    ? new THREE.Vector3(...position)
    : orbitConfig
      ? undefined
      : new THREE.Vector3(0, 0, 0);

  return (
    <group ref={groupRef} position={initialPosition}>
      {/* Invisible hit mesh for click/hover detection */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius * 2, 32, 32]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Children render visual features */}
      {children}

      {/* HTML Label */}
      {label && (
        <Html
          position={[0, radius * 2 + 1.5, 0]}
          center
          distanceFactor={50}
          occlude={false}
          style={{ pointerEvents: "none" }}
        >
          <div className="select-none text-center whitespace-nowrap">
            <div
              className="text-xs font-semibold tracking-wider drop-shadow-lg"
              style={{ color: color || "#ffffffcc" }}
            >
              {label}
            </div>
          </div>
        </Html>
      )}

      {/* Selection ring */}
      {isSelected && selectionRing && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 2 + 0.5, radius * 2 + 0.8, 64]} />
          <meshBasicMaterial
            color="#4a9eff"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
```

- [ ] **Step 2: Commit CelestialBase**

```bash
git add src/components/cosmic-explorer/CelestialBase.tsx
git commit -m "feat(3d): add CelestialBase composition wrapper for celestial objects"
```

---

## Task 9: Components — Planet Sub-components

**Files:**

- Create: `src/components/solar-system/planets/PlanetSurface.tsx`
- Create: `src/components/solar-system/planets/PlanetAtmosphere.tsx`
- Create: `src/components/solar-system/planets/PlanetClouds.tsx`
- Create: `src/components/solar-system/planets/PlanetRing.tsx`

- [ ] **Step 1: Create PlanetSurface.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PlanetTextures } from "@/types/celestial/planet";

interface PlanetSurfaceProps {
  textures: PlanetTextures;
  radius: number;
  rotationSpeed: number;
  tilt: number;
  color?: string;
}

export function PlanetSurface({
  textures,
  radius,
  rotationSpeed,
  tilt,
  color,
}: PlanetSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const textureMap: Record<string, string> = {};
  if (textures.diffuse) textureMap.map = textures.diffuse;
  if (textures.normal) textureMap.normalMap = textures.normal;
  if (textures.specular) textureMap.roughnessMap = textures.specular;
  if (textures.emissive) textureMap.emissiveMap = textures.emissive;

  const loadedTextures = useTexture(textureMap);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += rotationSpeed * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={loadedTextures.map as THREE.Texture | undefined}
        normalMap={loadedTextures.normalMap as THREE.Texture | undefined}
        roughnessMap={loadedTextures.roughnessMap as THREE.Texture | undefined}
        emissiveMap={loadedTextures.emissiveMap as THREE.Texture | undefined}
        emissive={
          loadedTextures.emissiveMap
            ? new THREE.Color(color || "#ffffff")
            : new THREE.Color(0x000000)
        }
        emissiveIntensity={loadedTextures.emissiveMap ? 0.4 : 0}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}
```

- [ ] **Step 2: Create PlanetAtmosphere.tsx**

```tsx
"use client";

interface PlanetAtmosphereProps {
  radius: number;
  color: string;
  opacity?: number;
}

export function PlanetAtmosphere({
  radius,
  color,
  opacity = 0.2,
}: PlanetAtmosphereProps) {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
```

- [ ] **Step 3: Create PlanetClouds.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";

interface PlanetCloudsProps {
  texturePath: string;
  radius: number;
  rotationSpeed: number;
  opacity?: number;
}

export function PlanetClouds({
  texturePath,
  radius,
  rotationSpeed,
  opacity = 0.4,
}: PlanetCloudsProps) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useTexture(texturePath);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed * 0.012;
    }
  });

  return (
    <mesh ref={ref} scale={1.02}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}
```

- [ ] **Step 4: Create PlanetRing.tsx**

```tsx
"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlanetRingProps {
  texturePath: string;
  radius: number;
  innerMultiplier?: number;
  outerMultiplier?: number;
}

export function PlanetRing({
  texturePath,
  radius,
  innerMultiplier = 1.5,
  outerMultiplier = 2.5,
}: PlanetRingProps) {
  const tex = useTexture(texturePath);

  return (
    <mesh rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
      <ringGeometry
        args={[radius * innerMultiplier, radius * outerMultiplier, 64]}
      />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
```

- [ ] **Step 5: Commit planet sub-components**

```bash
git add src/components/solar-system/planets/PlanetSurface.tsx \
        src/components/solar-system/planets/PlanetAtmosphere.tsx \
        src/components/solar-system/planets/PlanetClouds.tsx \
        src/components/solar-system/planets/PlanetRing.tsx
git commit -m "feat(3d): add Planet sub-components (Surface, Atmosphere, Clouds, Ring)"
```

---

## Task 10: Component — PlanetMoon + Refactor Planet.tsx

**Files:**

- Create: `src/components/solar-system/planets/PlanetMoon.tsx`
- Modify: `src/components/solar-system/planets/Planet.tsx`

- [ ] **Step 1: Create PlanetMoon.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MoonData } from "@/types/celestial/planet";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface PlanetMoonProps {
  moonData: MoonData;
}

export function PlanetMoon({ moonData }: PlanetMoonProps) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = moonData.texture ? useTexture(moonData.texture) : undefined;

  const moonRadius = Math.max(moonData.radius, 0.3);

  useFrame((state) => {
    if (!groupRef.current) return;

    const { isPlaying, speed } = useSimulationStore.getState();
    if (!isPlaying) return;

    const dayOffset = state.clock.getElapsedTime() * speed;
    const angle =
      ((dayOffset / moonData.orbitalPeriod) * 2 * Math.PI) % (2 * Math.PI);

    groupRef.current.position.x = moonData.orbitRadius * Math.cos(angle);
    groupRef.current.position.z = moonData.orbitRadius * Math.sin(angle);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[moonRadius, 32, 32]} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
        ) : (
          <meshStandardMaterial color={moonData.color} roughness={0.9} />
        )}
      </mesh>

      {/* Moon orbit line */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[moonData.orbitRadius - 0.1, moonData.orbitRadius + 0.1, 64]}
        />
        <meshBasicMaterial
          color={moonData.color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
```

- [ ] **Step 2: Refactor Planet.tsx to use CelestialBase composition**

Replace entire `src/components/solar-system/planets/Planet.tsx` with:

```tsx
"use client";

import { Suspense } from "react";
import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { PlanetSurface } from "./PlanetSurface";
import { PlanetAtmosphere } from "./PlanetAtmosphere";
import { PlanetClouds } from "./PlanetClouds";
import { PlanetRing } from "./PlanetRing";
import { PlanetMoon } from "./PlanetMoon";
import { PlanetData } from "@/types/celestial/planet";

interface PlanetProps {
  planet: PlanetData;
}

export function Planet({ planet }: PlanetProps) {
  const planetRadius = Math.max(planet.radius * 2, 0.5);

  return (
    <CelestialBase
      id={planet.id}
      name={planet.name}
      radius={planet.radius}
      color={planet.color}
      orbitConfig={{
        distance: planet.distanceScaled * 10,
        period: planet.orbitalPeriod,
      }}
      selectionRing={true}
      label={planet.name.toUpperCase()}
    >
      <Suspense fallback={null}>
        <PlanetSurface
          textures={planet.textures}
          radius={planetRadius}
          rotationSpeed={planet.rotationSpeed}
          tilt={planet.tilt}
          color={planet.color}
        />
      </Suspense>

      {planet.hasAtmosphere && (
        <PlanetAtmosphere
          radius={planetRadius}
          color={planet.atmosphereColor || "#4a9eff"}
        />
      )}

      {planet.textures.clouds && (
        <PlanetClouds
          texturePath={planet.textures.clouds}
          radius={planetRadius}
          rotationSpeed={planet.rotationSpeed}
        />
      )}

      {planet.textures.ring && (
        <PlanetRing texturePath={planet.textures.ring} radius={planetRadius} />
      )}

      {planet.moons?.map((moon) => (
        <PlanetMoon key={moon.id} moonData={moon} />
      ))}
    </CelestialBase>
  );
}
```

- [ ] **Step 3: Verify build**

Run: `npm run type-check`
Expected: May have errors due to `moons` type change in planets.json. Fix temporarily.

Run: `npm run build`
Expected: Build passes

- [ ] **Step 4: Commit refactor**

```bash
git add src/components/solar-system/planets/
git commit -m "refactor(3d): refactor Planet.tsx to use CelestialBase composition pattern"
```

---

## Task 11: Component — DwarfPlanetConfig

**Files:**

- Create: `src/components/solar-system/dwarf-planets/DwarfPlanetConfig.tsx`

- [ ] **Step 1: Create DwarfPlanetConfig.tsx**

```tsx
"use client";

import { CelestialBase } from "@/components/cosmic-explorer/CelestialBase";
import { ProceduralSurface } from "./ProceduralSurface";
import { useDwarfPlanetData } from "@/hooks/data/useDwarfPlanetData";
import { DwarfPlanetData } from "@/types/celestial/dwarf-planet";

function DwarfPlanet({ data }: { data: DwarfPlanetData }) {
  const dwarfRadius = Math.max(data.radius * 2, 0.3);

  return (
    <CelestialBase
      id={data.id}
      name={data.name}
      radius={data.radius}
      color={data.color}
      orbitConfig={{
        distance: data.distanceScaled * 10,
        period: data.orbitalPeriod,
      }}
      selectionRing={true}
      label={data.name.toUpperCase()}
    >
      <ProceduralSurface
        radius={dwarfRadius}
        proceduralTexture={data.proceduralTexture}
        rotationSpeed={data.rotationSpeed}
        tilt={data.tilt}
      />
    </CelestialBase>
  );
}

export function DwarfPlanetConfig() {
  const { dwarfPlanets } = useDwarfPlanetData();

  return (
    <group>
      {dwarfPlanets.map((dp) => (
        <DwarfPlanet key={dp.id} data={dp} />
      ))}
    </group>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/solar-system/dwarf-planets/DwarfPlanetConfig.tsx
git commit -m "feat(3d): add DwarfPlanetConfig with CelestialBase composition"
```

---

## Task 12: Shader — Sun Corona

**Files:**

- Create: `src/shaders/sun/corona.vert.glsl`
- Create: `src/shaders/sun/corona.frag.glsl`

- [ ] **Step 1: Create corona.vert.glsl**

```glsl
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

uniform float u_time;

#pragma include <common/noise.glsl>

void main() {
  vUv = uv;
  vec3 displacedPosition = position + normal * snoise(position * 0.3 + u_time * 0.1) * 0.5;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;
  vViewDirection = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
```

- [ ] **Step 2: Create corona.frag.glsl**

```glsl
#pragma include <common/noise.glsl>
#pragma include <common/utils.glsl>

uniform float u_time;
uniform float u_sunRadius;
uniform float u_coronaIntensity;
uniform vec3 u_color1;
uniform vec3 u_color2;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewDirection;

void main() {
  float fresnel = 1.0 - dot(vViewDirection, vNormal);
  fresnel = pow(fresnel, 2.0);

  vec3 noisePos = vWorldPosition * 0.5 + u_time * 0.3;
  float plasma = fbm(noisePos, 4);
  plasma = remap(plasma, -1.0, 1.0, 0.0, 1.0);

  float distFromCenter = length(vWorldPosition) / u_sunRadius;
  float density = max(0.0, 1.0 - distFromCenter);
  density = pow(density, 1.5);

  vec3 coronaColor = mix(u_color1, u_color2, plasma);
  float alpha = fresnel * u_coronaIntensity * density * (0.5 + plasma * 0.5);

  gl_FragColor = vec4(coronaColor, alpha);
}
```

- [ ] **Step 3: Create SunCoronaShader.tsx**

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import coronaVert from "@/shaders/sun/corona.vert.glsl";
import coronaFragRaw from "@/shaders/sun/corona.frag.glsl";
import noiseGlsl from "@/shaders/common/noise.glsl";
import utilsGlsl from "@/shaders/common/utils.glsl";

export function SunCoronaShader() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useRef(
    new THREE.ShaderMaterial({
      vertexShader: coronaVert.replace(
        "#pragma include <common/noise.glsl>",
        noiseGlsl,
      ),
      fragmentShader: coronaFragRaw
        .replace("#pragma include <common/noise.glsl>", noiseGlsl)
        .replace("#pragma include <common/utils.glsl>", utilsGlsl),
      uniforms: {
        u_time: { value: 0 },
        u_sunRadius: { value: 10.0 },
        u_coronaIntensity: { value: 1.5 },
        u_color1: { value: new THREE.Color("#ffcc66") },
        u_color2: { value: new THREE.Color("#ff6600") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    }),
  ).current;

  useFrame((state) => {
    material.uniforms.u_time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[25, 64, 64]} />
    </mesh>
  );
}
```

- [ ] **Step 4: Create SunPointLight.tsx**

```tsx
"use client";

export function SunPointLight() {
  return (
    <pointLight
      position={[0, 0, 0]}
      intensity={500}
      distance={2000}
      decay={1}
      color="#fff5e6"
    />
  );
}
```

- [ ] **Step 5: Refactor Sun.tsx**

Replace entire `src/components/solar-system/sun/Sun.tsx` with:

```tsx
"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SunCoronaShader } from "./SunCoronaShader";
import { SunPointLight } from "./SunPointLight";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);

  const sunTexture = useTexture("/textures/solar-system/sun/diffuse.webp");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive={new THREE.Color("#ffaa00")}
          emissiveIntensity={0.8}
        />
      </mesh>

      <SunCoronaShader />
      <SunPointLight />
    </group>
  );
}
```

- [ ] **Step 6: Verify build**

Run: `npm run build`
Expected: Build succeeds. Sun should render with corona shader + point light.

- [ ] **Step 7: Commit sun refactor**

```bash
git add src/shaders/sun/ src/components/solar-system/sun/
git commit -m "feat(3d): add Sun corona GLSL shader and refactor Sun component"
```

---

## Task 13: Shader — Earth Day/Night + Atmosphere

**Files:**

- Create: `src/shaders/earth/daynight.vert.glsl`
- Create: `src/shaders/earth/daynight.frag.glsl`
- Create: `src/shaders/atmosphere/atmosphere.vert.glsl`
- Create: `src/shaders/atmosphere/atmosphere.frag.glsl`

- [ ] **Step 1: Create daynight.vert.glsl**

```glsl
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vUv = uv;
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 2: Create daynight.frag.glsl**

```glsl
uniform sampler2D u_dayTexture;
uniform sampler2D u_nightTexture;
uniform vec3 u_sunPosition;
uniform float u_ambientIntensity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 sunDir = normalize(u_sunPosition - vWorldPosition);
  float lightFacing = dot(vNormal, sunDir);

  float dayNightFactor = smoothstep(-0.1, 0.2, lightFacing);

  vec4 dayColor = texture2D(u_dayTexture, vUv);
  vec4 nightColor = texture2D(u_nightTexture, vUv);

  vec3 finalColor = mix(nightColor.rgb * 1.5, dayColor.rgb, dayNightFactor);

  float ambient = u_ambientIntensity;
  float diffuse = max(lightFacing, 0.0) * 0.85;
  float light = ambient + diffuse;

  finalColor *= light;

  float specular = pow(max(dot(reflect(-sunDir, vNormal), normalize(cameraPosition - vWorldPosition)), 0.0), 20.0);
  finalColor += vec3(0.3) * specular * dayNightFactor;

  gl_FragColor = vec4(finalColor, 1.0);
}
```

- [ ] **Step 3: Create atmosphere.vert.glsl**

```glsl
varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 worldPos = modelMatrix * vec4(position, 1.0);
  vViewDirection = normalize(cameraPosition - worldPos.xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
```

- [ ] **Step 4: Create atmosphere.frag.glsl**

```glsl
uniform vec3 u_atmosphereColor;
uniform float u_intensity;
uniform float u_falloff;

varying vec3 vNormal;
varying vec3 vViewDirection;

void main() {
  float fresnel = 1.0 - dot(vViewDirection, vNormal);
  float glow = pow(fresnel, u_falloff) * u_intensity;
  gl_FragColor = vec4(u_atmosphereColor, glow);
}
```

- [ ] **Step 5: Commit shaders**

```bash
git add src/shaders/earth/ src/shaders/atmosphere/
git commit -m "feat(3d): add Earth day/night and atmosphere GLSL shaders"
```

---

## Task 14: Component — AsteroidBelt + KuiperBelt

**Files:**

- Create: `src/components/solar-system/small-bodies/AsteroidBelt.tsx`
- Create: `src/components/solar-system/small-bodies/KuiperBelt.tsx`

- [ ] **Step 1: Create AsteroidBelt.tsx**

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import asteroidConfig from "@/data/solar-system/asteroid-belt.json";

export function AsteroidBelt() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { count, innerRadius, outerRadius, thickness, sizeRange, color } =
    asteroidConfig;

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.1 }),
    [color],
  );

  const instances = useMemo(() => {
    const dummy = new THREE.Object3D();
    const data: { scale: number }[] = [];

    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * thickness;

      const scale =
        sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

      dummy.position.set(
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle),
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      data.push({ scale });

      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }

    return data;
  }, [count, innerRadius, outerRadius, thickness, sizeRange]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += asteroidConfig.orbitSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
}
```

- [ ] **Step 2: Create KuiperBelt.tsx**

Same pattern as AsteroidBelt but using `kuiper-belt.json` config.

```tsx
"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import kuiperConfig from "@/data/solar-system/kuiper-belt.json";

export function KuiperBelt() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { count, innerRadius, outerRadius, thickness, sizeRange, color } =
    kuiperConfig;

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.1 }),
    [color],
  );

  useMemo(() => {
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * thickness;

      const scale =
        sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

      dummy.position.set(
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle),
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
    }

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, innerRadius, outerRadius, thickness, sizeRange]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += kuiperConfig.orbitSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, count]}
        frustumCulled={false}
      />
    </group>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/solar-system/small-bodies/
git commit -m "feat(3d): add AsteroidBelt and KuiperBelt InstancedMesh components"
```

---

## Task 15: Integration — SolarSystemScene + Scene.tsx Bloom

**Files:**

- Modify: `src/components/solar-system/SolarSystemScene.tsx`
- Modify: `src/components/cosmic-explorer/Scene.tsx`
- Modify: `src/data/solar-system/planets.json` (add moonCount + moons array)

- [ ] **Step 1: Update SolarSystemScene.tsx**

```tsx
"use client";

import { Suspense } from "react";
import { Sun } from "./sun/Sun";
import { PlanetConfig } from "./planets/PlanetConfig";
import { DwarfPlanetConfig } from "./dwarf-planets/DwarfPlanetConfig";
import { OrbitLines } from "./orbits/OrbitLines";
import { AsteroidBelt } from "./small-bodies/AsteroidBelt";
import { KuiperBelt } from "./small-bodies/KuiperBelt";

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <OrbitLines />
      <Suspense fallback={null}>
        <PlanetConfig />
        <DwarfPlanetConfig />
        <AsteroidBelt />
        <KuiperBelt />
      </Suspense>
    </group>
  );
}
```

- [ ] **Step 2: Update Scene.tsx — add Bloom**

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
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function Scene() {
  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const isFlying = !!selectedPlanet;

  return (
    <>
      <Camera />
      <Lighting />
      <ScaleManager />
      <Stars
        radius={5000}
        depth={100}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <SolarSystemScene />
      <OrbitControls
        enabled={!isFlying}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={600}
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

- [ ] **Step 3: Update planets.json — add moonCount + moons**

For each planet entry, replace `"moons": <number>` with `"moonCount": <number>, "moons": []`. For Earth specifically:

```json
"moonCount": 1,
"moons": [
  {
    "id": "moon",
    "name": "Moon",
    "radius": 0.8,
    "orbitRadius": 8,
    "orbitalPeriod": 27.3,
    "texture": "/textures/extras/moon.webp",
    "color": "#C0C0C0"
  }
]
```

- [ ] **Step 4: Verify full build**

Run: `npm run build`
Expected: Build passes with all new components integrated

- [ ] **Step 5: Manual visual verification**

Run: `npm run dev`
Open http://localhost:3000 → verify:

- 8 planets render with CelestialBase (orbit, selection, labels)
- Earth has Moon orbiting
- 5 dwarf planets render with procedural textures
- Asteroid belt visible between Mars-Jupiter
- Kuiper belt visible outside Neptune
- Sun has corona shader glow (not old layered spheres)
- Bloom effect on Sun glow

- [ ] **Step 6: Commit integration**

```bash
git add src/components/solar-system/SolarSystemScene.tsx \
        src/components/cosmic-explorer/Scene.tsx \
        src/data/solar-system/planets.json
git commit -m "feat(3d): integrate all solar system components with Bloom post-processing"
```

---

## Task 16: Barrel Exports + SearchModal/InfoPanel Update

**Files:**

- Create: `src/components/solar-system/index.ts`
- Modify: `src/components/ui/SearchModal.tsx` (add dwarf planets)
- Modify: `src/components/ui/InfoPanel.tsx` (handle dwarf planet data)

- [ ] **Step 1: Create barrel export index.ts**

```ts
export { SolarSystemScene } from "./SolarSystemScene";
export { Sun } from "./sun/Sun";
export { Planet } from "./planets/Planet";
export { PlanetConfig } from "./planets/PlanetConfig";
export { PlanetSurface } from "./planets/PlanetSurface";
export { PlanetAtmosphere } from "./planets/PlanetAtmosphere";
export { PlanetClouds } from "./planets/PlanetClouds";
export { PlanetRing } from "./planets/PlanetRing";
export { PlanetMoon } from "./planets/PlanetMoon";
export { DwarfPlanetConfig } from "./dwarf-planets/DwarfPlanetConfig";
export { ProceduralSurface } from "./dwarf-planets/ProceduralSurface";
export { AsteroidBelt } from "./small-bodies/AsteroidBelt";
export { KuiperBelt } from "./small-bodies/KuiperBelt";
export { OrbitLines } from "./orbits/OrbitLines";
```

- [ ] **Step 2: Update SearchModal to include dwarf planets**

Add dwarf planet entries to `allObjects` array in `SearchModal.tsx`:

```tsx
const { planets } = usePlanetData();
const { dwarfPlanets } = useDwarfPlanetData();

const allObjects = [
  { id: "sun", name: "Sun", color: "#FBBF24", type: "star" as const },
  ...planets.map((p) => ({
    id: p.id,
    name: p.name,
    color: p.color || "#ffffff",
    type: "planet" as const,
    distanceScaled: p.distanceScaled,
  })),
  ...dwarfPlanets.map((dp) => ({
    id: dp.id,
    name: dp.name,
    color: dp.color,
    type: "dwarf planet" as const,
    distanceScaled: dp.distanceScaled,
  })),
];
```

Add import: `import { useDwarfPlanetData } from '@/hooks/data/useDwarfPlanetData';`

- [ ] **Step 3: Update InfoPanel to handle dwarf planets**

Modify `InfoPanel.tsx` to also check `useDwarfPlanetData()` when `selectedPlanet` doesn't match a regular planet. Show same layout but with dwarf planet data (procedural texture note instead of texture list).

- [ ] **Step 4: Verify build + manual test**

Run: `npm run build` → pass
Run: `npm run dev` → test search includes dwarf planets, info panel shows dwarf planet details

- [ ] **Step 5: Commit**

```bash
git add src/components/solar-system/index.ts src/components/ui/
git commit -m "feat(ui): add barrel exports and dwarf planet support in search/info panels"
```

---

## Task 17: Final Verification + Push

- [ ] **Step 1: Run type-check**

```bash
npm run type-check
```

- [ ] **Step 2: Run lint**

```bash
npm run lint
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

- [ ] **Step 4: Manual visual test**

```bash
npm run dev
```

Verify all features:

- ✅ 8 planets with CelestialBase composition
- ✅ Earth's Moon orbiting
- ✅ 5 dwarf planets with procedural textures
- ✅ Asteroid Belt (~2000 InstancedMesh)
- ✅ Kuiper Belt (~1000 InstancedMesh)
- ✅ Sun corona GLSL shader
- ✅ Bloom post-processing
- ✅ Search includes dwarf planets
- ✅ Info panel shows dwarf planet details
- ✅ Selection + camera fly-to works
- ✅ Simulation controls (play/pause/speed)

- [ ] **Step 5: Push feature branch**

```bash
git push -u origin feature/solar-system-complete
```

- [ ] **Step 6: Merge to develop (squash)**

```bash
git checkout develop
git merge --squash feature/solar-system-complete
git commit -m "feat(3d): Solar System Complete — CelestialBase architecture, Moon, Dwarf Planets, Belts, Sun Corona GLSL, Bloom"
git push origin develop
```

- [ ] **Step 7: Cleanup feature branch**

```bash
git branch -d feature/solar-system-complete
git push origin --delete feature/solar-system-complete
```
