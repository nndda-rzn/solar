# Setup Instructions

> Complete environment setup for local development and deployment.

---

## Local Development Setup

### Step 1: System Requirements

**Windows:**

- Windows 10 or later
- Node.js 18+ LTS
- Git Bash or WSL2

**macOS:**

- macOS 10.15+
- Homebrew (optional but recommended)
- Node.js 18+

**Linux:**

- Ubuntu 18.04+ or equivalent
- Node.js 18+

### Step 2: Install Node.js

**Using Node Version Manager (Recommended)**

**Windows (nvm-windows):**

```bash
# Download and run installer from:
# https://github.com/coreybutler/nvm-windows/releases

# Then:
nvm install 18
nvm use 18
```

**macOS/Linux (nvm):**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

**Direct Installation:**
Download from https://nodejs.org (LTS version)

**Verify installation:**

```bash
node --version    # Should be v18.x.x or later
npm --version     # Should be 8.x.x or later
```

### Step 3: Clone Repository

```bash
git clone https://github.com/yourusername/cosmic-explorer.git
cd cosmic-explorer
```

### Step 4: Install Project Dependencies

```bash
npm install
```

This installs all packages from `package.json`, including:

- Next.js, React
- React Three Fiber, Drei, Three.js
- Supabase client
- Tailwind CSS
- ESLint, Prettier

### Step 5: Environment Variables

Create `.env.local` file in project root:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# === PUBLIC VARIABLES (visible in browser) ===

# Supabase API (get from supabase.com dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# === PRIVATE VARIABLES (server-side only) ===

# Supabase service role (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Deployment (optional, only needed for deploy)
VERCEL_TOKEN=your-vercel-token-here
RAILWAY_API_TOKEN=your-railway-token-here
```

**How to get Supabase keys:**

1. Go to https://supabase.com/dashboard
2. Create new project or select existing
3. Settings → API (left sidebar)
4. Copy `URL` and `anon public key`
5. Copy `Service Role secret` (keep private!)

### Step 6: Download Textures

Textures are large (500MB+), not committed to git.

**Automated (if script exists):**

```bash
npm run download-textures
```

**Manual:**

1. Download Solar System Scope 8K pack:
   - Go to https://www.solarsystemscope.com/textures/
   - Download 8K PNG pack (free)

2. Extract to `public/textures/solar-system/`

3. Verify folder structure:
   ```
   public/textures/
   └── solar-system/
       ├── sun/
       │   ├── diffuse.png
       │   └── normal.png
       ├── mercury/
       │   ├── diffuse.png
       │   └── normal.png
       ├── venus/
       ├── earth/
       │   ├── diffuse.png
       │   ├── normal.png
       │   ├── specular.png
       │   ├── emissive.png  (night lights)
       │   └── clouds.png
       ├── mars/
       ├── jupiter/
       ├── saturn/
       │   ├── diffuse.png
       │   ├── normal.png
       │   └── rings.png     (with alpha channel)
       ├── uranus/
       ├── neptune/
       └── pluto/
   ```

### Step 7: Run Development Server

```bash
npm run dev
```

Expected output:

```
> cosmic-explorer@1.0.0 dev
> next dev

  ▲ Next.js 14.0.0
  - Local:        http://localhost:3000
  - Environments: .env.local

✓ Ready in 2.5s
```

Open http://localhost:3000 in your browser.

---

## Supabase Local Development (Optional)

Run Supabase locally for faster development:

### Install Supabase CLI

```bash
npm install -g supabase
```

### Start Local Supabase

```bash
supabase start
```

This:

- Starts PostgreSQL database (localhost:5432)
- Starts PostgREST API (localhost:54321)
- Creates seed data from migrations
- Prints credentials

Output includes:

```
Local URL: http://localhost:54321
Anon Key: eyJhbGc...
Service role key: eyJhbGc...
```

### Update .env.local for Local Supabase

```env
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Run Database Migrations

```bash
supabase migration list  # View migrations
supabase db reset        # Reset to latest migration
```

### Stop Local Supabase

```bash
supabase stop
```

---

## Project Scripts

### Development

```bash
# Start dev server
npm run dev

# Type check only
npm run type-check

# Lint and fix code
npm run lint

# Format code
npm run format

# Run all quality checks
npm run lint && npm run type-check && npm run test:ci
```

### Testing

```bash
# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:ci

# Run tests with coverage
npm run test -- --coverage
```

### Build & Deploy

```bash
# Build for production
npm run build

# Start production server locally
npm start

# Build and run locally (test production build)
npm run build && npm start
```

### Assets

```bash
# Download textures and assets
npm run download-textures
```

---

## Database Setup (First Time)

If starting with fresh Supabase instance:

### Option 1: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. SQL Editor (left sidebar)
4. Copy contents of `supabase/migrations/001_init.sql`
5. Paste into editor and run

### Option 2: Using CLI (Local)

```bash
supabase db reset
```

This runs all migrations in `supabase/migrations/` folder.

### What Gets Created

- `auth.users` — User accounts
- `public.bookmarks` — Saved celestial objects
- `public.quiz_results` — Quiz scores
- `public.user_progress` — Learning progress
- `public.analytics` — Event tracking
- RLS policies for security

---

## VS Code Setup (Recommended)

### Install Extensions

Open VS Code and install:

1. **ESLint** — Microsoft
2. **Prettier - Code formatter** — Prettier
3. **TypeScript Vue Plugin** — Vue
4. **Tailwind CSS IntelliSense** — Tailwind Labs
5. **WebGL GLSL Editor** — Wrnr
6. **REST Client** — Huachao Mao (optional)

### Create Workspace Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Browser Setup

### Required

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

### Recommended Extensions

**Chrome/Edge:**

- React DevTools
- Redux DevTools
- Three.js Inspector

**Firefox:**

- React DevTools
- Redux DevTools

---

## Verify Installation

Run this to verify everything is set up:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check git
git --version

# Check Next.js installation
npm list next

# Check TypeScript
npm list typescript

# Type check project
npm run type-check

# Run linter
npm run lint

# Start dev server (Ctrl+C to stop)
npm run dev
```

All should complete without errors.

---

## Troubleshooting

### Problem: `npm install` fails

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem: Port 3000 already in use

**Solution (Windows):**

```bash
# Find process on port 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
taskkill /PID <PID> /F

# Or use different port
npm run dev -- -p 3001
```

**Solution (macOS/Linux):**

```bash
# Find process on port 3000
lsof -i :3000

# Kill process (replace PID)
kill -9 <PID>

# Or use different port
npm run dev -- -p 3001
```

### Problem: TypeScript errors in VS Code

**Solution:**

```bash
# Restart TS server in VS Code
Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)
> TypeScript: Restart TS Server
```

### Problem: Textures not loading (404 errors)

**Solution:**

1. Verify files exist in `public/textures/`
2. Check file names match code imports
3. Verify folder structure matches expected layout
4. Restart dev server

### Problem: Supabase connection refused

**Solution:**

1. Verify `.env.local` has correct URL and keys
2. Check Supabase project is live (supabase.com dashboard)
3. Verify network connectivity: `ping supabase.com`
4. Clear browser cache and restart dev server

### Problem: Module not found errors

**Solution:**

```bash
# Clear Next.js cache
rm -rf .next

# Verify imports use correct paths
grep -r "from '@/" src/

# Restart dev server
npm run dev
```

---

## Next Steps

1. ✅ Complete setup above
2. 📚 Read [DEVELOPMENT.md](DEVELOPMENT.md) for development workflow
3. 🏗️ Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
4. 📁 Read [FOLDER_STRUCTURE.md](FOLDER_STRUCTURE.md) for file organization
5. 🚀 Start with Phase 1: `docs/phase-guides/PHASE_1.md`

---

## Getting Help

- **Documentation:** See `docs/` folder
- **Issues:** https://github.com/yourusername/cosmic-explorer/issues
- **Discussions:** https://github.com/yourusername/cosmic-explorer/discussions
