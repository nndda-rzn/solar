# Interactive Cosmic Explorer

> A web-based interactive 3D application for exploring the universe — from our Solar System to the farthest reaches of the cosmic web.

---

## Overview

Interactive Cosmic Explorer is an educational web application that allows users to explore the universe in realistic 3D. Starting from our Solar System, users can zoom out through increasing scales — stellar neighborhood, our galaxy, and finally the cosmic web — while learning about celestial objects through interactive information panels, quizzes, and multimedia content.

---

## Features

### 🌌 Multi-Scale Navigation

- **Solar System** — Sun, planets, asteroids, comets
- **Stellar Neighborhood** — Nearby stars, constellations
- **Galaxy** — Milky Way, nebulae, star clusters, black holes
- **Cosmic Web** — Galaxy groups, superclusters, dark matter/energy

### 🎮 Interactive 3D

- Realistic planet rendering with PBR materials
- Custom GLSL shaders (atmosphere, sun plasma, black hole lensing)
- Smooth camera transitions between objects
- Orbit animation with speed controls (1x–1000x)

### 📚 Educational Content

- Detailed information panels for every celestial object
- Fun facts, statistics, and comparisons
- Interactive quiz system with multiple categories
- Constellation mythology and history

### 🌍 Multi-Language

- Full support for English and Indonesian
- Language toggle without page reload
- All content bilingual

### 🔊 Audio & UI

- Ambient space background sound
- Interactive sound effects
- Search across all objects (CMD+K)
- Bookmark favorite objects (requires login)

---

## Tech Stack

| Layer              | Technology                                 |
| ------------------ | ------------------------------------------ |
| **Framework**      | Next.js 14 (App Router, TypeScript)        |
| **3D Engine**      | React Three Fiber + Drei + postprocessing  |
| **Custom Shaders** | GLSL (atmosphere, sun, black hole, galaxy) |
| **Database**       | Supabase (PostgreSQL + Auth)               |
| **Styling**        | Tailwind CSS                               |
| **State**          | Zustand                                    |
| **i18n**           | next-intl                                  |
| **Audio**          | Howler.js                                  |
| **Deploy**         | Vercel + Railway                           |

---

## Documentation

All documentation is in the [docs/](docs/) folder:

| Document                                             | Description             |
| ---------------------------------------------------- | ----------------------- |
| [docs/README.md](docs/README.md)                     | Documentation index     |
| [docs/SETUP.md](docs/SETUP.md)                       | Environment setup guide |
| [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)           | Development workflow    |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)         | System architecture     |
| [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) | Code organization       |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)             | Deployment guide        |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git
- Supabase account (free tier)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/cosmic-explorer.git
   cd cosmic-explorer
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

4. **Download textures:**

   ```bash
   npm run download-textures
   ```

5. **Run development server:**
   ```bash
   npm run dev
   ```

Open http://localhost:3000 in your browser.

See [docs/SETUP.md](docs/SETUP.md) for detailed instructions.

---

## Development

### Quick Commands

```bash
# Development server
npm run dev

# Type check
npm run type-check

# Lint and fix
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Build for production
npm run build

# Start production server
npm start
```

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for more details.

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes, commit
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/your-feature

# Create PR on GitHub
```

---

## Project Structure

```
cosmic-explorer/
├── docs/                     # Documentation
├── public/                   # Static assets (textures, audio)
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # React components
│   │   ├── solar-system/     # Scale 0: Solar System
│   │   ├── stellar/          # Scale 1: Stars & Constellations
│   │   ├── galactic/         # Scale 2: Galaxy
│   │   └── cosmic/           # Scale 3: Universe
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utilities, stores, supabase
│   ├── types/                # TypeScript types
│   └── data/                 # Static JSON data
├── shaders/                  # GLSL shaders
├── supabase/                 # Database migrations
├── package.json
└── tsconfig.json
```

See [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) for details.

---

## Deployment

### Vercel (Frontend)

1. Push code to GitHub
2. Import project to https://vercel.com
3. Add environment variables
4. Deploy

### Railway (Database)

1. Deploy Supabase to https://railway.app
2. Copy database credentials
3. Configure RLS policies

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## Development Phases

| Phase | Duration   | Deliverable                     |
| ----- | ---------- | ------------------------------- |
| 1-2   | Week 1-4   | Solar System 3D + Interactivity |
| 3-4   | Week 5-8   | Stellar + Constellations        |
| 5-6   | Week 9-12  | Exoplanet + Nebula + Galaxy     |
| 7-8   | Week 13-16 | Black Holes + Supabase Backend  |
| 9-10  | Week 17-20 | Quiz + i18n + Audio + Deploy    |

---

## Contributing

Contributions are welcome! Here's how to help:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Run quality checks: `npm run quality`
6. Submit a pull request

See [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for more details.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

- Planet textures from [Solar System Scope](https://www.solarsystemscope.com/textures/)
- Star catalog from [Hipparcos](https://www.cosmos.esa.int/web/hipparcos)
- Galaxy images from NASA/ESA/Hubble
- Supabase for backend services
- React Three Fiber for 3D rendering

---

## Contact

- Project Site: https://cosmic-explorer.vercel.app
- GitHub: https://github.com/yourusername/cosmic-explorer
- Issues: https://github.com/yourusername/cosmic-explorer/issues

---

## Screenshots

_To be added_ 📸

---

Made with 🌠 for space exploration and education
