# Deployment Guide

> Complete guide for deploying Interactive Cosmic Explorer to Vercel and Railway.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           USER BROWSER                          │
└─────────────┬───────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│         VERCEL (Frontend)                       │
│  - Next.js application                          │
│  - Static assets                                │
│  - Edge functions                               │
│  - CDN distribution                             │
└─────────────┬───────────────────────────────────┘
              │
              ↓
┌─────────────────────────────────────────────────┐
│        RAILWAY (Backend)                        │
│  - Supabase (PostgreSQL)                        │
│  - Auth service                                 │
│  - Realtime subscriptions                       │
└─────────────────────────────────────────────────┘
```

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway account (free tier available)
- Project pushed to GitHub repository

---

## Part 1: Deploy Supabase to Railway

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub
3. Verify email

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy Postgres"**
3. Name it: `cosmic-explorer-db`
4. Wait for deployment (~2 minutes)

### Step 3: Get Database Credentials

1. Click on Postgres service
2. Go to **"Variables"** tab
3. Note these values:
   ```
   DATABASE_URL=postgresql://...
   POSTGRES_HOST=...
   POSTGRES_PORT=5432
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=...
   POSTGRES_DB=railway
   ```

### Step 4: Deploy Supabase

**Option A: Using Supabase Cloud (Recommended)**

1. Go to https://supabase.com/dashboard
2. Create new project
3. Select region (closest to users)
4. Set database password
5. Wait for setup (~2 minutes)
6. Go to **Settings → API**
7. Copy:
   ```
   Project URL
   Anon public key
   Service role secret
   ```

**Option B: Self-hosted Supabase on Railway**

1. Create new Railway project
2. Add service from GitHub: `supabase/supabase`
3. Set environment variables from Step 3
4. Deploy

### Step 5: Run Database Migrations

**Using Supabase Dashboard:**

1. Go to SQL Editor
2. Copy contents from `supabase/migrations/001_init.sql`
3. Execute

**Using Supabase CLI:**

```bash
# Link to remote project
supabase link --project-ref your-project-ref

# Push migrations
supabase db push
```

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Push Code to GitHub

```bash
git add .
git commit -m "chore: prepare for deployment"
git push origin main
```

### Step 2: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub
3. Grant Vercel access to repositories

### Step 3: Import Project

1. Click **"New Project"**
2. Import `cosmic-explorer` repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

### Step 4: Set Environment Variables

In Vercel project settings → **Environment Variables**, add:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Server-side only
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

**Production vs Preview:**

- Set for **"Production"** branch: `main`
- Set for **"Preview"** branches: `develop`, feature branches

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build (~3-5 minutes)
3. Check deployment logs for errors
4. Visit deployment URL

Expected output:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (10/10)
✓ Finalizing page optimization

Build completed
```

### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add custom domain: `cosmic-explorer.com`
3. Configure DNS:
   - Type: `CNAME`
   - Name: `@` or `www`
   - Value: `cname.vercel-dns.com`
4. Wait for DNS propagation (~1 hour)

---

## Part 3: Post-Deployment Configuration

### Enable CORS

In Supabase dashboard → **Authentication → URL Configuration**:

```
Site URL: https://cosmic-explorer.vercel.app
Redirect URLs:
  - https://cosmic-explorer.vercel.app/**
  - http://localhost:3000/** (for local dev)
```

### Configure OAuth Providers

**Google OAuth:**

1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Set authorized redirect URI:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
4. Copy Client ID and Client Secret
5. In Supabase → **Authentication → Providers → Google**:
   - Paste Client ID
   - Paste Client Secret
   - Enable provider

### Set Up Analytics (Optional)

**Vercel Analytics:**

1. In Vercel project → **Analytics**
2. Enable Web Analytics
3. Add to `_app.tsx`:
   ```typescript
   import { Analytics } from '@vercel/analytics/react'

   function MyApp({ Component, pageProps }) {
     return (
       <>
         <Component {...pageProps} />
         <Analytics />
       </>
     )
   }
   ```

**Google Analytics:**

1. Create GA4 property
2. Copy Measurement ID
3. Add to environment variables: `NEXT_PUBLIC_GA_ID`
4. Add to `_app.tsx`:
   ```typescript
   import Script from 'next/script'

   <Script
     strategy="afterInteractive"
     src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
   />
   ```

---

## Part 4: Continuous Deployment

### Automatic Deployments

Vercel automatically deploys on git push:

| Branch      | Deploys To | URL                                        |
| ----------- | ---------- | ------------------------------------------ |
| `main`      | Production | cosmic-explorer.vercel.app                 |
| `develop`   | Preview    | cosmic-explorer-git-develop.vercel.app     |
| `feature/*` | Preview    | cosmic-explorer-git-feature-xyz.vercel.app |

### Deployment Workflow

```bash
# Make changes
git checkout -b feature/new-feature
# ... make changes ...
git commit -m "feat: add new feature"
git push origin feature/new-feature

# Create PR on GitHub
# Vercel auto-deploys preview
# Review preview URL
# Merge to develop (preview deployment)
# Merge to main (production deployment)
```

### Rollback

If production deployment has issues:

**Option 1: Vercel Dashboard**

1. Go to **Deployments**
2. Find previous working deployment
3. Click **"..."** → **"Promote to Production"**

**Option 2: Git Revert**

```bash
git revert HEAD
git push origin main
```

---

## Part 5: Performance Optimization

### Enable Vercel Edge Network

Already enabled by default. Vercel automatically:

- Serves static assets from CDN
- Caches API responses
- Compresses images

### Configure Next.js Image Optimization

In `next.config.ts`:

```typescript
const config = {
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    domains: ["your-project.supabase.co"],
  },
};
```

### Enable Compression

In `next.config.ts`:

```typescript
const config = {
  compress: true, // Gzip compression
};
```

### Configure Cache Headers

For static assets in `public/`:

```typescript
// next.config.ts
const config = {
  async headers() {
    return [
      {
        source: "/textures/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

---

## Part 6: Monitoring & Logging

### Vercel Logs

View real-time logs:

1. Go to project → **Logs**
2. Filter by:
   - Deployment
   - Environment (production/preview)
   - Time range

### Supabase Logs

View database logs:

1. Supabase dashboard → **Logs**
2. Select log type:
   - Postgres
   - Auth
   - Realtime
   - API

### Error Tracking (Optional)

**Sentry Integration:**

```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.VERCEL_ENV || "development",
});
```

---

## Part 7: Security

### Environment Variables

**Never commit:**

- `.env.local`
- `.env.production`
- Any files with secrets

**Always:**

- Use environment variables for secrets
- Set in Vercel dashboard
- Prefix public vars with `NEXT_PUBLIC_`

### Content Security Policy

Add to `next.config.ts`:

```typescript
const config = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://*.supabase.co",
            ].join("; "),
          },
        ],
      },
    ];
  },
};
```

### HTTPS Only

Vercel enforces HTTPS by default. To redirect HTTP → HTTPS:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.headers.get("x-forwarded-proto") !== "https") {
    return NextResponse.redirect(
      `https://${request.headers.get("host")}${request.nextUrl.pathname}`,
      301,
    );
  }
}
```

---

## Part 8: Troubleshooting

### Build Fails

**Error: "Module not found"**

```bash
# Clear cache and rebuild
vercel --prod --force
```

**Error: "Type error"**

```bash
# Run type check locally
npm run type-check

# Fix errors, commit, push
```

### Runtime Errors

**Error: "Supabase connection refused"**

- Check environment variables are set in Vercel
- Verify Supabase project is live
- Check CORS configuration

**Error: "Texture not loading"**

- Verify files exist in `public/` folder
- Check file paths (case-sensitive)
- Verify Vercel is serving static files

### Performance Issues

**Slow initial load:**

- Check bundle size: `npm run build` → check output
- Optimize images: Convert to WebP
- Enable code splitting

**Low frame rate:**

- Profile in Chrome DevTools → Performance
- Reduce particle count
- Lower texture resolution

---

## Part 9: Scaling

### Vercel Limits (Free Tier)

- 100 GB bandwidth/month
- 100 builds/day
- 10 serverless functions
- 1 concurrent build

**Upgrade to Pro:**

- Unlimited bandwidth
- Unlimited builds
- Better support

### Supabase Limits (Free Tier)

- 500 MB database
- 1 GB file storage
- 2 GB bandwidth/month
- 50k monthly active users

**Upgrade to Pro:**

- 8 GB database
- 100 GB file storage
- 250 GB bandwidth/month

---

## Part 10: Backup & Recovery

### Database Backups

**Automatic (Supabase):**

- Daily backups (retained 7 days)
- Point-in-time recovery

**Manual:**

```bash
# Export database
supabase db dump -f backup.sql

# Restore
psql -h your-host -U postgres railway < backup.sql
```

### Code Backups

- GitHub repository (version controlled)
- Vercel deployment history (instant rollback)

---

## Deployment Checklist

Before deploying to production:

- [ ] All tests pass (`npm run test:ci`)
- [ ] Type check passes (`npm run type-check`)
- [ ] Lint check passes (`npm run lint`)
- [ ] Environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Supabase RLS policies configured
- [ ] OAuth providers configured
- [ ] Custom domain configured (if applicable)
- [ ] Analytics configured (if applicable)
- [ ] Error tracking configured (if applicable)
- [ ] README.md updated
- [ ] CHANGELOG.md updated

---

## Related Documentation

- [SETUP.md](SETUP.md) — Local setup
- [DEVELOPMENT.md](DEVELOPMENT.md) — Development workflow
- [ARCHITECTURE.md](ARCHITECTURE.md) — System design
