# Interactive Cosmic Explorer — Documentation Plan

> **Status:** Planning Phase
> **Deadline:** Long-term (20 weeks)
> **Tech Stack:** Next.js 14 + R3F + Supabase + Railway

---

## Documentation Structure

```
docs/
├── PROJECT.md                          # Project overview
├── ARCHITECTURE.md                     # System architecture
├── DEVELOPMENT.md                      # Development guide
├── FOLDER_STRUCTURE.md                 # Folder structure reference
├── API_REFERENCE.md                    # API/Component reference
├── DEPLOYMENT.md                       # Deployment guide (Vercel + Railway)
├── SETUP.md                            # Local setup & environment
│
├── guides/
│   ├── 3D_RENDERING.md                 # R3F patterns & 3D concepts
│   ├── SCALE_SYSTEM.md                 # Multi-scale navigation
│   ├── SHADER_GUIDE.md                 # Custom GLSL shaders
│   ├── DATA_MODELS.md                  # Type definitions & schemas
│   ├── SUPABASE_SETUP.md               # Database schema & migrations
│   ├── I18N_SETUP.md                   # Multi-language setup
│   ├── AUDIO_SYSTEM.md                 # Audio management
│   └── QUIZ_SYSTEM.md                  # Quiz implementation
│
├── phase-guides/
│   ├── PHASE_1.md                      # Setup + Solar System
│   ├── PHASE_2.md                      # Interactivity + Detail Pages
│   ├── PHASE_3.md                      # Stellar Neighborhood + Constellations
│   ├── PHASE_4.md                      # Exoplanet + Nebula
│   ├── PHASE_5.md                      # Galaxy + Black Holes
│   ├── PHASE_6.md                      # Cosmic Web + Dark Matter
│   ├── PHASE_7.md                      # Supabase Integration
│   ├── PHASE_8.md                      # Quiz System
│   ├── PHASE_9.md                      # i18n + Audio
│   └── PHASE_10.md                     # Polish + Deploy
│
├── superpowers/
│   └── plans/
│       ├── YYYY-MM-DD-phase-1-setup.md
│       ├── YYYY-MM-DD-phase-2-interactivity.md
│       └── ...
│
└── GLOSSARY.md                         # Astronomy/technical terms
```

---

## Documentation to Create

### 1. **PROJECT.md** — Overview

- **What:** Interactive 3D cosmic explorer (solar system → universe)
- **Why:** Educational media interaktif
- **Features:** Real-time 3D, quiz, bookmarks, multi-scale navigation, i18n, audio
- **Users:** Students, astronomy enthusiasts
- **Timeline:** 20 weeks (phases 1-10)
- **Key Technologies:** Next.js, R3F, Supabase, Vercel, Railway

### 2. **ARCHITECTURE.md** — System Design

- **Layered architecture:** UI → Business Logic → Data → 3D Engine
- **Multi-scale system:** 4 zoom levels (solar → stellar → galactic → cosmic)
- **State management:** Zustand store (simulation, selection, UI state)
- **Database layer:** Supabase Auth + PostgreSQL
- **Rendering:** React Three Fiber + GLSL shaders
- **Deployment:** Vercel frontend + Railway backend

### 3. **FOLDER_STRUCTURE.md** — Detailed Folder Reference

- Granular folder breakdown (already created above)
- Responsibility of each folder
- When to create new folders
- Naming conventions
- Import patterns (barrel exports)

### 4. **DEVELOPMENT.md** — Developer Guide

- **Prerequisites:** Node 18+, npm/yarn, git
- **Local setup:** `npm install`, env vars, Supabase local
- **Dev server:** `npm run dev`
- **Code style:** ESLint, Prettier, TypeScript strict
- **Commit convention:** Conventional commits
- **Branch strategy:** feature/_, bugfix/_, main protected
- **Code review process:** PR requirements

### 5. **SETUP.md** — Environment Setup

- **Node.js installation**
- **.env.local template:**
  ```
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  RAILWAY_API_TOKEN=
  VERCEL_TOKEN=
  ```
- **Supabase local dev:** `supabase start`
- **Database seeding:** `npm run seed`
- **Texture download:** Instructions for Solar System Scope
- **Running tests:** `npm run test`
- **Linting/formatting:** `npm run lint`, `npm run format`

### 6. **API_REFERENCE.md** — Component & Hook Reference

- **Main Components:**
  - `<CosmicExplorer>` — Root 3D scene
  - `<Planet>`, `<Star>`, `<Galaxy>` — 3D objects
  - `<InfoPanel>` — Info overlay
  - `<SearchBar>` — Search interface
  - `<Quiz>` — Quiz component
- **Custom Hooks:**
  - `usePlanetPosition()` — Orbital calculations
  - `useCameraFlyTo()` — Camera animation
  - `useScaleTransition()` — Scale mode switching
  - `useQuiz()` — Quiz logic
- **API Endpoints:**
  - `POST /api/analytics` — Event tracking
  - `POST /api/quiz/submit` — Quiz submission
  - `POST /api/bookmarks` — Bookmark management

### 7. **Guides/3D_RENDERING.md** — R3F Patterns

- **Basic R3F setup:** Canvas, useFrame, useRef
- **Texture loading:** useTexture, async loading
- **Materials:** MeshStandardMaterial, MeshBasicMaterial
- **Lighting:** PointLight, AmbientLight setup
- **Shaders:** Inline GLSL, ShaderMaterial
- **Camera transitions:** useTween, React Spring
- **Performance:** LOD, frustum culling, instancing
- **Common pitfalls:** Memory leaks, re-renders, texture loading

### 8. **Guides/SCALE_SYSTEM.md** — Multi-Scale Navigation

- **Scale 0:** Solar System (0-50 AU)
- **Scale 1:** Stellar Neighborhood (0-50 ly)
- **Scale 2:** Galactic (0-100,000 ly)
- **Scale 3:** Cosmic (0-46 billion ly)
- **Transition mechanism:** Zoom detection → ScaleController → scene swap
- **LoadingZone:** State machine diagram
- **Camera behavior per scale**
- **LOD (Level of Detail)** for each scale

### 9. **Guides/DATA_MODELS.md** — TypeScript Types

```typescript
// Planet type definition
interface Planet {
  id: string;
  name: i18nString;
  slug: string;
  radius: number;
  distance: number;
  // ...
}

// Star type definition
interface Star {
  id: string;
  name: string;
  hip: number; // Hipparcos ID
  ra: number; // Right ascension
  dec: number; // Declination
  // ...
}

// All Zod validators
```

### 10. **Guides/SUPABASE_SETUP.md** — Database

- **Tables:** users (via Auth), bookmarks, quiz_results, user_progress, analytics
- **Schema & migrations** (SQL)
- **RLS policies** (Row Level Security)
- **Auth setup:** Google OAuth, email/password
- **Seeding data:** Import quiz questions, default bookmarks

### 11. **Guides/I18N_SETUP.md** — Internationalization

- **next-intl configuration**
- **Translation file structure** (EN + ID JSON)
- **Dynamic route setup:** `/[locale]/...`
- **Language toggle logic**
- **Server/client translation**
- **Adding new languages**

### 12. **Guides/AUDIO_SYSTEM.md** — Audio Management

- **Howler.js integration**
- **Sound registry** (ambient, SFX, UI)
- **Audio state** (Zustand store)
- **Mute/unmute logic**
- **Respect prefers-reduced-motion**

### 13. **Guides/SHADER_GUIDE.md** — Custom GLSL

- **Atmosphere scattering shader** (Rayleigh/Mie)
- **Sun plasma shader** (Perlin noise animation)
- **Black hole lensing shader** (Refraction)
- **Galaxy spiral shader** (Parametric arms)
- **Nebula volume shader** (Volumetric rendering)
- **Common patterns:** Noise functions, lighting

### 14. **Guides/QUIZ_SYSTEM.md** — Quiz Implementation

- **Quiz data format** (JSON questions)
- **Quiz categories:** solar-system, stellar, galactic, cosmic, general
- **Scoring logic**
- **Timer implementation**
- **Result saving** (Supabase)
- **Leaderboard query**

### 15. **DEPLOYMENT.md** — Deploy Guide

- **Vercel setup:** Connect GitHub, deploy Next.js
- **Railway setup:** Supabase instance on Railway
- **Environment variables** (prod vs dev)
- **Database backups**
- **Monitoring & logging**
- **Rollback procedures**

### 16. **GLOSSARY.md** — Terms

- Astronomical terms: AU, ly, parsec, magnitude, etc.
- Technical terms: R3F, GLSL, LOD, PBR, etc.
- Latin constellation names

---

## Phase-Specific Guides

Each phase gets a dedicated `.md`:

| Phase | Guide       | Focus                                                              |
| ----- | ----------- | ------------------------------------------------------------------ |
| 1     | PHASE_1.md  | Project setup, Next.js config, R3F basics, solar system foundation |
| 2     | PHASE_2.md  | Click interactions, camera animations, detail pages, search        |
| 3     | PHASE_3.md  | Star catalog, constellation rendering, sky view mode               |
| 4     | PHASE_4.md  | Exoplanet data, nebula particles, comparison mode                  |
| 5     | PHASE_5.md  | Galaxy spiral shader, black hole lensing, star clusters            |
| 6     | PHASE_6.md  | Cosmic web network, dark matter/energy visualization               |
| 7     | PHASE_7.md  | Supabase setup, auth, bookmarks, quiz progress                     |
| 8     | PHASE_8.md  | Quiz UI, scoring, leaderboard                                      |
| 9     | PHASE_9.md  | i18n setup, audio integration                                      |
| 10    | PHASE_10.md | Responsive design, a11y, performance, deploy                       |

---

## Implementation Plans (Superpowers)

Each phase gets a detailed implementation plan (via `writing-plans` skill):

```
docs/superpowers/plans/
├── YYYY-MM-DD-phase-1-project-setup.md       # Project init, R3F canvas
├── YYYY-MM-DD-phase-2-solar-system.md         # Planet rendering
├── YYYY-MM-DD-phase-3-interactivity.md        # Click → info, search
├── YYYY-MM-DD-phase-4-stellar.md              # Star catalog, constellations
├── YYYY-MM-DD-phase-5-exoplanet-nebula.md     # Exoplanet, nebula rendering
├── YYYY-MM-DD-phase-6-galaxy-blackhole.md     # Galaxy spiral, lensing
├── YYYY-MM-DD-phase-7-cosmic-web.md           # Cosmic structure
├── YYYY-MM-DD-phase-8-supabase.md             # Database, auth
├── YYYY-MM-DD-phase-9-quiz.md                 # Quiz system
├── YYYY-MM-DD-phase-10-i18n-audio.md          # Languages, sound
└── YYYY-MM-DD-phase-11-polish-deploy.md       # Responsive, a11y, deploy
```

---

## Documentation Creation Timeline

| Week | Task                                                      |
| ---- | --------------------------------------------------------- |
| 0    | PROJECT.md, ARCHITECTURE.md, FOLDER_STRUCTURE.md          |
| 0    | DEVELOPMENT.md, SETUP.md, API_REFERENCE.md                |
| 1    | Guides: 3D_RENDERING.md, SCALE_SYSTEM.md, DATA_MODELS.md  |
| 1    | Guides: SUPABASE_SETUP.md, I18N_SETUP.md, SHADER_GUIDE.md |
| 1    | DEPLOYMENT.md, GLOSSARY.md                                |
| 2+   | Phase guides (1 per phase, created during phase)          |
| 2+   | Implementation plans via writing-plans skill              |

---

## Next Steps

1. **Create core documentation files** (PROJECT.md → GLOSSARY.md)
2. **Create guides/** folder with technical deep-dives
3. **Create phase-guides/** folder (populate as phases progress)
4. **Create superpowers/plans/** folder (populate via writing-plans)
5. **Start Phase 1 implementation** (with Phase 1 implementation plan)

---

**Ready to create the actual docs?**

**Option 1:** Create all docs now (comprehensive upfront)
**Option 2:** Create core docs first (PROJECT, ARCHITECTURE, FOLDER_STRUCTURE, SETUP), then phase-specific docs as we go
**Option 3:** Start Phase 1 implementation plan immediately, create docs in parallel

Which approach?
