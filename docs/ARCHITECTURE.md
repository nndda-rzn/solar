# Architecture

> System design and architectural decisions for Interactive Cosmic Explorer.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                            │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                │
│  │  Next.js    │  │  R3F 3D     │  │  UI Layer   │                │
│  │  App Router │←→│  Canvas     │←→│  (React)    │                │
│  └─────────────┘  └─────────────┘  └─────────────┘                │
│         ↓                  ↓                ↓                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ZUSTAND STATE                             │   │
│  │  (explorer-store, simulation-store, selection-store,         │   │
│  │   ui-store, quiz-store, audio-store)                         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                            ↓                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    SUPABASE CLIENT                           │   │
│  │  (Auth, Database, Realtime)                                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────┐
│                       EXTERNAL SERVICES                             │
├──────────────────┬──────────────────┬──────────────────────────────┤
│   Vercel         │   Railway        │   Texture/Audio Assets       │
│   (Frontend)     │   (Supabase)     │   (Public/Cloudflare)        │
└──────────────────┴──────────────────┴──────────────────────────────┘
```

---

## Layer Architecture

### 1. UI Layer (`src/components/`)

**Responsibility:** React components for user interface

- **Cosmic Explorer** — Main 3D scene orchestration
- **Scale-specific scenes** — Solar system, stellar, galactic, cosmic
- **UI Components** — Info panels, search, navigation, modals
- **Quiz** — Quiz components and result display

**Key principle:** Dumb components, logic in hooks/stores

### 2. Business Logic Layer (`src/hooks/`, `src/lib/`)

**Responsibility:** All application logic

- **Hooks** — Custom React hooks for 3D, data, quiz, UI logic
- **Store** — Zustand stores for global state
- **Utils** — Astronomy calculations, formatters, validators

**Key principle:** Pure functions, no UI dependencies

### 3. Data Layer (`src/lib/supabase/`, `src/data/`)

**Responsibility:** Data fetching and persistence

- **Static data** — JSON files for celestial objects
- **Supabase** — User data (bookmarks, quiz results, progress)
- **API Routes** — Server-side endpoints for analytics

**Key principle:** Single source of truth, caching where appropriate

### 4. Rendering Layer (R3F)

**Responsibility:** 3D visualization

- **Three.js** via React Three Fiber
- **Drei** — Useful R3F helpers
- **Post-processing** — Bloom, tone mapping, effects
- **Custom GLSL** — Atmosphere, sun, black hole shaders

**Key principle:** Performance-first, LOD system

---

## State Management (Zustand)

Six stores manage different domains:

### Explorer Store

```typescript
interface ExplorerState {
  scale: "solar" | "stellar" | "galactic" | "cosmic";
  setScale: (scale: Scale) => void;
  isTransitioning: boolean;
  // ...
}
```

### Simulation Store

```typescript
interface SimulationState {
  isPlaying: boolean;
  speed: number; // 1x to 1000x
  currentDate: Date;
  setSpeed: (speed: number) => void;
  togglePlay: () => void;
  setDate: (date: Date) => void;
}
```

### Selection Store

```typescript
interface SelectionState {
  selectedObject: CelestialObject | null;
  hoveredObject: CelestialObject | null;
  selectObject: (object: CelestialObject) => void;
  clearSelection: () => void;
}
```

### UI Store

```typescript
interface UIState {
  isInfoPanelOpen: boolean;
  isSearchOpen: boolean;
  isCompareMode: boolean;
  locale: "en" | "id";
  toggleInfoPanel: () => void;
  // ...
}
```

### Quiz Store

```typescript
interface QuizState {
  currentQuestion: number;
  score: number;
  answers: number[];
  submitAnswer: (answer: number) => void;
  resetQuiz: () => void;
}
```

### Audio Store

```typescript
interface AudioState {
  isMuted: boolean;
  volume: number;
  ambientEnabled: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}
```

---

## Multi-Scale System

The core architectural innovation: **4 distinct scales** with smooth transitions.

### Scale State Machine

```
┌──────────┐    zoom out    ┌──────────┐    zoom out    ┌──────────┐    zoom out    ┌──────────┐
│  SOLAR   │ ─────────────→ │ STELLAR  │ ─────────────→ │ GALACTIC │ ─────────────→ │ COSMIC   │
│ SYSTEM   │                │          │                │          │                │          │
└──────────┘                └──────────┘                └──────────┘                └──────────┘
     ↑                           ↑                           ↑                           │
     │                           │                           │                           │
     └───────────────────────────┴───────────────────────────┴───────────────────────────┘
                                    zoom in
```

### Scale Definitions

| Scale    | Camera Distance | Rendered Objects             | LOD Level          |
| -------- | --------------- | ---------------------------- | ------------------ |
| Solar    | 0.1 - 100 AU    | Sun, planets, asteroids      | High (8K textures) |
| Stellar  | 1 - 100 ly      | Nearby stars, constellations | Medium             |
| Galactic | 100 - 100k ly   | Galaxy, nebulae, clusters    | Medium-Low         |
| Cosmic   | 1M - 46B ly     | Galaxy groups, cosmic web    | Low (points)       |

### Transition Logic

1. **Trigger:** Zoom level crosses threshold OR manual scale selector
2. **LoadingZone:** Show loading indicator during transition
3. **Cleanup:** Dispose unused resources (textures, geometries)
4. **Setup:** Initialize new scale scene
5. **Animation:** Smooth camera position interpolation
6. **Complete:** Hide loading, enable interactions

---

## 3D Rendering Pipeline

### Component Hierarchy

```
<Canvas>
  <CosmicExplorer>
    <ScaleController>
      <LoadingZone /> (during transitions)

      {scale === 'solar' && (
        <SolarSystemScene>
          <Sun />
          <Planet name="mercury" />
          <Planet name="venus" />
          <Planet name="earth" />
          <Planet name="mars" />
          <Planet name="jupiter" />
          <Planet name="saturn" />
          <Planet name="uranus" />
          <Planet name="neptune" />
          <AsteroidBelt />
          <KuiperBelt />
        </SolarSystemScene>
      )}

      {scale === 'stellar' && (
        <StellarScene>
          <StarField />
          <Star name="sirius" />
          <Star name="proxima" />
          <Constellation lines />
        </StellarScene>
      )}

      {scale === 'galactic' && (
        <GalacticScene>
          <MilkyWay />
          <Nebula name="orion" />
          <StarCluster name="pleiades" />
          <SagittariusA />
        </GalacticScene>
      )}

      {scale === 'cosmic' && (
        <CosmicScene>
          <CosmicWeb />
          <LocalGroup />
          <VirgoCluster />
          <Laniakea />
        </CosmicScene>
      )}
    </ScaleController>

    <OrbitControls />
    <EffectComposer>
      <Bloom />
      <ToneMapping />
    </EffectComposer>
  </CosmicExplorer>
</Canvas>
```

### Performance Optimizations

1. **Level of Detail (LOD)**
   - High: Full geometry, 8K textures
   - Medium: Simplified geometry, 2K textures
   - Low: Points/particles, no textures

2. **Texture Management**
   - Lazy loading per object
   - Dispose unused textures during scale transition
   - Compressed textures (WebP)

3. **Geometry Reuse**
   - InstancedMesh for asteroids, stars
   - Reusable geometries for similar objects

4. **Frustum Culling**
   - Built-in Three.js culling
   - Custom culling for large scenes

5. **Render Throttling**
   - Limit frame rate on low-power devices
   - Pause rendering when tab not visible

---

## Database Schema (Supabase)

### Tables

```sql
-- Users (handled by Supabase Auth)
-- No additional users table needed

-- Bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  object_type TEXT NOT NULL,  -- 'planet', 'star', 'galaxy', etc.
  object_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, object_type, object_slug)
);

-- Quiz Results
CREATE TABLE quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  score INT NOT NULL,
  total_questions INT NOT NULL,
  time_taken_seconds INT,
  completed_at TIMESTAMPTZ DEFAULT now()
);

-- User Progress
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  planets_visited TEXT[] DEFAULT '{}',
  constellations_viewed TEXT[] DEFAULT '{}',
  quizzes_completed INT DEFAULT 0,
  total_score INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Analytics (anonymous + authenticated)
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  event TEXT NOT NULL,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Row Level Security (RLS)

- **bookmarks:** Users can only see their own bookmarks
- **quiz_results:** Users can only see their own results
- **user_progress:** Users can only see their own progress
- **analytics:** Read by admin only, insert by all

---

## API Routes

### `POST /api/analytics`

Track user events (page views, interactions)

### `POST /api/quiz/submit`

Submit quiz results, update leaderboard

### `GET /api/bookmarks`

Get user bookmarks (authenticated)

### `POST /api/bookmarks`

Add/remove bookmark (authenticated)

---

## Internationalization (i18n)

### Route Structure

```
/[locale]/
├── page.tsx              # → /en, /id
├── solar-system/
│   └── [planet]/
│       └── page.tsx      # → /en/solar-system/earth
└── ...
```

### Translation Files

```
src/messages/
├── en/
│   ├── common.json
│   ├── planets.json
│   ├── stars.json
│   └── ...
└── id/
    ├── common.json
    ├── planets.json
    └── ...
```

### Key Translation Structure

```json
{
  "planets": {
    "earth": {
      "name": "Earth",
      "description": "...",
      "stats": {
        "radius": "6,371 km",
        "distance": "1 AU"
      }
    }
  }
}
```

---

## Security Considerations

1. **Environment Variables**
   - Supabase keys in `.env.local` (never committed)
   - Service role key only on server-side

2. **Authentication**
   - Supabase Auth (Google OAuth + email)
   - Session validation on protected routes

3. **RLS Policies**
   - All user data protected by Row Level Security

4. **Input Validation**
   - Zod schemas for all API inputs
   - Sanitized queries (parameterized)

5. **Rate Limiting**
   - Analytics endpoint rate limited
   - Quiz submission validated

---

## Error Handling

| Layer      | Strategy                                        |
| ---------- | ----------------------------------------------- |
| 3D Render  | Fallback to lower LOD, error boundary           |
| Data Fetch | Retry with exponential backoff, cached fallback |
| Auth       | Redirect to login, session refresh              |
| API        | Custom error pages, toast notifications         |

---

## Environment Configuration

| Variable                        | Description                | Required    |
| ------------------------------- | -------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL       | Yes         |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key          | Yes         |
| `SUPABASE_SERVICE_ROLE_KEY`     | Service role (server only) | Yes         |
| `VERCEL_TOKEN`                  | Vercel deployment token    | Deploy only |
| `RAILWAY_API_TOKEN`             | Railway API token          | Deploy only |

---

## Development vs Production

| Aspect    | Development              | Production       |
| --------- | ------------------------ | ---------------- |
| API       | `http://localhost:54321` | Railway Supabase |
| Frontend  | `localhost:3000`         | Vercel           |
| Auth      | Dev Auth (any email)     | Production OAuth |
| Analytics | Console log              | Supabase insert  |
| Logs      | Terminal                 | Vercel Dashboard |

---

## Key Architectural Patterns

1. **Feature-Based Organization** — `src/components/solar-system/`, `src/components/stellar/`
2. **Atomic Design** — Base `<Planet>` → specialized `<Earth>`, `<Mars>`
3. **Barrel Exports** — `index.ts` per folder for clean imports
4. **Composition over Inheritance** — Reusable hooks + components
5. **Single Source of Truth** — Static JSON for celestial data, Supabase for user data
6. **Progressive Enhancement** — Core works without auth/audio

---

## Related Documentation

- [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) — Detailed folder layout
- [SETUP.md](SETUP.md) — Environment setup
- [DEVELOPMENT.md](DEVELOPMENT.md) — Developer guide
- [guides/SCALE_SYSTEM.md](guides/SCALE_SYSTEM.md) — Scale transitions
- [guides/3D_RENDERING.md](guides/3D_RENDERING.md) — R3F patterns
