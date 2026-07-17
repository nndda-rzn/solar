# Multi-Scale System Guide

> Technical guide for implementing and understanding the multi-scale navigation system.

---

## Overview

The **Multi-Scale System** is the core innovation of this project. It allows seamless navigation from the Solar System (50 AU) to the entire observable universe (46 billion light-years) by using 4 distinct scale levels with smooth transitions.

---

## Scale Definitions

### Scale 0: Solar System

| Property             | Value                                                         |
| -------------------- | ------------------------------------------------------------- |
| **Camera Distance**  | 0.1 - 100 AU                                                  |
| **Rendered Objects** | Sun, 8 planets, dwarf planets, asteroids, comets, Kuiper Belt |
| **LOD Level**        | High (8K textures)                                            |
| **Lighting**         | Single PointLight at Sun (realistic inverse-square)           |
| **Interactions**     | Click planet → info, orbit controls, speed slider             |

**Coordinate System:** AU (Astronomical Units)

- 1 AU = Earth's distance from Sun = ~150 million km

**Rendering Strategy:**

- Full PBR materials with diffuse, normal, specular, emissive maps
- Layered rendering: surface + atmosphere + clouds (Earth)
- Ring geometry for Saturn, Uranus
- Particle systems for asteroid belt, Kuiper Belt

### Scale 1: Stellar Neighborhood

| Property             | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| **Camera Distance**  | 1 - 100 light-years (ly)                               |
| **Rendered Objects** | ~100 nearby stars, 30+ constellations                  |
| **LOD Level**        | Medium                                                 |
| **Lighting**         | Each star emits light                                  |
| **Interactions**     | Click star → info, constellation toggle, sky view mode |

**Coordinate System:** Light-years + Right Ascension/Declination

- 1 ly = ~63,241 AU = distance light travels in 1 year

**Rendering Strategy:**

- Point particles for distant stars
- Billboard sprites for bright stars (Sirius, Betelgeuse)
- Line geometries for constellation patterns
- Sky projection mode (Earth perspective)

### Scale 2: Galactic

| Property             | Value                                                             |
| -------------------- | ----------------------------------------------------------------- |
| **Camera Distance**  | 100 ly - 100,000 ly                                               |
| **Rendered Objects** | Milky Way galaxy, nebulae, star clusters, exoplanets, black holes |
| **LOD Level**        | Medium-Low                                                        |
| **Lighting**         | Ambient + selective point lights                                  |
| **Interactions**     | Click nebula/cluster → info, galaxy rotation                      |

**Coordinate System:** Light-years, galactic coordinates

**Rendering Strategy:**

- Spiral galaxy shader (parametric arms + particle stars)
- Volume rendering for nebulae
- Instanced meshes for star clusters
- Gravitational lensing shader for black holes

### Scale 3: Cosmic

| Property             | Value                                                |
| -------------------- | ---------------------------------------------------- |
| **Camera Distance**  | 1 million - 46 billion ly                            |
| **Rendered Objects** | Galaxy groups, clusters, superclusters, cosmic web   |
| **LOD Level**        | Low (points/particles)                               |
| **Lighting**         | Ambient only                                         |
| **Interactions**     | Navigate structure, dark matter/energy visualization |

**Coordinate System:** Megaparsecs (Mpc)

- 1 Mpc = ~3.26 million ly

**Rendering Strategy:**

- Galaxies as point particles or billboard sprites
- Filaments (cosmic web) as line segments
- Force-directed layout for structure
- Dark matter visualization overlay

---

## Scale Transitions

### State Machine

```typescript
type Scale = "solar" | "stellar" | "galactic" | "cosmic";

interface ScaleState {
  current: Scale;
  previous: Scale | null;
  isTransitioning: boolean;
  progress: number; // 0-1
}
```

### Transition Triggers

**Automatic (zoom-based):**

```typescript
const ZOOM_THRESHOLDS = {
  "solar-to-stellar": 100, // AU
  "stellar-to-galactic": 100, // ly
  "galactic-to-cosmic": 100000, // ly
};

// In useFrame:
if (cameraDistance > ZOOM_THRESHOLDS["solar-to-stellar"]) {
  triggerScaleTransition("stellar");
}
```

**Manual:**

```typescript
// UI button click
<button onClick={() => setScale('stellar')}>
  Go to Stellar View
</button>
```

### Transition Sequence

```
1. TRIGGER
   ↓
2. START_TRANSITION
   - Set isTransitioning = true
   - Store current scale as previous
   - Show LoadingZone
   ↓
3. CLEANUP
   - Dispose unused geometries
   - Dispose unused textures
   - Remove event listeners
   ↓
4. PREPARE_NEW_SCALE
   - Load new scene data
   - Create new meshes
   - Set up lighting
   ↓
5. ANIMATE_CAMERA
   - Interpolate camera position
   - Interpolate camera target
   - Update FOV if needed
   ↓
6. COMPLETE
   - Set current scale to new value
   - Hide LoadingZone
   - Set isTransitioning = false
   - Enable interactions
```

### Camera Animation

```typescript
import { useSpring } from '@react-spring/three'

const { position } = useSpring({
  from: { position: currentCameraPosition },
  to: { position: targetCameraPosition },
  config: { duration: 2000, easing: easeInOutCubic },
  onRest: () => setIsTransitioning(false),
})

return <PerspectiveCamera position={position} />
```

---

## LOD (Level of Detail) System

### Texture LOD

| Scale    | Texture Resolution    |
| -------- | --------------------- |
| Solar    | 8K (8192x4096)        |
| Stellar  | 2K (2048x1024)        |
| Galactic | 1K (1024x512) or none |
| Cosmic   | None (pure particles) |

**Implementation:**

```typescript
const getTextureLOD = (scale: Scale, objectType: string) => {
  if (scale === "solar" && objectType === "planet") {
    return "/textures/solar-system/earth/diffuse-8k.webp";
  } else if (scale === "stellar" && objectType === "star") {
    return "/textures/stars/star-sprite-2k.webp";
  }
  return null; // No texture
};
```

### Geometry LOD

```typescript
const getPlanetGeometry = (scale: Scale) => {
  switch (scale) {
    case "solar":
      return new SphereGeometry(1, 64, 64); // High detail
    case "stellar":
      return new SphereGeometry(1, 32, 32); // Medium detail
    default:
      return new SphereGeometry(1, 8, 8); // Low detail
  }
};
```

---

## Coordinate Transformations

### Unit Conversions

```typescript
const AU_TO_KM = 149597870.7;
const LY_TO_AU = 63241.077;
const PC_TO_LY = 3.26156;
const MPC_TO_LY = 3261560;

export const toAU = (km: number) => km / AU_TO_KM;
export const toLY = (au: number) => au / LY_TO_AU;
export const toMpc = (ly: number) => ly / MPC_TO_LY;
```

### Position Scaling

Each scale uses different coordinate magnitudes:

```typescript
interface Position {
  x: number;
  y: number;
  z: number;
}

const scalePosition = (
  pos: Position,
  fromScale: Scale,
  toScale: Scale,
): Position => {
  const scaleFactor = getScaleFactor(fromScale, toScale);
  return {
    x: pos.x * scaleFactor,
    y: pos.y * scaleFactor,
    z: pos.z * scaleFactor,
  };
};

const getScaleFactor = (from: Scale, to: Scale): number => {
  const factors = {
    "solar-stellar": 1 / LY_TO_AU,
    "stellar-galactic": 1,
    "galactic-cosmic": 1 / 1000,
  };
  return factors[`${from}-${to}`] || 1;
};
```

---

## Performance Optimization

### Frustum Culling

Automatically handled by Three.js, but can be customized:

```typescript
mesh.frustumCulled = true; // Default
mesh.onBeforeRender = (renderer, scene, camera) => {
  // Custom culling logic if needed
};
```

### Render on Demand

For static scenes (no animation), render only when needed:

```typescript
const { invalidate, advance } = useThree();

// Trigger render only on interaction
const handleClick = () => {
  // ... handle click
  invalidate(); // Request single frame render
};
```

### Texture Disposal

Critical to avoid memory leaks during scale transitions:

```typescript
const disposeTextures = (scene: THREE.Scene) => {
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      if (object.material.map) object.material.map.dispose();
      if (object.material.normalMap) object.material.normalMap.dispose();
      if (object.material.specularMap) object.material.specularMap.dispose();
      object.geometry.dispose();
      object.material.dispose();
    }
  });
};

// Call before transitioning to new scale
useEffect(() => {
  return () => disposeTextures(scene);
}, [scale]);
```

---

## Scale-Specific Features

### Solar System Features

- Orbital mechanics (Kepler equations)
- Speed control (1x - 1000x)
- Date picker (compute positions for specific date)
- Habitable zone visualization
- Asteroid/comet tracking

### Stellar Features

- Constellation lines toggle
- Sky view mode (from Earth perspective)
- Star classification by color (O, B, A, F, G, K, M)
- Distance measurements
- Star search by catalog ID (Hipparcos)

### Galactic Features

- Galaxy rotation animation
- Nebula detail views
- Exoplanet comparison tool
- Black hole lensing effect
- Star cluster fly-through

### Cosmic Features

- Cosmic web filament visualization
- Dark matter distribution
- Universe expansion animation
- Supercluster hierarchy (Local Group → Virgo → Laniakea)
- Redshift indicators

---

## Implementation Example

```typescript
// src/components/cosmic-explorer/scale-manager/ScaleController.tsx

import { useEffect } from 'react'
import { useExplorerStore } from '@/lib/store/explorer-store'
import { SolarSystemScene } from '@/components/solar-system'
import { StellarScene } from '@/components/stellar'
import { GalacticScene } from '@/components/galactic'
import { CosmicScene } from '@/components/cosmic'
import { ScaleTransition } from './ScaleTransition'
import { LoadingZone } from './LoadingZone'

export function ScaleController() {
  const { scale, isTransitioning } = useExplorerStore()

  useEffect(() => {
    // Cleanup on scale change
    return () => {
      // Dispose resources from previous scale
    }
  }, [scale])

  return (
    <>
      {isTransitioning && <LoadingZone />}

      {!isTransitioning && (
        <>
          {scale === 'solar' && <SolarSystemScene />}
          {scale === 'stellar' && <StellarScene />}
          {scale === 'galactic' && <GalacticScene />}
          {scale === 'cosmic' && <CosmicScene />}
        </>
      )}

      <ScaleTransition />
    </>
  )
}
```

---

## Testing Scale Transitions

```typescript
// src/hooks/useScaleTransition.test.ts

describe("useScaleTransition", () => {
  it("should transition from solar to stellar", async () => {
    const { result } = renderHook(() => useScaleTransition());

    act(() => {
      result.current.transitionTo("stellar");
    });

    expect(result.current.isTransitioning).toBe(true);

    await waitFor(() => {
      expect(result.current.isTransitioning).toBe(false);
      expect(result.current.scale).toBe("stellar");
    });
  });
});
```

---

## Related Documentation

- [ARCHITECTURE.md](../ARCHITECTURE.md) — System design
- [3D_RENDERING.md](3D_RENDERING.md) — R3F patterns
- [DATA_MODELS.md](DATA_MODELS.md) — Type definitions
