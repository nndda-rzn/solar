# Folder Structure

> Detailed breakdown of the project's folder organization for maintainability and scalability.

---

## Root Structure

```
cosmic-explorer/
├── .github/                    # CI/CD workflows
├── public/                     # Static assets (images, audio, fonts)
├── src/                        # Source code (main development area)
├── docs/                       # Documentation
├── supabase/                   # Supabase configuration and migrations
├── .env.local                  # Environment variables (not committed)
├── .env.example                # Environment template
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Project overview
```

---

## Public Assets (`public/`)

```
public/
├── textures/                   # 3D texture files
│   ├── solar-system/           # Planet textures
│   │   ├── sun/
│   │   │   ├── diffuse.webp
│   │   │   └── normal.webp
│   │   ├── mercury/
│   │   ├── venus/
│   │   ├── earth/
│   │   │   ├── diffuse.webp
│   │   │   ├── normal.webp
│   │   │   ├── specular.webp
│   │   │   ├── emissive.webp   # Night lights
│   │   │   └── clouds.webp
│   │   ├── mars/
│   │   ├── jupiter/
│   │   ├── saturn/
│   │   │   ├── diffuse.webp
│   │   │   └── rings.webp      # Ring texture with alpha
│   │   ├── uranus/
│   │   ├── neptune/
│   │   └── pluto/
│   ├── nebulae/                # Nebula textures
│   ├── galaxies/               # Galaxy textures
│   └── skybox/                 # Background skybox
│
├── audio/                      # Sound files
│   ├── ambient/
│   │   └── space-ambient.mp3
│   ├── sfx/
│   │   ├── click.mp3
│   │   ├── hover.mp3
│   │   └── transition.mp3
│   └── ui/
│       └── quiz-correct.mp3
│
└── fonts/                      # Custom fonts
```

**Naming Convention:**

- Use `kebab-case` for folder names
- Texture files: `diffuse.webp`, `normal.webp`, `specular.webp`, `emissive.webp`, `clouds.webp`, `rings.webp`
- Audio files: `kebab-case.mp3`

---

## Source Code (`src/`)

### App Router (`src/app/`)

```
src/app/
├── layout.tsx                  # Root layout (html, body, global providers)
├── page.tsx                    # Root page (redirects to /[locale])
├── globals.css                 # Global styles (Tailwind base)
├── not-found.tsx               # 404 page
├── error.tsx                   # Error boundary
├── loading.tsx                 # Loading skeleton
│
├── [locale]/                   # i18n dynamic route
│   ├── layout.tsx              # Locale layout (navbar, footer, providers)
│   ├── page.tsx                # Landing page → Cosmic Explorer
│   │
│   ├── solar-system/
│   │   ├── page.tsx            # Solar system view
│   │   └── [planet]/
│   │       └── page.tsx        # /solar-system/earth
│   │
│   ├── stars/
│   │   ├── page.tsx            # Stellar neighborhood view
│   │   ├── [star]/
│   │   │   └── page.tsx        # /stars/sirius
│   │   └── constellations/
│   │       ├── page.tsx        # All constellations
│   │       └── [constellation]/
│   │           └── page.tsx    # /stars/constellations/orion
│   │
│   ├── exoplanets/
│   │   ├── page.tsx
│   │   └── [exoplanet]/
│   │       └── page.tsx
│   │
│   ├── nebulae/
│   │   ├── page.tsx
│   │   └── [nebula]/
│   │       └── page.tsx
│   │
│   ├── galaxies/
│   │   ├── page.tsx
│   │   └── [galaxy]/
│   │       └── page.tsx
│   │
│   ├── clusters/
│   │   ├── page.tsx
│   │   └── [cluster]/
│   │       └── page.tsx
│   │
│   ├── blackholes/
│   │   ├── page.tsx
│   │   └── [blackhole]/
│   │       └── page.tsx
│   │
│   ├── quiz/
│   │   ├── page.tsx            # Quiz category selection
│   │   ├── [category]/
│   │   │   └── page.tsx        # /quiz/solar-system
│   │   └── results/
│   │       └── page.tsx        # Quiz results
│   │
│   ├── profile/
│   │   ├── page.tsx            # User profile
│   │   └── bookmarks/
│   │       └── page.tsx        # User bookmarks
│   │
│   └── about/
│       └── page.tsx
│
└── api/                        # API Routes (server-side)
    ├── analytics/
    │   └── route.ts            # POST /api/analytics
    ├── quiz/
    │   └── submit/
    │       └── route.ts        # POST /api/quiz/submit
    └── bookmarks/
        └── route.ts            # GET/POST/DELETE /api/bookmarks
```

**Responsibility:** Each page file is thin — it fetches data and renders the appropriate component.

---

### Components (`src/components/`)

```
src/components/
│
├── cosmic-explorer/            # Main 3D scene orchestration
│   ├── index.ts                # Barrel export
│   ├── CosmicExplorer.tsx      # Root Canvas + providers
│   ├── Scene.tsx               # R3F scene setup
│   ├── Camera.tsx              # Camera controller
│   ├── Lighting.tsx            # Global lighting
│   │
│   ├── scale-manager/          # Scale transition system
│   │   ├── ScaleController.tsx
│   │   ├── ScaleTransition.tsx
│   │   ├── LoadingZone.tsx
│   │   └── ScaleIndicator.tsx
│   │
│   ├── controls/               # User controls
│   │   ├── OrbitControls.tsx
│   │   ├── SpeedControl.tsx
│   │   ├── PauseButton.tsx
│   │   ├── TimelineSlider.tsx
│   │   ├── ZoomControls.tsx
│   │   ├── ViewModeToggle.tsx
│   │   └── FullscreenToggle.tsx
│   │
│   └── shared/                 # Shared 3D utilities
│       ├── OrbitPath.tsx
│       ├── Label.tsx
│       ├── SelectionRing.tsx
│       ├── InfoTooltip.tsx
│       └── ParticleSystem.tsx
│
├── solar-system/               # Scale 0: Solar System
│   ├── index.ts
│   ├── SolarSystemScene.tsx
│   │
│   ├── sun/
│   │   ├── Sun.tsx
│   │   ├── SunCorona.tsx
│   │   └── SunPlasma.tsx
│   │
│   ├── planets/
│   │   ├── Planet.tsx          # Base component (reusable)
│   │   ├── PlanetAtmosphere.tsx
│   │   ├── PlanetClouds.tsx
│   │   ├── PlanetRing.tsx
│   │   ├── PlanetMoons.tsx
│   │   ├── Mercury.tsx         # Configured instances
│   │   ├── Venus.tsx
│   │   ├── Earth.tsx
│   │   ├── Mars.tsx
│   │   ├── Jupiter.tsx
│   │   ├── Saturn.tsx
│   │   ├── Uranus.tsx
│   │   ├── Neptune.tsx
│   │   └── Pluto.tsx
│   │
│   ├── small-bodies/
│   │   ├── AsteroidBelt.tsx
│   │   ├── KuiperBelt.tsx
│   │   ├── Comet.tsx
│   │   ├── Meteoroid.tsx
│   │   └── DwarfPlanet.tsx
│   │
│   └── effects/
│       ├── SolarWind.tsx
│       ├── ZodiacalLight.tsx
│       └── HabitableZone.tsx
│
├── stellar/                    # Scale 1: Stars & Constellations
│   ├── index.ts
│   ├── StellarScene.tsx
│   │
│   ├── stars/
│   │   ├── Star.tsx
│   │   ├── MainSequence.tsx
│   │   ├── RedGiant.tsx
│   │   ├── WhiteDwarf.tsx
│   │   ├── NeutronStar.tsx
│   │   ├── StarField.tsx
│   │   └── StarLabel.tsx
│   │
│   ├── constellations/
│   │   ├── Constellation.tsx
│   │   ├── ConstellationLines.tsx
│   │   ├── ConstellationLabel.tsx
│   │   ├── ConstellationToggle.tsx
│   │   ├── SkyView.tsx
│   │   └── sky-view/
│   │       ├── SkyGrid.tsx
│   │       └── SkyProjection.tsx
│   │
│   └── effects/
│       ├── InterstellarDust.tsx
│       └── StarTwinkle.tsx
│
├── galactic/                   # Scale 2: Galaxy & Nebulae
│   ├── index.ts
│   ├── GalacticScene.tsx
│   │
│   ├── galaxy/
│   │   ├── Galaxy.tsx
│   │   ├── GalaxyCore.tsx
│   │   ├── GalaxyArm.tsx
│   │   ├── GalaxyDust.tsx
│   │   └── GalaxyHalo.tsx
│   │
│   ├── nebulae/
│   │   ├── Nebula.tsx
│   │   ├── NebulaParticles.tsx
│   │   ├── NebulaVolume.tsx
│   │   ├── EmissionNebula.tsx
│   │   ├── PlanetaryNebula.tsx
│   │   └── SupernovaRemnant.tsx
│   │
│   ├── clusters/
│   │   ├── StarCluster.tsx
│   │   ├── OpenCluster.tsx
│   │   └── GlobularCluster.tsx
│   │
│   ├── exoplanets/
│   │   ├── ExoplanetSystem.tsx
│   │   ├── Exoplanet.tsx
│   │   ├── HabitableZone.tsx
│   │   └── TransitDiagram.tsx
│   │
│   └── effects/
│       ├── GravitationalLensing.tsx
│       └── GalacticWind.tsx
│
├── cosmic/                     # Scale 3: Universe
│   ├── index.ts
│   ├── CosmicScene.tsx
│   │
│   ├── cosmic-web/
│   │   ├── CosmicWeb.tsx
│   │   ├── CosmicNode.tsx
│   │   ├── CosmicFilament.tsx
│   │   └── CosmicVoid.tsx
│   │
│   ├── large-structure/
│   │   ├── LocalGroup.tsx
│   │   ├── VirgoCluster.tsx
│   │   ├── Laniakea.tsx
│   │   └── GalaxyCluster.tsx
│   │
│   └── dark/
│       ├── DarkMatter.tsx
│       ├── DarkEnergy.tsx
│       └── CosmicExpansion.tsx
│
├── effects/                    # Global post-processing
│   ├── index.ts
│   ├── Bloom.tsx
│   ├── ToneMapping.tsx
│   ├── Vignette.tsx
│   ├── DepthOfField.tsx
│   └── ChromaticAberration.tsx
│
├── ui/                         # 2D UI overlay
│   ├── index.ts
│   │
│   ├── info-panel/
│   │   ├── InfoPanel.tsx
│   │   ├── InfoPanelHeader.tsx
│   │   ├── InfoPanelBody.tsx
│   │   ├── InfoPanelMedia.tsx
│   │   ├── InfoPanelStats.tsx
│   │   └── InfoPanelFacts.tsx
│   │
│   ├── search/
│   │   ├── SearchBar.tsx
│   │   ├── SearchResults.tsx
│   │   ├── SearchResultItem.tsx
│   │   └── SearchFilters.tsx
│   │
│   ├── compare/
│   │   ├── CompareMode.tsx
│   │   ├── CompareSelector.tsx
│   │   └── CompareTable.tsx
│   │
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   ├── NavItem.tsx
│   │   ├── MobileMenu.tsx
│   │   ├── Breadcrumb.tsx
│   │   └── BackToExplorer.tsx
│   │
│   ├── bookmark/
│   │   ├── BookmarkButton.tsx
│   │   ├── BookmarkList.tsx
│   │   └── BookmarkItem.tsx
│   │
│   └── common/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── Tooltip.tsx
│       ├── Badge.tsx
│       ├── Slider.tsx
│       ├── Toggle.tsx
│       ├── Card.tsx
│       ├── Skeleton.tsx
│       ├── Spinner.tsx
│       └── Toast.tsx
│
├── quiz/
│   ├── index.ts
│   ├── QuizCard.tsx
│   ├── QuizOptions.tsx
│   ├── QuizProgress.tsx
│   ├── QuizTimer.tsx
│   ├── QuizResult.tsx
│   ├── QuizExplanation.tsx
│   ├── QuizCategorySelect.tsx
│   └── Leaderboard.tsx
│
└── layout/
    ├── Footer.tsx
    ├── LanguageToggle.tsx
    ├── AudioControl.tsx
    ├── ThemeToggle.tsx
    └── UserMenu.tsx
```

**Naming Convention:**

- **PascalCase** for component files: `Planet.tsx`, `StarField.tsx`
- **kebab-case** for folders: `solar-system/`, `small-bodies/`
- **index.ts** for barrel exports in each folder

---

### Hooks (`src/hooks/`)

```
src/hooks/
├── index.ts                    # Barrel export
│
├── 3d/                         # 3D-related hooks
│   ├── usePlanetPosition.ts    # Kepler orbital calculations
│   ├── useCameraFlyTo.ts       # Animate camera to object
│   ├── useScaleTransition.ts   # Scale mode switching
│   ├── useObjectSelection.ts   # Raycasting for click
│   ├── useTextureLoader.ts     # Lazy texture loading
│   └── useSimulationTime.ts    # Time management
│
├── data/                       # Data fetching hooks
│   ├── usePlanetData.ts
│   ├── useStarData.ts
│   ├── useConstellationData.ts
│   ├── useExoplanetData.ts
│   ├── useNebulaData.ts
│   ├── useGalaxyData.ts
│   ├── useClusterData.ts
│   └── useBlackHoleData.ts
│
├── quiz/                       # Quiz hooks
│   ├── useQuiz.ts
│   ├── useQuizTimer.ts
│   └── useQuizScore.ts
│
└── ui/                         # UI hooks
    ├── useSearch.ts
    ├── useBookmark.ts
    ├── useAudio.ts
    └── useMediaQuery.ts
```

---

### Library & Utilities (`src/lib/`)

```
src/lib/
│
├── supabase/                   # Supabase clients
│   ├── client.ts               # Browser client
│   ├── server.ts               # Server client
│   ├── middleware.ts           # Auth middleware
│   └── admin.ts                # Admin client (service role)
│
├── store/                      # Zustand stores
│   ├── index.ts                # Root store
│   ├── explorer-store.ts       # Scale, scene state
│   ├── simulation-store.ts     # Time, speed, pause
│   ├── selection-store.ts      # Selected/hovered object
│   ├── ui-store.ts             # Panels, modals
│   ├── quiz-store.ts           # Quiz state
│   └── audio-store.ts          # Audio state
│
├── i18n/                       # Internationalization
│   ├── index.ts
│   ├── request.ts              # next-intl request config
│   └── routing.ts              # Locale routing
│
├── audio/                      # Audio management
│   ├── audio-manager.ts        # Howler.js wrapper
│   └── sounds.ts               # Sound registry
│
├── analytics/                  # Event tracking
│   ├── tracker.ts
│   └── events.ts
│
└── utils/                      # Utility functions
    ├── astronomy.ts            # Kepler, AU conversion
    ├── math.ts                 # Vector3, interpolation
    ├── format.ts               # Number/date formatting
    ├── constants.ts            # Physical constants
    └── validators.ts           # Zod schemas
```

---

### Types (`src/types/`)

```
src/types/
├── index.ts                    # Barrel export
│
├── celestial/                  # Celestial object types
│   ├── planet.ts
│   ├── star.ts
│   ├── constellation.ts
│   ├── exoplanet.ts
│   ├── nebula.ts
│   ├── galaxy.ts
│   ├── cluster.ts
│   ├── blackhole.ts
│   ├── asteroid.ts
│   └── cosmic-structure.ts
│
├── 3d/                         # 3D-related types
│   ├── scene.ts
│   ├── camera.ts
│   ├── scale.ts
│   └── texture.ts
│
├── quiz/                       # Quiz types
│   ├── question.ts
│   ├── result.ts
│   └── category.ts
│
└── user/                       # User types
    ├── profile.ts
    ├── bookmark.ts
    └── progress.ts
```

---

### Static Data (`src/data/`)

```
src/data/
│
├── solar-system/
│   ├── planets.json            # All planet data
│   ├── comets.json
│   ├── asteroids.json
│   └── dwarf-planets.json
│
├── stellar/
│   ├── star-catalog.json       # Hipparcos bright stars (~100)
│   └── constellations.json     # 30+ constellations
│
├── galactic/
│   ├── exoplanets.json         # 50+ exoplanets
│   ├── nebulae.json            # 20+ nebulae
│   ├── galaxies.json           # 15+ galaxies
│   ├── clusters.json           # 10+ star clusters
│   └── blackholes.json         # 8+ black holes
│
├── cosmic/
│   ├── local-group.json
│   ├── superclusters.json
│   └── cosmic-web.json
│
└── quiz/
    ├── solar-system.json
    ├── stellar.json
    ├── galactic.json
    ├── cosmic.json
    └── general.json
```

---

### Shaders (`src/shaders/`)

```
src/shaders/
│
├── atmosphere/
│   ├── vertex.glsl
│   └── fragment.glsl
│
├── sun/
│   ├── corona-vertex.glsl
│   └── corona-fragment.glsl
│
├── galaxy/
│   ├── spiral-vertex.glsl
│   └── spiral-fragment.glsl
│
├── blackhole/
│   ├── lensing-vertex.glsl
│   └── lensing-fragment.glsl
│
├── nebula/
│   ├── volume-vertex.glsl
│   └── volume-fragment.glsl
│
├── cosmic-web/
│   ├── filament-vertex.glsl
│   └── filament-fragment.glsl
│
└── common/
    ├── noise.glsl              # Shared noise functions
    └── utils.glsl              # Utility functions
```

---

### Translations (`src/messages/`)

```
src/messages/
│
├── en/
│   ├── common.json             # UI strings
│   ├── planets.json            # Planet names & descriptions
│   ├── stars.json
│   ├── constellations.json
│   ├── exoplanets.json
│   ├── nebulae.json
│   ├── galaxies.json
│   ├── blackholes.json
│   ├── cosmic.json
│   ├── quiz.json               # Quiz strings
│   └── ui.json                 # UI-specific strings
│
└── id/
    ├── common.json
    ├── planets.json
    ├── stars.json
    ├── constellations.json
    ├── exoplanets.json
    ├── nebulae.json
    ├── galaxies.json
    ├── blackholes.json
    ├── cosmic.json
    ├── quiz.json
    └── ui.json
```

---

### Providers & Config (`src/providers/`, `src/config/`)

```
src/providers/
├── ThemeProvider.tsx
├── AudioProvider.tsx
├── SupabaseProvider.tsx
└── ExplorerProvider.tsx

src/config/
├── site.ts                     # Site metadata
├── navigation.ts               # Nav items
├── scales.ts                   # Scale definitions
├── planets.ts                  # Planet rendering config
└── themes.ts                   # Color themes
```

---

## When to Create New Folders

| Situation                         | Action                                   |
| --------------------------------- | ---------------------------------------- |
| New celestial type (e.g., quasar) | Create `src/components/galactic/quasar/` |
| New quiz category                 | Add JSON to `src/data/quiz/`             |
| New shader                        | Create folder in `src/shaders/`          |
| New UI component                  | Check if common or feature-specific      |
| New hook                          | Check if 3d, data, quiz, or ui category  |
| New type                          | Check existing type categories           |

---

## Import Patterns

### With Barrel Exports

```typescript
// Good: Clean imports
import { Planet, Sun, AsteroidBelt } from "@/components/solar-system";
import { usePlanetData, useCameraFlyTo } from "@/hooks";

// Bad: Direct file imports
import { Planet } from "@/components/solar-system/planets/Planet";
```

### Path Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/data/*": ["./src/data/*"]
    }
  }
}
```

---

## Related Documentation

- [ARCHITECTURE.md](ARCHITECTURE.md) — System design
- [DEVELOPMENT.md](DEVELOPMENT.md) — Development guide
- [SETUP.md](SETUP.md) — Environment setup
