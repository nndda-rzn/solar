# Phase 1: Project Setup & Solar System Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up Next.js 14 project with React Three Fiber and render a realistic 3D solar system with interactive planets.

**Architecture:** Next.js 14 App Router serves the React app. React Three Fiber renders the 3D scene via `<Canvas>`. Zustand manages global state (simulation speed, selected planet). Static JSON stores planet data. Textures loaded via `useTexture()` from Drei. Orbit animation runs in `useFrame()`.

**Tech Stack:** Next.js 14, React 18, React Three Fiber, Drei, @react-three/postprocessing, Three.js, Zustand, Tailwind CSS, TypeScript

---

## File Map

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (html, body, fonts)
│   ├── globals.css                   # Tailwind base styles
│   ├── page.tsx                      # Redirect to /[locale]
│   └── [locale]/
│       ├── layout.tsx                # Locale layout (providers)
│       └── page.tsx                  # Landing → Cosmic Explorer
├── components/
│   ├── cosmic-explorer/
│   │   ├── CosmicExplorer.tsx        # Root Canvas wrapper
│   │   ├── Scene.tsx                 # R3F Scene (lighting, controls, post-fx)
│   │   ├── Camera.tsx                # PerspectiveCamera setup
│   │   └── Lighting.tsx              # PointLight (Sun) + AmbientLight
│   ├── solar-system/
│   │   ├── SolarSystemScene.tsx      # Scene container for solar system
│   │   ├── sun/
│   │   │   └── Sun.tsx               # Sun mesh (emissive material)
│   │   └── planets/
│   │       ├── Planet.tsx            # Reusable planet component
│   │       └── PlanetConfig.tsx      # Config-driven planet renderer
│   ├── cosmic-explorer/controls/
│   │   ├── OrbitControls.tsx         # Drei OrbitControls wrapper
│   │   └── SpeedControl.tsx          # Simulation speed slider
│   └── cosmic-explorer/shared/
│       ├── OrbitPath.tsx             # Orbit line renderer
│       └── Label.tsx                 # Billboard text label
├── hooks/
│   ├── 3d/
│   │   ├── usePlanetPosition.ts      # Kepler orbital position calculator
│   │   └── useSimulationTime.ts      # Time management (speed, pause, date)
│   └── data/
│       └── usePlanetData.ts          # Load planet data from JSON
├── lib/
│   ├── store/
│   │   ├── explorer-store.ts         # Scale state
│   │   └── simulation-store.ts       # Time, speed, pause state
│   └── utils/
│       ├── astronomy.ts              # Kepler equations, AU conversion
│       ├── constants.ts              # Physical constants
│       └── format.ts                 # Number formatting
├── types/
│   └── celestial/
│       └── planet.ts                 # Planet type definition
├── data/
│   └── solar-system/
│       └── planets.json              # Static planet data
└── config/
    └── scales.ts                     # Scale definitions

public/textures/solar-system/         # Texture files (downloaded)
```

---

## Task 1: Initialize Next.js Project

**Files:**

- Create: `package.json` (already exists, verify)
- Create: `next.config.ts`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `src/app/layout.tsx`
- Create: `src/app/globals.css`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Create `next.config.ts`**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
};

export default nextConfig;
```

- [ ] **Step 2: Create `tailwind.config.ts`**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: "#0a0a0f",
          deep: "#0f0f1a",
          nebula: "#1a1a2e",
          accent: "#4a9eff",
          glow: "#7cb9ff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 3: Create `postcss.config.js`**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 4: Create `src/app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --foreground-rgb: 255, 255, 255
  --background-rgb: 10, 10, 15
}

body {
  color: rgb(var(--foreground-rgb))
  background: rgb(var(--background-rgb))
  font-family: 'Inter', system-ui, sans-serif
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px
}

::-webkit-scrollbar-track {
  background: #0f0f1a
}

::-webkit-scrollbar-thumb {
  background: #4a9eff
  border-radius: 4px
}
```

- [ ] **Step 5: Create `src/app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Interactive Cosmic Explorer',
  description: 'Explore the universe in interactive 3D',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
```

- [ ] **Step 6: Create `src/app/page.tsx`**

```typescript
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/en");
}
```

- [ ] **Step 7: Verify dev server runs**

Run: `npm run dev`
Expected: Server starts at http://localhost:3000, redirects to /en, shows empty page with dark background

- [ ] **Step 8: Commit**

```bash
git add next.config.ts tailwind.config.ts postcss.config.js src/app/
git commit -m "chore: initialize Next.js 14 project with Tailwind CSS"
```

---

## Task 2: Install 3D Dependencies & Configure R3F

**Files:**

- Modify: `package.json` (add dependencies)
- Create: `src/types/celestial/planet.ts`
- Create: `src/config/scales.ts`
- Create: `src/lib/utils/constants.ts`

- [ ] **Step 1: Install 3D packages**

Run: `npm install three @react-three/fiber @react-three/drei @react-three/postprocessing zustand`
Run: `npm install -D @types/three`
Expected: Packages installed without errors

- [ ] **Step 2: Create `src/types/celestial/planet.ts`**

```typescript
export interface PlanetTextures {
  diffuse?: string;
  normal?: string;
  specular?: string;
  emissive?: string;
  clouds?: string;
  ring?: string;
}

export interface PlanetData {
  id: string;
  name: string;
  slug: string;
  radius: number;
  distance: number;
  orbitalPeriod: number;
  rotationSpeed: number;
  tilt: number;
  mass: string;
  temperature: string;
  moons: number;
  description: string;
  funFacts: string[];
  textures: PlanetTextures;
  hasRing?: boolean;
  hasAtmosphere?: boolean;
  atmosphereColor?: string;
}

export interface PlanetPosition {
  x: number;
  y: number;
  z: number;
}
```

- [ ] **Step 3: Create `src/lib/utils/constants.ts`**

```typescript
export const AU_TO_KM = 149597870.7;
export const LY_TO_AU = 63241.077;
export const PC_TO_LY = 3.26156;

export const SUN_RADIUS = 696340;
export const EARTH_RADIUS = 6371;

export const SCALE_FACTORS = {
  solar: 0.0001,
  stellar: 0.000001,
  galactic: 0.000000001,
  cosmic: 0.000000000001,
};

export const ORBIT_SEGMENTS = 128;
export const PLANET_SEGMENTS = 64;
```

- [ ] **Step 4: Create `src/config/scales.ts`**

```typescript
export type ScaleMode = "solar" | "stellar" | "galactic" | "cosmic";

export interface ScaleConfig {
  id: ScaleMode;
  name: string;
  minDistance: number;
  maxDistance: number;
  label: string;
}

export const SCALES: Record<ScaleMode, ScaleConfig> = {
  solar: {
    id: "solar",
    name: "Solar System",
    minDistance: 5,
    maxDistance: 500,
    label: "Solar System",
  },
  stellar: {
    id: "stellar",
    name: "Stellar Neighborhood",
    minDistance: 500,
    maxDistance: 5000,
    label: "Stars",
  },
  galactic: {
    id: "galactic",
    name: "Galaxy",
    minDistance: 5000,
    maxDistance: 50000,
    label: "Galaxy",
  },
  cosmic: {
    id: "cosmic",
    name: "Cosmic",
    minDistance: 50000,
    maxDistance: 1000000,
    label: "Universe",
  },
};

export const ZOOM_THRESHOLDS: Record<string, number> = {
  "solar-stellar": 500,
  "stellar-galactic": 5000,
  "galactic-cosmic": 50000,
};
```

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json src/types/ src/lib/utils/constants.ts src/config/
git commit -m "chore: install R3F, Drei, Three.js and add type definitions"
```

---

## Task 3: Create Zustand Stores

**Files:**

- Create: `src/lib/store/explorer-store.ts`
- Create: `src/lib/store/simulation-store.ts`

- [ ] **Step 1: Create `src/lib/store/explorer-store.ts`**

```typescript
import { create } from "zustand";
import { ScaleMode } from "@/config/scales";

interface ExplorerState {
  scale: ScaleMode;
  isTransitioning: boolean;
  selectedPlanet: string | null;
  hoveredPlanet: string | null;
  setScale: (scale: ScaleMode) => void;
  setIsTransitioning: (isTransitioning: boolean) => void;
  selectPlanet: (planet: string | null) => void;
  hoverPlanet: (planet: string | null) => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  scale: "solar",
  isTransitioning: false,
  selectedPlanet: null,
  hoveredPlanet: null,
  setScale: (scale) => set({ scale }),
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),
  selectPlanet: (planet) => set({ selectedPlanet: planet }),
  hoverPlanet: (planet) => set({ hoveredPlanet: planet }),
}));
```

- [ ] **Step 2: Create `src/lib/store/simulation-store.ts`**

```typescript
import { create } from "zustand";

interface SimulationState {
  isPlaying: boolean;
  speed: number;
  dayOffset: number;
  togglePlay: () => void;
  setSpeed: (speed: number) => void;
  setDayOffset: (dayOffset: number) => void;
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: true,
  speed: 1,
  dayOffset: 0,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSpeed: (speed) => set({ speed }),
  setDayOffset: (dayOffset) => set({ dayOffset }),
  reset: () => set({ isPlaying: true, speed: 1, dayOffset: 0 }),
}));
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/store/
git commit -m "feat: add Zustand stores for explorer and simulation state"
```

---

## Task 4: Create Astronomy Utilities

**Files:**

- Create: `src/lib/utils/astronomy.ts`
- Create: `src/lib/utils/format.ts`
- Create: `src/hooks/3d/usePlanetPosition.ts`
- Create: `src/hooks/3d/useSimulationTime.ts`

- [ ] **Step 1: Create `src/lib/utils/astronomy.ts`**

```typescript
import { PlanetData, PlanetPosition } from "@/types/celestial/planet";

export function calculateOrbitalPosition(
  distance: number,
  orbitalPeriod: number,
  dayOffset: number,
  tilt: number = 0,
): PlanetPosition {
  const angle = ((dayOffset / orbitalPeriod) * 2 * Math.PI) % (2 * Math.PI);
  const x = distance * Math.cos(angle);
  const z = distance * Math.sin(angle);
  const y = 0;

  return { x, y, z };
}

export function auToSceneUnits(au: number): number {
  return au * 10;
}

export function formatDistance(au: number): string {
  if (au < 0.01) {
    return `${(au * 149597870.7).toFixed(0)} km`;
  }
  if (au < 1) {
    return `${((au * 149597870.7) / 1000000).toFixed(1)} million km`;
  }
  return `${au.toFixed(2)} AU`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}
```

- [ ] **Step 2: Create `src/lib/utils/format.ts`**

```typescript
export function formatDistance(lightYears: number): string {
  if (lightYears < 0.01) {
    return `${(lightYears * 63241.077).toFixed(0)} AU`;
  }
  if (lightYears < 1) {
    return `${(lightYears * 1000).toFixed(1)} thousand ly`;
  }
  if (lightYears < 1000) {
    return `${lightYears.toFixed(2)} ly`;
  }
  return `${(lightYears / 1000).toFixed(1)} thousand ly`;
}

export function formatMass(earthMasses: number): string {
  if (earthMasses < 0.01) {
    return `${(earthMasses * 7.346e22).toExponential(2)} kg`;
  }
  if (earthMasses < 100) {
    return `${earthMasses.toFixed(2)} Earth masses`;
  }
  return `${(earthMasses / 317.83).toFixed(2)} Jupiter masses`;
}

export function formatTemperature(celsius: number): string {
  const fahrenheit = (celsius * 9) / 5 + 32;
  return `${celsius.toFixed(0)}°C / ${fahrenheit.toFixed(0)}°F`;
}
```

- [ ] **Step 3: Create `src/hooks/3d/usePlanetPosition.ts`**

```typescript
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PlanetData } from "@/types/celestial/planet";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { calculateOrbitalPosition } from "@/lib/utils/astronomy";
import * as THREE from "three";

export function usePlanetPosition(planet: PlanetData) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { isPlaying, speed, dayOffset } = useSimulationStore();

  useFrame((state, delta) => {
    if (!meshRef.current || !isPlaying) return;

    const currentDay = dayOffset + state.clock.getElapsedTime() * speed;
    const position = calculateOrbitalPosition(
      planet.distance,
      planet.orbitalPeriod,
      currentDay,
      planet.tilt,
    );

    meshRef.current.position.set(position.x, position.y, position.z);
  });

  return meshRef;
}
```

- [ ] **Step 4: Create `src/hooks/3d/useSimulationTime.ts`**

```typescript
import { useSimulationStore } from "@/lib/store/simulation-store";

export function useSimulationTime() {
  const {
    isPlaying,
    speed,
    dayOffset,
    togglePlay,
    setSpeed,
    setDayOffset,
    reset,
  } = useSimulationStore();

  const formatDay = (day: number): string => {
    const date = new Date(2024, 0, 1);
    date.setDate(date.getDate() + Math.floor(day));
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    isPlaying,
    speed,
    dayOffset,
    togglePlay,
    setSpeed,
    setDayOffset,
    reset,
    currentDate: formatDay(dayOffset),
  };
}
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/astronomy.ts src/lib/utils/format.ts src/hooks/3d/
git commit -m "feat: add astronomy utilities and simulation hooks"
```

---

## Task 5: Create Planet Data

**Files:**

- Create: `src/data/solar-system/planets.json`
- Create: `src/hooks/data/usePlanetData.ts`

- [ ] **Step 1: Create `src/data/solar-system/planets.json`**

```json
{
  "planets": [
    {
      "id": "mercury",
      "name": "Mercury",
      "slug": "mercury",
      "radius": 0.383,
      "distance": 0.39,
      "orbitalPeriod": 87.97,
      "rotationSpeed": 0.003,
      "tilt": 0.034,
      "mass": "3.30 × 10²³ kg",
      "temperature": "167°C",
      "moons": 0,
      "description": "The smallest planet and closest to the Sun. Mercury has no atmosphere and experiences extreme temperature variations.",
      "funFacts": [
        "A day on Mercury lasts 59 Earth days",
        "Mercury has the most eccentric orbit of any planet",
        "Despite being closest to the Sun, it's not the hottest planet"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/mercury/diffuse.webp",
        "normal": "/textures/solar-system/mercury/normal.webp"
      }
    },
    {
      "id": "venus",
      "name": "Venus",
      "slug": "venus",
      "radius": 0.949,
      "distance": 0.72,
      "orbitalPeriod": 224.7,
      "rotationSpeed": -0.002,
      "tilt": 177.4,
      "mass": "4.87 × 10²⁴ kg",
      "temperature": "464°C",
      "moons": 0,
      "description": "The hottest planet in our solar system. Venus has a thick, toxic atmosphere filled with carbon dioxide and clouds of sulfuric acid.",
      "funFacts": [
        "Venus rotates backwards compared to most planets",
        "A day on Venus is longer than a year",
        "Venus is the same size as Earth but has 90% less gravity"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/venus/diffuse.webp",
        "normal": "/textures/solar-system/venus/normal.webp"
      }
    },
    {
      "id": "earth",
      "name": "Earth",
      "slug": "earth",
      "radius": 1.0,
      "distance": 1.0,
      "orbitalPeriod": 365.25,
      "rotationSpeed": 0.01,
      "tilt": 23.44,
      "mass": "5.97 × 10²⁴ kg",
      "temperature": "15°C",
      "moons": 1,
      "description": "Our home planet. Earth is the only known planet to support life, with 71% of its surface covered by water.",
      "funFacts": [
        "Earth's core is as hot as the Sun's surface",
        "Earth rotates at 1,670 km/h at the equator",
        "Earth is 4.54 billion years old"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/earth/diffuse.webp",
        "normal": "/textures/solar-system/earth/normal.webp",
        "specular": "/textures/solar-system/earth/specular.webp",
        "emissive": "/textures/solar-system/earth/emissive.webp",
        "clouds": "/textures/solar-system/earth/clouds.webp"
      },
      "hasAtmosphere": true,
      "atmosphereColor": "#4a9eff"
    },
    {
      "id": "mars",
      "name": "Mars",
      "slug": "mars",
      "radius": 0.532,
      "distance": 1.52,
      "orbitalPeriod": 686.97,
      "rotationSpeed": 0.009,
      "tilt": 25.19,
      "mass": "6.42 × 10²³ kg",
      "temperature": "-65°C",
      "moons": 2,
      "description": "The Red Planet. Mars has the tallest volcano (Olympus Mons) and deepest canyon (Valles Marineris) in the solar system.",
      "funFacts": [
        "Mars has seasons like Earth due to its axial tilt",
        "Olympus Mons is 3 times taller than Mount Everest",
        "Mars has been visited by more robots than humans"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/mars/diffuse.webp",
        "normal": "/textures/solar-system/mars/normal.webp"
      }
    },
    {
      "id": "jupiter",
      "name": "Jupiter",
      "slug": "jupiter",
      "radius": 11.21,
      "distance": 5.2,
      "orbitalPeriod": 4332.59,
      "rotationSpeed": 0.024,
      "tilt": 3.13,
      "mass": "1.90 × 10²⁷ kg",
      "temperature": "-110°C",
      "moons": 95,
      "description": "The largest planet in our solar system. Jupiter is a gas giant with a mass more than twice that of all other planets combined.",
      "funFacts": [
        "Jupiter's Great Red Spot is a storm that has lasted 350+ years",
        "Jupiter has the shortest day of any planet at 10 hours",
        "Jupiter's magnetic field is 20,000 times stronger than Earth's"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/jupiter/diffuse.webp",
        "normal": "/textures/solar-system/jupiter/normal.webp"
      }
    },
    {
      "id": "saturn",
      "name": "Saturn",
      "slug": "saturn",
      "radius": 9.45,
      "distance": 9.58,
      "orbitalPeriod": 10759.22,
      "rotationSpeed": 0.022,
      "tilt": 26.73,
      "mass": "5.68 × 10²⁶ kg",
      "temperature": "-140°C",
      "moons": 146,
      "description": "Famous for its beautiful ring system. Saturn is a gas giant less dense than water.",
      "funFacts": [
        "Saturn's rings are made of ice and rock",
        "Saturn could float in a bathtub big enough to hold it",
        "Saturn's moon Titan has lakes of liquid methane"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/saturn/diffuse.webp",
        "normal": "/textures/solar-system/saturn/normal.webp",
        "ring": "/textures/solar-system/saturn/rings.webp"
      },
      "hasRing": true
    },
    {
      "id": "uranus",
      "name": "Uranus",
      "slug": "uranus",
      "radius": 4.01,
      "distance": 19.22,
      "orbitalPeriod": 30688.5,
      "rotationSpeed": -0.014,
      "tilt": 97.77,
      "mass": "8.68 × 10²⁵ kg",
      "temperature": "-195°C",
      "moons": 27,
      "description": "An ice giant that rotates on its side. Uranus has the coldest atmosphere of any planet.",
      "funFacts": [
        "Uranus rotates on its side at 98 degrees",
        "Uranus was the first planet discovered with a telescope",
        "Uranus has faint rings like Saturn"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/uranus/diffuse.webp",
        "normal": "/textures/solar-system/uranus/normal.webp"
      }
    },
    {
      "id": "neptune",
      "name": "Neptune",
      "slug": "neptune",
      "radius": 3.88,
      "distance": 30.05,
      "orbitalPeriod": 60195.0,
      "rotationSpeed": 0.015,
      "tilt": 28.32,
      "mass": "1.02 × 10²⁶ kg",
      "temperature": "-200°C",
      "moons": 16,
      "description": "The windiest planet in our solar system. Neptune has supersonic winds reaching 2,100 km/h.",
      "funFacts": [
        "Neptune's winds are the fastest in the solar system",
        "Neptune takes 165 years to orbit the Sun",
        "Neptune's moon Triton orbits backwards"
      ],
      "textures": {
        "diffuse": "/textures/solar-system/neptune/diffuse.webp",
        "normal": "/textures/solar-system/neptune/normal.webp"
      }
    }
  ],
  "sun": {
    "id": "sun",
    "name": "Sun",
    "radius": 696340,
    "temperature": "5,500°C",
    "mass": "1.99 × 10³⁰ kg",
    "description": "The star at the center of our solar system. The Sun contains 99.86% of all mass in the solar system.",
    "funFacts": [
      "Light from the Sun takes 8 minutes to reach Earth",
      "The Sun converts 600 million tons of hydrogen to helium every second",
      "The Sun is 4.6 billion years old"
    ]
  }
}
```

- [ ] **Step 2: Create `src/hooks/data/usePlanetData.ts`**

```typescript
import { useMemo } from "react";
import planetData from "@/data/solar-system/planets.json";
import { PlanetData } from "@/types/celestial/planet";

export function usePlanetData() {
  const planets = useMemo(() => {
    return planetData.planets.map((p) => ({
      ...p,
      textures: p.textures || {},
    })) as PlanetData[];
  }, []);

  const sun = useMemo(() => {
    return planetData.sun;
  }, []);

  const getPlanetBySlug = (slug: string): PlanetData | undefined => {
    return planets.find((p) => p.slug === slug);
  };

  return {
    planets,
    sun,
    getPlanetBySlug,
  };
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/solar-system/planets.json src/hooks/data/usePlanetData.ts
git commit -m "feat: add planet data and data hook"
```

---

## Task 6: Create R3F Canvas & Scene

**Files:**

- Create: `src/components/cosmic-explorer/CosmicExplorer.tsx`
- Create: `src/components/cosmic-explorer/Scene.tsx`
- Create: `src/components/cosmic-explorer/Camera.tsx`
- Create: `src/components/cosmic-explorer/Lighting.tsx`
- Modify: `src/app/[locale]/page.tsx`

- [ ] **Step 1: Create `src/components/cosmic-explorer/Camera.tsx`**

```typescript
'use client'

import { useRef } from 'react'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'

export function Camera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null)

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 50, 100]}
      fov={60}
      near={0.1}
      far={100000}
    />
  )
}
```

- [ ] **Step 2: Create `src/components/cosmic-explorer/Lighting.tsx`**

```typescript
'use client'

import { useThree } from '@react-three/fiber'

export function Lighting() {
  const { scene } = useThree()

  return (
    <>
      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={1000}
        decay={2}
        color="#fff5e6"
      />
      <ambientLight intensity={0.02} color="#ffffff" />
    </>
  )
}
```

- [ ] **Step 3: Create `src/components/cosmic-explorer/Scene.tsx`**

```typescript
'use client'

import { Suspense } from 'react'
import { Stars, OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { Camera } from './Camera'
import { Lighting } from './Lighting'
import { SolarSystemScene } from '@/components/solar-system/SolarSystemScene'
import { SpeedControl } from './controls/SpeedControl'

export function Scene() {
  return (
    <>
      <Camera />
      <Lighting />

      <Stars
        radius={5000}
        depth={100}
        count={10000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />

      <Suspense fallback={null}>
        <SolarSystemScene />
      </Suspense>

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={500}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <EffectComposer>
        <Bloom
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          intensity={0.5}
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>

      <SpeedControl />
    </>
  )
}
```

- [ ] **Step 4: Create `src/components/cosmic-explorer/CosmicExplorer.tsx`**

```typescript
'use client'

import { Canvas } from '@react-three/fiber'
import { Scene } from './Scene'

export function CosmicExplorer() {
  return (
    <div className="w-full h-screen bg-cosmic-black">
      <Canvas
        camera={{
          position: [0, 50, 100],
          fov: 60,
          near: 0.1,
          far: 100000,
        }}
        gl={{
          antialias: true,
          toneMapping: 3,
          toneMappingExposure: 1,
        }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
```

- [ ] **Step 5: Update `src/app/[locale]/page.tsx`**

```typescript
'use client'

import { CosmicExplorer } from '@/components/cosmic-explorer/CosmicExplorer'

export default function Home() {
  return <CosmicExplorer />
}
```

- [ ] **Step 6: Verify Canvas renders**

Run: `npm run dev`
Expected: Black screen with stars (empty 3D scene)

- [ ] **Step 7: Commit**

```bash
git add src/components/cosmic-explorer/ src/app/\[locale\]/page.tsx
git commit -m "feat: add R3F Canvas, scene, camera, and lighting"
```

---

## Task 7: Create Sun Component

**Files:**

- Create: `src/components/solar-system/sun/Sun.tsx`
- Create: `src/components/solar-system/SolarSystemScene.tsx`

- [ ] **Step 1: Create `src/components/solar-system/sun/Sun.tsx`**

```typescript
'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.02
      glowRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={2}
        />
      </mesh>

      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={1000}
        decay={2}
        color="#fff5e6"
      />
    </group>
  )
}
```

- [ ] **Step 2: Create `src/components/solar-system/SolarSystemScene.tsx`**

```typescript
'use client'

import { Sun } from './sun/Sun'

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
    </group>
  )
}
```

- [ ] **Step 3: Verify Sun renders**

Run: `npm run dev`
Expected: Glowing yellow sphere at center with bloom effect

- [ ] **Step 4: Commit**

```bash
git add src/components/solar-system/
git commit -m "feat: add Sun component with emissive glow"
```

---

## Task 8: Create Planet Component

**Files:**

- Create: `src/components/solar-system/planets/Planet.tsx`
- Create: `src/components/solar-system/planets/PlanetConfig.tsx`
- Modify: `src/components/solar-system/SolarSystemScene.tsx`

- [ ] **Step 1: Create `src/components/solar-system/planets/Planet.tsx`**

```typescript
'use client'

import { useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { PlanetData } from '@/types/celestial/planet'
import { useExplorerStore } from '@/lib/store/explorer-store'
import { calculateOrbitalPosition } from '@/lib/utils/astronomy'
import { useSimulationStore } from '@/lib/store/simulation-store'

interface PlanetProps {
  planet: PlanetData
}

export function Planet({ planet }: PlanetProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  const { selectPlanet, selectedPlanet } = useExplorerStore()
  const { isPlaying, speed } = useSimulationStore()
  const { camera } = useThree()

  const textures = useTexture({
    map: planet.textures.diffuse || '/textures/placeholder.webp',
    normalMap: planet.textures.normal || undefined,
    specularMap: planet.textures.specular || undefined,
    emissiveMap: planet.textures.emissive || undefined,
  })

  const isSelected = selectedPlanet === planet.id

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return

    if (isPlaying) {
      const dayOffset = state.clock.getElapsedTime() * speed
      const position = calculateOrbitalPosition(
        planet.distance * 10,
        planet.orbitalPeriod,
        dayOffset,
        planet.tilt
      )
      groupRef.current.position.set(position.x, position.y, position.z)
    }

    meshRef.current.rotation.y += planet.rotationSpeed * 0.01

    const scale = hovered ? 1.1 : isSelected ? 1.05 : 1
    meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1)
  })

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={() => selectPlanet(isSelected ? null : planet.id)}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        rotation={[
          THREE.MathUtils.degToRad(planet.tilt),
          0,
          0,
        ]}
      >
        <sphereGeometry args={[planet.radius * 2, 64, 64]} />
        <meshStandardMaterial
          map={textures.map}
          normalMap={textures.normalMap}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {planet.textures.clouds && (
        <mesh scale={1.02}>
          <sphereGeometry args={[planet.radius * 2, 32, 32]} />
          <meshStandardMaterial
            map={useTexture(planet.textures.clouds)}
            transparent
            opacity={0.4}
          />
        </mesh>
      )}

      {planet.hasAtmosphere && (
        <mesh scale={1.1}>
          <sphereGeometry args={[planet.radius * 2, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor || '#4a9eff'}
            transparent
            opacity={0.15}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {(hovered || isSelected) && (
        <sprite position={[0, planet.radius * 2.5, 0]} scale={[10, 2, 1]}>
          <spriteMaterial
            color="#ffffff"
            transparent
            opacity={0.9}
          />
        </sprite>
      )}
    </group>
  )
}
```

- [ ] **Step 2: Create `src/components/solar-system/planets/PlanetConfig.tsx`**

```typescript
'use client'

import { Planet } from './Planet'
import { usePlanetData } from '@/hooks/data/usePlanetData'

export function PlanetConfig() {
  const { planets } = usePlanetData()

  return (
    <group>
      {planets.map((planet) => (
        <Planet key={planet.id} planet={planet} />
      ))}
    </group>
  )
}
```

- [ ] **Step 3: Update `src/components/solar-system/SolarSystemScene.tsx`**

```typescript
'use client'

import { Sun } from './sun/Sun'
import { PlanetConfig } from './planets/PlanetConfig'

export function SolarSystemScene() {
  return (
    <group>
      <Sun />
      <PlanetConfig />
    </group>
  )
}
```

- [ ] **Step 4: Verify planets render and orbit**

Run: `npm run dev`
Expected: Sun at center, 8 planets orbiting with textures (some may show placeholder if textures not downloaded)

- [ ] **Step 5: Commit**

```bash
git add src/components/solar-system/planets/ src/components/solar-system/SolarSystemScene.tsx
git commit -m "feat: add Planet component with orbit animation and textures"
```

---

## Task 9: Add Orbit Visualization

**Files:**

- Create: `src/components/cosmic-explorer/shared/OrbitPath.tsx`
- Modify: `src/components/solar-system/SolarSystemScene.tsx`

- [ ] **Step 1: Create `src/components/cosmic-explorer/shared/OrbitPath.tsx`**

```typescript
'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'

interface OrbitPathProps {
  distance: number
  segments?: number
  color?: string
}

export function OrbitPath({
  distance,
  segments = 128,
  color = '#333333',
}: OrbitPathProps) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = []
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const x = Math.cos(angle) * distance * 10
      const z = Math.sin(angle) * distance * 10
      pts.push(new THREE.Vector3(x, 0, z))
    }
    return pts
  }, [distance, segments])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  )
}
```

- [ ] **Step 2: Update `src/components/solar-system/SolarSystemScene.tsx`**

```typescript
'use client'

import { Sun } from './sun/Sun'
import { PlanetConfig } from './planets/PlanetConfig'
import { OrbitPath } from '@/components/cosmic-explorer/shared/OrbitPath'
import { usePlanetData } from '@/hooks/data/usePlanetData'

export function SolarSystemScene() {
  const { planets } = usePlanetData()

  return (
    <group>
      <Sun />
      <PlanetConfig />

      {planets.map((planet) => (
        <OrbitPath
          key={`orbit-${planet.id}`}
          distance={planet.distance}
          color="#334455"
        />
      ))}
    </group>
  )
}
```

- [ ] **Step 3: Verify orbit lines render**

Run: `npm run dev`
Expected: Dotted circle lines showing planet orbital paths

- [ ] **Step 4: Commit**

```bash
git add src/components/cosmic-explorer/shared/OrbitPath.tsx src/components/solar-system/SolarSystemScene.tsx
git commit -m "feat: add orbit path visualization"
```

---

## Task 10: Add Simulation Controls

**Files:**

- Create: `src/components/cosmic-explorer/controls/SpeedControl.tsx`
- Modify: `src/app/globals.css` (add Tailwind classes)

- [ ] **Step 1: Create `src/components/cosmic-explorer/controls/SpeedControl.tsx`**

```typescript
'use client'

import { useSimulationStore } from '@/lib/store/simulation-store'

export function SpeedControl() {
  const { isPlaying, speed, togglePlay, setSpeed } = useSimulationStore()

  const speedOptions = [0.1, 0.5, 1, 2, 5, 10, 50, 100, 500, 1000]

  return (
    <div className="fixed bottom-4 left-4 bg-cosmic-nebula/80 backdrop-blur-sm rounded-lg p-4 text-white z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-cosmic-accent hover:bg-cosmic-glow transition-colors flex items-center justify-center"
        >
          {isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-cosmic-deep border border-cosmic-accent rounded px-2 py-1 text-sm"
          >
            {speedOptions.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify controls render**

Run: `npm run dev`
Expected: Bottom-left control panel with play/pause button and speed dropdown

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic-explorer/controls/SpeedControl.tsx
git commit -m "feat: add simulation speed controls"
```

---

## Task 11: Create Label Component

**Files:**

- Create: `src/components/cosmic-explorer/shared/Label.tsx`

- [ ] **Step 1: Create `src/components/cosmic-explorer/shared/Label.tsx`**

```typescript
'use client'

import { Billboard, Text } from '@react-three/drei'

interface LabelProps {
  text: string
  position: [number, number, number]
  visible?: boolean
  color?: string
  fontSize?: number
}

export function Label({
  text,
  position,
  visible = true,
  color = '#ffffff',
  fontSize = 1,
}: LabelProps) {
  if (!visible) return null

  return (
    <Billboard position={position}>
      <Text
        fontSize={fontSize}
        color={color}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </Billboard>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/cosmic-explorer/shared/Label.tsx
git commit -m "feat: add Label component for planet names"
```

---

## Task 12: Final Integration & Testing

**Files:**

- Modify: Various (final tweaks)

- [ ] **Step 1: Verify full solar system renders**

Run: `npm run dev`
Expected:

- Glowing Sun at center
- 8 planets orbiting with textures
- Orbit path lines visible
- Speed controls functional
- Star background
- Bloom post-processing on Sun

- [ ] **Step 2: Test interactions**

- Click on a planet → planet should highlight
- Use scroll to zoom in/out
- Drag to rotate camera
- Change speed in dropdown → planets orbit faster/slower
- Pause button stops animation

- [ ] **Step 3: Run type check**

Run: `npm run type-check`
Expected: No TypeScript errors

- [ ] **Step 4: Run linter**

Run: `npm run lint`
Expected: No ESLint errors (warnings okay)

- [ ] **Step 5: Build production**

Run: `npm run build`
Expected: Build completes without errors

- [ ] **Step 6: Final commit**

```bash
git add .
git commit -m "feat: complete Phase 1 - Solar System 3D foundation"
```

---

## Verification Checklist

After completing all tasks, verify:

- [ ] Solar system renders with Sun + 8 planets
- [ ] Planets orbit correctly with realistic speeds
- [ ] Textures load and display (requires downloaded textures)
- [ ] Orbit paths are visible
- [ ] Speed controls work (pause, speed up, slow down)
- [ ] Camera can zoom, rotate, and pan
- [ ] Bloom effect visible on Sun
- [ ] TypeScript compiles without errors
- [ ] ESLint passes
- [ ] Production build succeeds

---

## Troubleshooting

| Problem              | Solution                                         |
| -------------------- | ------------------------------------------------ |
| Textures not showing | Download textures from Solar System Scope        |
| Bloom too strong     | Reduce `intensity` in Bloom effect               |
| Planets too small    | Increase `radius` multiplier in Planet component |
| Camera too far       | Adjust `position` in Camera component            |
| Slow performance     | Reduce planet segment count, disable shadows     |

---

## Next Phase

Phase 2: Interactivity & Detail Pages

- Click planet → info panel slides in
- Camera flies to selected planet
- Planet detail pages
- Search functionality
