# Quick Start Guide

> Get up and running in 10 minutes.

---

## Step 1: Setup Environment (5 minutes)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/cosmic-explorer.git
cd cosmic-explorer

# 2. Install dependencies
npm install

# 3. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials (see below)
```

**Get Supabase credentials:**

1. Go to https://supabase.com/dashboard
2. Create free project
3. Settings → API → Copy URL + Anon Key
4. Paste in `.env.local`

---

## Step 2: Download Textures (2 minutes)

```bash
# Download Solar System Scope 8K pack
# https://www.solarsystemscope.com/textures/

# Extract to public/textures/solar-system/
# Structure:
# public/textures/solar-system/
# ├── sun/
# ├── earth/
# ├── jupiter/
# └── ... (all 8 planets)
```

---

## Step 3: Run Dev Server (1 minute)

```bash
npm run dev
```

**Expected output:**

```
✓ Ready in 2.5s
- Local: http://localhost:3000
```

Open http://localhost:3000 in browser.

---

## Step 4: Test Everything (2 minutes)

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Run tests
npm run test
```

All should pass ✅

---

## Quick Commands Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run start            # Run production build

# Quality
npm run type-check       # TypeScript check
npm run lint             # Lint and fix
npm run format           # Format code

# Testing
npm run test             # Run tests (watch)
npm run test:ci          # Run tests (CI)
```

---

## What You Should See

When dev server runs successfully:

1. **Landing Page** — Cosmic Explorer intro
2. **3D Solar System** — Sun + 8 planets orbiting
3. **Click Interactions** — Click planet → info panel
4. **Controls** — Speed slider, pause button
5. **Multi-scale** — Zoom out to see stars/galaxy

---

## Common Issues & Fixes

| Problem                | Solution                                        |
| ---------------------- | ----------------------------------------------- |
| `Module not found`     | Run `rm -rf node_modules && npm install`        |
| `Port 3000 in use`     | `lsof -i :3000                                  | awk '{print $2}' | xargs kill -9` |
| `Textures not loading` | Verify files in `public/textures/solar-system/` |
| `Supabase connection`  | Check `.env.local` has correct URL + key        |

---

## Next Steps

1. ✅ Read [docs/SETUP.md](docs/SETUP.md) for detailed setup
2. 📚 Read [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) for workflow
3. 🏗️ Check [docs/phase-guides/PHASE_1.md](docs/phase-guides/PHASE_1.md) for next tasks
4. 📖 Explore [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md)

---

## Need Help?

- **Documentation:** See [docs/](docs/) folder
- **Issues:** https://github.com/yourusername/cosmic-explorer/issues
- **Discussions:** https://github.com/yourusername/cosmic-explorer/discussions

---

**Happy coding! 🌠**
