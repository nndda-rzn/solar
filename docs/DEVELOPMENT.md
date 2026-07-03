# Development Guide

> Guide for developers working on the Interactive Cosmic Explorer project.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **yarn** package manager
- **Git** for version control
- **Git Bash** or **WSL2** on Windows
- **VS Code** (recommended) with extensions:
  - ESLint
  - Prettier
  - TypeScript Vue Plugin
  - Tailwind CSS IntelliSense
  - WebGL GLSL Editor (for shaders)

---

## Local Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/cosmic-explorer.git
cd cosmic-explorer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Setup

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Supabase (get from supabase.com dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Server-side only (Supabase)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Deployment (optional for local dev)
VERCEL_TOKEN=your-vercel-token
RAILWAY_API_TOKEN=your-railway-token
```

### 4. Supabase Local Development (Optional)

If you want to run Supabase locally:

```bash
# Install Supabase CLI
npm install -g supabase

# Start local Supabase
supabase start

# Stop when done
supabase stop
```

Local Supabase runs at `http://localhost:54321`

### 5. Download Textures

Textures are not committed (too large). Download them:

**Option A: Automated script** (if available)

```bash
npm run download-textures
```

**Option B: Manual download**

1. Download Solar System Scope 8K pack from https://www.solarsystemscope.com/textures/
2. Extract to `public/textures/solar-system/`
3. Verify structure:
   ```
   public/textures/solar-system/
   ├── sun/
   ├── mercury/
   ├── venus/
   ├── earth/
   ├── mars/
   ├── jupiter/
   ├── saturn/
   ├── uranus/
   ├── neptune/
   └── pluto/
   ```

### 6. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

---

## Project Scripts

```json
{
  "scripts": {
    "dev": "next dev",                    # Start dev server
    "build": "next build",                # Production build
    "start": "next start",                # Run production build
    "lint": "eslint src --fix",           # Lint & auto-fix
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\"",  # Format code
    "type-check": "tsc --noEmit",         # TypeScript check
    "test": "jest --watch",               # Run tests (watch mode)
    "test:ci": "jest --ci",               # Run tests (CI)
    "download-textures": "node scripts/download-textures.js"  # Download textures
  }
}
```

---

## Code Style

### ESLint & Prettier

All code is automatically formatted on commit (Husky pre-commit hook).

Manual formatting:

```bash
# Fix all issues
npm run lint

# Format all files
npm run format

# Type check
npm run type-check
```

### Naming Conventions

| Type       | Convention                                    | Example                                     |
| ---------- | --------------------------------------------- | ------------------------------------------- |
| Components | PascalCase                                    | `Planet.tsx`, `StarField.tsx`               |
| Hooks      | camelCase, prefix `use`                       | `usePlanetData.ts`, `useScaleTransition.ts` |
| Utils      | camelCase                                     | `calculateOrbitalPosition.ts`               |
| Types      | PascalCase                                    | `Planet.ts`, `Star.ts`                      |
| Constants  | UPPER_SNAKE_CASE                              | `MAX_SCALE`, `AU_IN_KM`                     |
| Files      | kebab-case (folders), PascalCase (components) | `solar-system/`, `Planet.tsx`               |
| Variables  | camelCase                                     | `selectedPlanet`, `orbitSpeed`              |
| Classes    | PascalCase                                    | `OrbitCalculator`                           |

### Code Style Rules

1. **Always use TypeScript** — No `any` types without `@ts-ignore` comment
2. **Functional components only** — No class components
3. **No commented-out code** — Delete or open an issue
4. **Descriptive variable names** — `x` is okay in math functions, not elsewhere
5. **Max line length:** 100 characters (for readability)
6. **Use const by default** — `let` only when reassignment needed, avoid `var`

### TypeScript Strict Mode

`tsconfig.json` enforces strict mode. All files must:

- Have explicit type annotations for function parameters/returns
- No implicit `any`
- Strict null checks enabled

---

## Git Workflow

### Branch Strategy

```
main (production)
  ↑
  └── develop (staging)
       ↑
       └── feature/*, bugfix/*, chore/*
```

**Branch naming:**

- `feature/solar-system-3d` — New features
- `bugfix/planet-rotation-speed` — Bug fixes
- `chore/update-dependencies` — Maintenance

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style (formatting, semicolons)
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Add/modify tests
- `chore:` Dependencies, build config

**Examples:**

```bash
git commit -m "feat(solar-system): add planet atmosphere shader"
git commit -m "fix(quiz): correct leaderboard sorting"
git commit -m "docs(readme): update setup instructions"
git commit -m "refactor(store): simplify scale transition logic"
```

### Pull Request Process

1. **Create feature branch from `develop`:**

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make commits:**

   ```bash
   git add .
   git commit -m "feat: your feature"
   ```

3. **Push to remote:**

   ```bash
   git push -u origin feature/your-feature-name
   ```

4. **Create PR on GitHub:**
   - Base branch: `develop`
   - Title: Clear description
   - Description: What changed, why, how to test

5. **Address review feedback:**

   ```bash
   git add .
   git commit -m "refactor: address review feedback"
   git push origin feature/your-feature-name
   ```

6. **Merge to `develop`:**
   - Use "Squash and merge" for clean history
   - Delete feature branch

7. **Merge `develop` to `main` for release:**
   ```bash
   git checkout main
   git pull origin main
   git merge --no-ff develop
   git tag v1.0.0  # Semantic versioning
   git push origin main --tags
   ```

---

## Testing

### Test File Location

Tests live next to the code they test:

```
src/
├── components/
│   ├── solar-system/
│   │   ├── planets/
│   │   │   ├── Planet.tsx
│   │   │   └── Planet.test.tsx        # Test file
│   │   └── Sun.test.tsx
├── hooks/
│   ├── usePlanetData.ts
│   └── usePlanetData.test.ts
└── utils/
    ├── astronomy.ts
    └── astronomy.test.ts
```

### Running Tests

```bash
# Watch mode (default in dev)
npm run test

# CI mode (single run)
npm run test:ci

# Specific file
npm run test -- usePlanetData.test.ts

# Coverage
npm run test -- --coverage
```

### Test Template

```typescript
// src/utils/astronomy.test.ts
import { calculateOrbitalPosition } from "./astronomy";

describe("calculateOrbitalPosition", () => {
  it("should calculate position at day 0", () => {
    const position = calculateOrbitalPosition({
      semiMajorAxis: 1,
      eccentricity: 0.0167,
      meanAnomaly: 0,
    });

    expect(position.x).toBeCloseTo(1, 5);
    expect(position.y).toBeCloseTo(0, 5);
  });

  it("should calculate position at day 90", () => {
    const position = calculateOrbitalPosition({
      semiMajorAxis: 1,
      eccentricity: 0.0167,
      meanAnomaly: Math.PI / 2,
    });

    expect(position.x).toBeCloseTo(0, 5);
    expect(position.y).toBeCloseTo(1, 5);
  });
});
```

---

## Debugging

### VS Code Debug Configuration

Create `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "console": "integratedTerminal"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "attach",
      "port": 3000,
      "urlFilter": "http://localhost/*",
      "pathMapping": {
        "/": "${workspaceRoot}",
        "/_next/": "${workspaceRoot}/.next/"
      }
    }
  ]
}
```

### Browser DevTools

1. Open Chrome DevTools (F12)
2. **Elements tab** — Inspect DOM
3. **Console tab** — Check errors/logs
4. **Sources tab** — Set breakpoints in TypeScript (auto-mapped)
5. **Network tab** — Monitor API calls
6. **Performance tab** — Profile frame rate (critical for 3D)

### Three.js Debugging

Install **Three.js Inspector** Chrome extension for scene debugging.

---

## Performance Optimization

### Key Metrics

- **First Paint (FP):** < 1s
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Frame Rate (3D):** 60 FPS target

### Lighthouse Audit

```bash
# Build then audit
npm run build
npm start

# Open Chrome, run Lighthouse (DevTools > Lighthouse tab)
```

Target scores:

- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

### Common Issues

| Issue                | Solution                                        |
| -------------------- | ----------------------------------------------- |
| Slow texture loading | Use compressed WebP, lazy load per scale        |
| Frame drops          | Check useFrame loop, reduce particle count      |
| Memory leak          | Dispose geometries/textures on scale transition |
| Large bundle         | Tree-shake unused components, code splitting    |

---

## Troubleshooting

### Issue: `Module not found` error

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart dev server
npm run dev
```

### Issue: TypeScript errors in VS Code but tests pass

```bash
# Restart TS server
Ctrl+Shift+P → TypeScript: Restart TS Server
```

### Issue: Textures not loading

1. Verify `public/textures/` folder structure
2. Check browser console for 404 errors
3. Verify texture file names match code imports

### Issue: Supabase connection fails

```bash
# Check env vars
echo $NEXT_PUBLIC_SUPABASE_URL

# Verify network connectivity
curl https://your-project.supabase.co/rest/v1/

# Check Supabase dashboard for API key validity
```

### Issue: Hot reload not working

```bash
# Clear cache and restart
rm -rf .next
npm run dev

# Or update file to trigger change detection
```

---

## Common Development Tasks

### Adding a New Planet

1. **Create component:** `src/components/solar-system/planets/NewPlanet.tsx`
2. **Add data:** Entry in `src/data/solar-system/planets.json`
3. **Add textures:** Files to `public/textures/solar-system/newplanet/`
4. **Test:** Render in scene, check orbit, verify textures
5. **Commit:** `feat(solar-system): add new planet`

### Adding a New Quiz Category

1. **Create questions:** `src/data/quiz/new-category.json`
2. **Update type:** Add to `src/types/quiz/category.ts`
3. **Create route:** `src/app/[locale]/quiz/[category]/page.tsx`
4. **Test:** Verify questions load, scoring works
5. **Add translation:** Entries in `src/messages/en/` and `src/messages/id/`

### Adding a New Shader

1. **Create shader files:**
   ```
   src/shaders/new-effect/
   ├── vertex.glsl
   └── fragment.glsl
   ```
2. **Create component:** `src/components/effects/NewEffect.tsx`
3. **Integrate:** Add to scene via post-processing or ShaderMaterial
4. **Test:** Verify visual output, check console for shader errors
5. **Optimize:** Profile GPU usage

### Updating Translation

1. Edit `src/messages/en/common.json` for English
2. Edit `src/messages/id/common.json` for Indonesian
3. Use same keys in both files
4. Test by toggling language in UI

---

## Resources

- **Next.js Docs:** https://nextjs.org/docs
- **React Three Fiber:** https://docs.pmndrs.io/react-three-fiber/
- **Three.js:** https://threejs.org/docs/
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Supabase:** https://supabase.com/docs
- **next-intl:** https://next-intl-docs.vercel.app/

---

## Getting Help

1. **Check existing issues:** https://github.com/yourusername/cosmic-explorer/issues
2. **Search documentation:** See [docs/](../docs/)
3. **Ask in discussions:** https://github.com/yourusername/cosmic-explorer/discussions
4. **Reach out to maintainers:** Include error logs, reproduction steps, environment details

---

## Maintenance Tasks

| Task                    | Frequency | Command                    |
| ----------------------- | --------- | -------------------------- |
| Update dependencies     | Monthly   | `npm update`               |
| Audit vulnerabilities   | Monthly   | `npm audit`                |
| Check outdated packages | Quarterly | `npm outdated`             |
| Clear old test files    | Monthly   | Check `coverage/`          |
| Archive old branches    | Quarterly | `git branch -d old-branch` |

---

## What Not To Do

❌ Commit `.env.local` or any secrets
❌ Use `any` type without justification
❌ Leave console.log statements
❌ Commit commented-out code
❌ Use relative imports across domains
❌ Modify `tsconfig.json` without discussion
❌ Force push to `main` or `develop`
❌ Merge without code review

---

**Next:** [SETUP.md](SETUP.md) for environment setup details
