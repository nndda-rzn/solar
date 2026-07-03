# Interactive Cosmic Explorer

> An interactive 3D web application for exploring the universe — from our Solar System to the farthest reaches of the cosmos.

---

## Overview

**Interactive Cosmic Explorer** is an educational web application that allows users to explore the universe in interactive 3D. Starting from our Solar System, users can zoom out through increasing scales — stellar neighborhood, our galaxy, and finally the cosmic web — while learning about celestial objects through interactive information panels, quizzes, and multimedia content.

## Project Goals

1. **Education** — Make astronomy accessible and engaging for students and enthusiasts
2. **Immersion** — Provide realistic, interactive 3D visualizations
3. **Interactivity** — Enable exploration through click, search, zoom, and simulation controls
4. **Inclusivity** — Support multiple languages (EN/ID) and accessibility standards

## Target Audience

- **Primary:** Students (high school & university)
- **Secondary:** Astronomy enthusiasts, educators, general public
- **Age range:** 14+ (no age restriction, content is educational)

## Core Features

### Multi-Scale Navigation

Zoom from Solar System → Stellar Neighborhood → Galaxy → Cosmic Web

| Scale | View                 | Objects                                                      |
| ----- | -------------------- | ------------------------------------------------------------ |
| 0     | Solar System         | Sun, 8 planets, dwarf planets, asteroids, comets             |
| 1     | Stellar Neighborhood | ~100 nearby stars, 30+ constellations                        |
| 2     | Galaxy               | Milky Way, nebulae, star clusters, exoplanets, black holes   |
| 3     | Cosmic               | Galaxy groups, superclusters, cosmic web, dark matter/energy |

### Interactive 3D Visualization

- Realistic planet rendering with PBR materials and custom shaders
- Atmospheric scattering, sun corona, black hole lensing
- Smooth camera transitions between objects
- Orbit animation with speed controls (1x–1000x)

### Educational Content

- Detailed information panels for every celestial object
- Fun facts, statistics, and comparisons
- Interactive quiz system with multiple categories
- Constellation mythology and history

### User Features

- **Search** — Global search across all objects (CMD+K)
- **Bookmarks** — Save favorite objects (requires login)
- **Quiz** — Test knowledge with scoring and leaderboard
- **Profile** — Track progress and achievements

### Localization

- Full support for English and Indonesian
- Language toggle without page reload
- All content bilingual

### Audio

- Ambient space background sound
- Interactive sound effects
- Mute/unmute controls
- Respects prefers-reduced-motion

---

## Timeline

| Phase | Duration   | Deliverable                                |
| ----- | ---------- | ------------------------------------------ |
| 1-2   | Week 1-4   | Solar System 3D + Interactivity            |
| 3-4   | Week 5-8   | Stellar + Constellations                   |
| 5-6   | Week 9-12  | Exoplanets + Nebula + Galaxy + Black Holes |
| 7-8   | Week 13-16 | Cosmic Web + Supabase Backend              |
| 9-10  | Week 17-20 | Quiz + i18n + Audio + Polish + Deploy      |

**Total:** ~20 weeks (flexible based on progress)

---

## Tech Stack

| Layer                | Technology                                                       |
| -------------------- | ---------------------------------------------------------------- |
| Framework            | Next.js 14 (App Router, TypeScript)                              |
| 3D Engine            | React Three Fiber + Drei + postprocessing                        |
| Custom Shaders       | GLSL (atmosphere, sun plasma, black hole lensing, galaxy spiral) |
| Database & Auth      | Supabase (PostgreSQL + Auth)                                     |
| Styling              | Tailwind CSS                                                     |
| State Management     | Zustand                                                          |
| Internationalization | next-intl                                                        |
| Audio                | Howler.js                                                        |
| Deployment           | Vercel (frontend) + Railway (Supabase)                           |

---

## Data Sources

| Content              | Source                             |
| -------------------- | ---------------------------------- |
| Planet textures      | Solar System Scope (8K, CC BY 4.0) |
| Nebula/Galaxy images | NASA/ESA/Hubble (public domain)    |
| Star catalog         | Hipparcos (ESA, public domain)     |
| Constellation data   | IAU + Stellarium                   |
| Exoplanet data       | NASA Exoplanet Archive             |
| Cosmic structure     | Astronomical surveys               |

---

## Project Status

- [ ] Phase 1: Project Setup + Solar System
- [ ] Phase 2: Interactivity + Detail Pages
- [ ] Phase 3: Stellar + Constellations
- [ ] Phase 4: Exoplanet + Nebula
- [ ] Phase 5: Galaxy + Black Holes
- [ ] Phase 6: Cosmic Web + Dark Matter
- [ ] Phase 7: Supabase Integration
- [ ] Phase 8: Quiz System
- [ ] Phase 9: i18n + Audio
- [ ] Phase 10: Polish + Deploy

---

## Getting Started

See [SETUP.md](SETUP.md) for local development setup.

```bash
# Clone and install
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

---

## License

Educational project. All astronomical images are public domain or CC BY 4.0.
