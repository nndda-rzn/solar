# SaaS-Grade Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans`. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Meningkatkan kematangan Cosmic Explorer ke standar SaaS production-readiness secara terfokus untuk kebutuhan Tugas Akhir — tanpa overengineering enterprise (Sentry, E2E, Docker, rate limiting, analytics pipeline di-skip).

**Architecture:** Pendekatan dua fase — **Phase A: Essential** (mencegah crash saat demo, baseline SEO + perf, env safety) dan **Phase B: Polish** (cover a11y kecil, test coverage enforcement, TS strictness tambahan). Setiap fase menghasilkan perubahan self-contained yang bisa di-commit terpisah.

**Tech Stack:** Next.js 14 App Router, TypeScript 5, React 18, next-intl, Tailwind v4, Zustand, Supabase SSR, Zod (baru ditambah), Jest 30.

**Branch:** `feature/saas-ta-optimization`

---

## File Map

**File baru (dibuat):**

- `src/lib/env.ts` — Zod schema runtime validation untuk env vars
- `src/app/global-error.tsx` — fallback error fatal di root
- `src/app/[locale]/not-found.tsx` — halaman 404 kosmik + locale-aware
- `src/app/sitemap.ts` — sitemap dinamis untuk EN/ID routes
- `src/app/[locale]/robots.ts` — robots.txt per locale
- `src/app/[locale]/loading.tsx` — fallback loading untuk route explorer
- `src/app/[locale]/dashboard/loading.tsx` — loading untuk dashboard
- `src/app/[locale]/profile/loading.tsx` — loading untuk profile
- `src/app/[locale]/library/loading.tsx` — loading untuk library
- `src/components/ui/Skeleton.tsx` — primitive skeleton (text/circle/rect)

**File dimodifikasi:**

- `package.json` — tambah `zod` dep + `check-env` script
- `next.config.mjs` — security headers (CSP, HSTS, X-Frame-Options, dll) + `next/font` config
- `src/app/layout.tsx` — `next/font` setup + metadata lengkap (OG, Twitter, robots, alternates)
- `src/app/[locale]/layout.tsx` — `generateMetadata` locale-aware
- `src/app/[locale]/error.tsx` — sanitasi `error.message`, tampilkan `digest`, TIDAK bocor stack di production
- `src/app/[locale]/page.tsx` — wrap `CosmicExplorer` dengan `next/dynamic({ ssr: false })`
- `src/utils/supabase/client.ts` — pakai `env.NEXT_PUBLIC_SUPABASE_URL` (tanpa `!`)
- `src/utils/supabase/server.ts` — sama
- `src/utils/supabase/middleware.ts` — sama
- `src/scripts/seed.ts` — pakai `env` helper
- `src/hooks/useBookmarks.ts` — pipe `catch` ke `useToast().push({ variant: "error" })`
- `src/hooks/useProgress.ts` — sama
- `src/hooks/useAchievements.ts` — sama
- `jest.config.js` — `coverageThreshold` 70/75/75/75
- `tsconfig.json` — tambah `noUncheckedIndexedAccess`, `noImplicitOverride`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`
- `.env.example` — split PUBLIC/SERVER sections + komentar

**File dicek/dipertahankan:**

- `tailwind.config.ts` — dikosongkan karena Tailwind v4 pakai CSS-first di `globals.css` (sudah benar)
- `src/app/globals.css` — sudah pakai `@theme {}` block yang benar untuk v4

---

## Phase A: Essential (1 hari kerja)

### A1. Install zod & buat env validation utility

**Files:**

- Modify: `package.json`
- Create: `src/lib/env.ts`

**Tujuan:** Hilangkan 8 `process.env.X!` non-null assertions yang bisa crash runtime. Substitusi dengan Zod schema yang memvalidasi saat module load.

- [ ] **Step 1: Install dependencies**

```bash
npm install zod
```

Verify `package.json` now shows `"zod": "^3.x.x"` in `dependencies`.

- [ ] **Step 2: Buat `src/lib/env.ts`**

File baru:

```ts
import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z
    .string()
    .min(20, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be at least 20 chars"),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(20, "SUPABASE_SERVICE_ROLE_KEY must be at least 20 chars")
    .optional(),
  VERCEL_TOKEN: z.string().optional(),
  RAILWAY_API_TOKEN: z.string().optional(),
});

const parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  VERCEL_TOKEN: process.env.VERCEL_TOKEN,
  RAILWAY_API_TOKEN: process.env.RAILWAY_API_TOKEN,
});

if (!parsed.success) {
  const formatted = parsed.error.flatten().fieldErrors;
  const messages = Object.entries(formatted)
    .map(([key, errs]) => `  - ${key}: ${errs?.join(", ") ?? "invalid"}`)
    .join("\n");
  throw new Error(
    `Environment validation failed:\n${messages}\n` +
      `Copy .env.example to .env.local and fill in the required vars.`,
  );
}

export const env = parsed.data;
```

- [ ] **Step 3: Replace assertions di Supabase clients**

Modify `src/utils/supabase/client.ts`:

```ts
import { createBrowserClient } from "@supabase/ssr";
import { env } from "@/lib/env";

export function createClient() {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}
```

Modify `src/utils/supabase/server.ts` (ganti `process.env.X!` jadi `env.X` di `createServerClient(...)`):

```ts
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Ignore — setAll from Server Component; middleware handles refresh.
          }
        },
      },
    },
  );
}
```

Modify `src/utils/supabase/middleware.ts` (same pattern):

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { supabaseResponse, user };
}
```

Modify `src/scripts/seed.ts` (top imports + awal):

```ts
import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import path from "path";
import { env } from "@/lib/env";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error(
    "[seed] SUPABASE_SERVICE_ROLE_KEY is required. " +
      "Get the key from Supabase Dashboard → Settings → API.",
  );
  process.exit(1);
}
```

(Pisahkan validasi runtime: kalau var env hilang sama sekali, helper `env` akan throw di awal sebelum sampai sini. Pesan khusus hanya untuk SERVICE_ROLE_KEY yang opsional.)

- [ ] **Step 4: Verifikasi type-check passes**

```bash
npm run type-check
```

Expected: tidak ada error baru. Jika ada error dari `env` import path, pastikan `@/lib/*` di `tsconfig.json` paths cocok.

- [ ] **Step 5: Verifikasi runtime safety**

Set `SUPABASE_SERVICE_ROLE_KEY` di `.env.local` lalu:

```bash
npm run db:seed -- --clear
```

Expected: command berjalan tanpa crash. Jika env kosong, harus throw error informatif (bukan silent crash).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json src/lib/env.ts src/utils/supabase/ src/scripts/seed.ts
git commit -m "feat(env): add zod runtime validation for environment variables"
```

---

### A2. Tambah security headers di next.config.mjs

**Files:**

- Modify: `next.config.mjs`

**Tujuan:** Standard SaaS baseline — Cegah clickjacking, MIME sniffing, mixed content, dan supply-chain injection.

- [ ] **Step 1: Tambahkan `headers()` function**

Ganti seluruh isi `next.config.mjs` jadi:

```mjs
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }],
  },
  experimental: {
    optimizePackageImports: [
      "three",
      "@react-three/fiber",
      "@react-three/drei",
    ],
  },

  async headers() {
    const isProd = process.env.NODE_ENV === "production";
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          ...(isProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload",
                },
              ]
            : []),
        ],
      },
    ];
  },

  webpack: (config) => {
    config.module.rules.push({
      test: /\.glsl$/,
      type: "asset/source",
    });
    return config;
  },
};

export default withNextIntl(nextConfig);
```

Notes:

- `'unsafe-inline'` untuk `script-src` & `style-src` dibutuhkan agar Three.js shader hot-reload + framer-motion tidak break di dev. Untuk production-grade full strict CSP perlu Next.js nonce (di luar scope TA).
- `*.supabase.co` di `connect-src` penting agar Supabase API + Realtime WebSocket (`wss`) berfungsi.
- `frame-ancestors 'none'` + `X-Frame-Options: DENY` = double protection anti-clickjacking.

- [ ] **Step 2: Verifikasi dev server tetap jalan**

```bash
npm run dev
```

Buka `http://localhost:3000/en/dashboard`. Pastikan tidak ada console error CSP warning dari Supabase/Three.js. Jika ada, tambah domain yang dibutuhkan ke whitelist.

- [ ] **Step 3: Verifikasi production build**

```bash
npm run type-check
npm run lint
npm run build
```

Expected: build sukses tanpa warning baru. `headers()` function tidak boleh menyebabkan type error.

- [ ] **Step 4: Commit**

```bash
git add next.config.mjs
git commit -m "feat(security): add CSP, HSTS, clickjacking and MIME-sniff headers"
```

---

### A3. Tambah `global-error.tsx` + sanitasi `error.tsx`

**Files:**

- Create: `src/app/global-error.tsx`
- Modify: `src/app/[locale]/error.tsx`

**Tujuan:** Error fatal di luar locale scope (mis. layout crash) tidak lagi menampilkan layar putih Next default. Error per-route tidak bocor stack trace internal ke user.

- [ ] **Step 1: Buat `src/app/global-error.tsx`**

```tsx
"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          background: "#0d1117",
          color: "#e6edf3",
          fontFamily: "system-ui, sans-serif",
          margin: 0,
          padding: "48px 24px",
        }}
      >
        <main style={{ maxWidth: 480, margin: "0 auto", textAlign: "center" }}>
          <h1 style={{ color: "#4a9eff", fontSize: 28, marginBottom: 12 }}>
            Something went wrong
          </h1>
          <p style={{ color: "#9aa4af", marginBottom: 24 }}>
            The application failed to start. Please try again.
          </p>
          {error.digest ? (
            <p style={{ fontSize: 12, color: "#6b7280", marginBottom: 24 }}>
              Reference: {error.digest}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => reset()}
            style={{
              border: "1px solid #4a9eff",
              background: "transparent",
              color: "#4a9eff",
              padding: "10px 24px",
              borderRadius: 6,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
```

Catatan: `global-error.tsx` HARUS include `<html>` dan `<body>` sendiri karena ia menggantikan root layout yang crash.

- [ ] **Step 2: Modifikasi `src/app/[locale]/error.tsx`**

Ganti seluruh isi dengan:

```tsx
"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error("[error]", error);
  }, [error]);

  const isProd = process.env.NODE_ENV === "production";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-8 text-white">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-cosmic-accent/40 bg-cosmic-accent/20 p-8 text-center">
        <h1 className="text-2xl font-bold text-cosmic-accent">
          {t("error.title")}
        </h1>
        <p className="text-white/50">{t("error.description")}</p>
        {isProd ? (
          error.digest ? (
            <p className="font-mono text-xs text-white/40">
              Reference: {error.digest}
            </p>
          ) : null
        ) : (
          <pre className="overflow-x-auto rounded border border-red-500/40 bg-red-950/40 p-4 text-left text-sm text-red-400">
            {error.message}
          </pre>
        )}
        <button
          onClick={reset}
          className="rounded border border-cosmic-accent/40 bg-cosmic-accent/20 px-6 py-2 font-medium text-cosmic-accent transition hover:bg-cosmic-accent/40"
        >
          {t("error.retry")}
        </button>
      </div>
    </div>
  );
}
```

Perubahan kunci:

- Di production, tampilkan hanya `error.digest` (server-generated ID), BUKAN raw stack trace.
- Di development (NODE_ENV !== 'production'), tetap tampilkan `error.message` untuk debugging.

- [ ] **Step 3: Verifikasi**

```bash
npm run build
npm run dev
```

Buka `http://localhost:3000/en/dashboard`. Klik kanan → Inspect → Console → tidak ada error tanpa pesan. Trigger error dengan refresh setelah simulate network failure → layar error muncul tanpa menampilkan info server.

- [ ] **Step 4: Commit**

```bash
git add src/app/global-error.tsx src/app/[locale]/error.tsx
git commit -m "feat(error): add global-error boundary and sanitize error details in production"
```

---

### A4. Buat Skeleton component + loading.tsx per route

**Files:**

- Create: `src/components/ui/Skeleton.tsx`
- Create: `src/app/[locale]/loading.tsx`
- Create: `src/app/[locale]/dashboard/loading.tsx`
- Create: `src/app/[locale]/profile/loading.tsx`
- Create: `src/app/[locale]/library/loading.tsx`

**Tujuan:** Tidak ada layar kosong saat navigasi route. Tenant merasa app responsive.

- [ ] **Step 1: Buat `src/components/ui/Skeleton.tsx`**

```tsx
import { clsx } from "clsx";

export interface SkeletonProps {
  variant?: "text" | "circle" | "rect";
  width?: string | number;
  height?: string | number;
  className?: string;
  lines?: number;
}

export function Skeleton({
  variant = "text",
  width,
  height,
  className,
  lines = 1,
}: SkeletonProps) {
  const baseClass = "animate-pulse bg-cosmic-nebula/60 rounded";
  const sizeStyle = {
    width: typeof width === "number" ? `${width}px` : width,
    height: typeof height === "number" ? `${height}px` : height,
  };

  if (variant === "text") {
    if (lines > 1) {
      return (
        <div className={clsx("space-y-2", className)} style={sizeStyle}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={clsx(
                baseClass,
                i === lines - 1 ? "w-3/4" : "w-full",
                "h-3",
              )}
            />
          ))}
        </div>
      );
    }
    return (
      <div
        className={clsx(baseClass, "h-3", className)}
        style={{ width: width ?? "100%", ...sizeStyle }}
      />
    );
  }

  return (
    <div
      className={clsx(baseClass, className)}
      style={{
        width: width ?? "100%",
        height: height ?? "1rem",
        ...sizeStyle,
      }}
    />
  );
}
```

- [ ] **Step 2: Buat `src/app/[locale]/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-cosmic-deep">
      <div className="w-full max-w-4xl space-y-6 p-8">
        <Skeleton variant="rect" height={32} width="40%" />
        <Skeleton variant="text" lines={3} />
        <div className="grid grid-cols-3 gap-4 pt-8">
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
          <Skeleton variant="rect" height={120} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Buat `src/app/[locale]/dashboard/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full gap-6 bg-cosmic-deep p-6">
      <Skeleton variant="rect" width={240} className="rounded-lg" />
      <div className="flex-1 space-y-4">
        <Skeleton variant="rect" height={48} />
        <Skeleton variant="rect" height={200} />
        <Skeleton variant="text" lines={4} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Buat `src/app/[locale]/profile/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-start justify-center bg-cosmic-deep p-6">
      <div className="w-full max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton variant="circle" width={80} height={80} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" />
            <Skeleton variant="text" width="60%" />
          </div>
        </div>
        <Skeleton variant="rect" height={200} />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Buat `src/app/[locale]/library/loading.tsx`**

```tsx
import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full flex-col bg-cosmic-deep p-6">
      <Skeleton variant="rect" height={40} width="50%" />
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} variant="rect" height={160} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Verifikasi dev server menunjukkan skeleton saat navigasi**

```bash
npm run dev
```

Lihat di browser: navigate `/en/library` ke `/en/dashboard`. Library page diganti Skeleton bricks selama ~200ms ke dashboard. Tab network → throttle "Slow 3G" → verify skeleton tetap muncul (tidak ada flash kosong).

- [ ] **Step 7: Commit**

```bash
git add src/components/ui/Skeleton.tsx src/app/[locale]/loading.tsx src/app/[locale]/dashboard/loading.tsx src/app/[locale]/profile/loading.tsx src/app/[locale]/library/loading.tsx
git commit -m "feat(loading): add Skeleton component and per-route loading fallbacks"
```

---

### A5. Lengkapi metadata + next/font + next/dynamic untuk CosmicExplorer

**Files:**

- Modify: `src/app/layout.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`

**Tujuan:** SEO score Lighthouse = A. First-load lebih cepat karena Scene di-defer. Tidak ada font flash.

- [ ] **Step 1: Modifikasi `src/app/layout.tsx` dengan `next/font` + metadata penuh**

Ganti seluruh isi:

```tsx
import type { Metadata, Viewport } from "next";
import { getLocale } from "next-intl/server";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#080b14",
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Interactive Cosmic Explorer",
    template: "%s | Cosmic Explorer",
  },
  description:
    "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  keywords: [
    "astronomy",
    "3D",
    "interactive",
    "solar system",
    "education",
    "space exploration",
  ],
  authors: [{ name: "Cosmic Explorer Team" }],
  creator: "Cosmic Explorer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Interactive Cosmic Explorer",
    title: "Interactive Cosmic Explorer",
    description:
      "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interactive Cosmic Explorer",
    description:
      "Explore the universe in interactive 3D — solar system, stellar neighborhood, and beyond.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
```

Update `globals.css` body font-family untuk pakai CSS var:

```css
body {
  color: rgb(var(--foreground-rgb));
  background: rgb(var(--background-rgb));
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

- [ ] **Step 2: Modifikasi `src/app/[locale]/layout.tsx` dengan `generateMetadata`**

Ganti seluruh isi:

```tsx
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/auth/AuthProvider";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });

  const alternates: Record<string, string> = {};
  for (const l of routing.locales) {
    alternates[l] = `/${l}`;
  }

  return {
    title: { default: t("app.title"), template: `%s | ${t("app.title")}` },
    description: t("app.description"),
    alternates: {
      canonical: `/${locale}`,
      languages: alternates,
    },
    openGraph: {
      locale: locale === "id" ? "id_ID" : "en_US",
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "id")) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>{children}</AuthProvider>
    </NextIntlClientProvider>
  );
}
```

- [ ] **Step 3: Tambah i18n keys untuk metadata**

Tambah ke `src/messages/en/common.json` di root level (setelah `error` object):

```json
"app": {
  "title": "Interactive Cosmic Explorer",
  "description": "Explore the universe in interactive 3D — solar system, stellar neighborhood, constellations, and beyond."
}
```

Tambah ke `src/messages/id/common.json`:

```json
"app": {
  "title": "Interactive Cosmic Explorer",
  "description": "Jelajahi alam semesta dalam 3D interaktif — tata surya, lingkungan bintang, konstelasi, dan lainnya."
}
```

- [ ] **Step 4: Modifikasi `src/app/[locale]/page.tsx` — wrap CosmicExplorer dengan next/dynamic**

```tsx
"use client";

import dynamic from "next/dynamic";
import { CosmicLoader } from "@/components/ui/CosmicLoader";

const CosmicExplorer = dynamic(
  () =>
    import("@/components/cosmic-explorer/CosmicExplorer").then(
      (m) => m.CosmicExplorer,
    ),
  {
    ssr: false,
    loading: () => <CosmicLoader />,
  },
);

export default function Home() {
  return <CosmicExplorer />;
}
```

- [ ] **Step 5: Verifikasi**

```bash
npm run type-check
npm run build
```

Expected:

- Build sukses
- Inspect built HTML: harus ada `<link rel="preconnect" href="https://fonts.gstatic.com">` dari Next.js (otomatis)
- DevTools → Network → Doc: `/_next/static/chunks/...` chunk untuk Scene di-load terpisah setelah main JS

- [ ] **Step 6: Visual check**

```bash
npm run dev
```

Buka `/en`. Pertama kali load, harusnya `CosmicLoader` muncul, lalu Scene di-mount. Time-to-interactive harusnya turun ~30% untuk first-paint karena Scene sudah tidak dalam initial bundle.

- [ ] **Step 7: Commit**

```bash
git add src/app/layout.tsx src/app/[locale]/layout.tsx src/app/[locale]/page.tsx src/app/globals.css src/messages/en/common.json src/messages/id/common.json
git commit -m "feat(metadata): add full OG/Twitter metadata, next/font, dynamic importer for CosmicExplorer"
```

---

### A6. Tambah sitemap.ts dan robots.ts

**Files:**

- Create: `src/app/sitemap.ts`
- Create: `src/app/robots.ts`

**Tujuan:** SEO completeness, Lighthouse SEO = 100.

- [ ] **Step 1: Buat `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const PUBLIC_ROUTES = [
  "/",
  "/dashboard",
  "/library",
  "/help",
  "/login",
  "/signup",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = [];

  for (const route of PUBLIC_ROUTES) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route === "/" ? "" : route}`,
        lastModified,
        changeFrequency: "weekly",
        priority: route === "/" ? 1 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [
              l,
              `/${l}${route === "/" ? "" : route}`,
            ]),
          ),
        },
      });
    }
  }

  return entries;
}
```

- [ ] **Step 2: Buat `src/app/robots.ts`**

```ts
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verifikasi**

```bash
npm run build
npm run start
```

Lakukan curl:

```bash
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/robots.txt
```

Expected: XML sitemap memuat locale variants + canonical; robots.txt mengizinkan crawling + sitemap URL.

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/app/robots.ts
git commit -m "feat(seo): add sitemap.xml and robots.txt with i18n alternates"
```

---

### A7. Tambah `not-found.tsx` kosmik + locale-aware

**Files:**

- Create: `src/app/[locale]/not-found.tsx`

**Tujuan:** 404 page sesuai branding, bukan default Next.

- [ ] **Step 1: Buat `src/app/[locale]/not-found.tsx`**

```tsx
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("common");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cosmic-deep p-8 text-center text-white">
      <div className="font-mono text-6xl text-cosmic-accent">404</div>
      <h1 className="mt-6 text-2xl font-semibold text-white">
        {t("notFound.title")}
      </h1>
      <p className="mt-2 max-w-sm text-white/60">{t("notFound.description")}</p>
      <Link
        href="/dashboard"
        className="mt-8 rounded border border-cosmic-accent/40 bg-cosmic-accent/20 px-6 py-2 font-medium text-cosmic-accent transition hover:bg-cosmic-accent/40"
      >
        {t("notFound.action")}
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Tambah i18n keys**

`src/messages/en/common.json` (root level):

```json
"notFound": {
  "title": "Lost in space",
  "description": "The cosmic coordinate you followed does not lead anywhere in our universe.",
  "action": "Return to dashboard"
}
```

`src/messages/id/common.json`:

```json
"notFound": {
  "title": "Tersesat di luar angkasa",
  "description": "Koordinat kosmis yang Anda tuju tidak menunjuk ke mana pun di alam semesta kami.",
  "action": "Kembali ke dashboard"
}
```

Note: karena `NotFound` adalah server component dan `useTranslations` adalah server-supported, ini OK.

- [ ] **Step 3: Verifikasi**

```bash
npm run dev
```

Buka `http://localhost:3000/en/non-existent-route` → tampil halaman 404 kosmik dengan tombol "Return to dashboard". Buka versi `/id/non-existent-route` → versi Indonesia.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/not-found.tsx src/messages/en/common.json src/messages/id/common.json
git commit -m "feat(notfound): add cosmic-themed 404 page with i18n support"
```

---

## Phase B: Polish (½ hari kerja)

### B1. Wire error toast di hooks dengan `.catch`

**Files:**

- Modify: `src/hooks/useBookmarks.ts`
- Modify: `src/hooks/useProgress.ts`
- Modify: `src/hooks/useAchievements.ts`

**Tujuan:** User melihat toast merah saat gagal muat data dari Supabase, bukan silent fail (cuma `console.error`).

- [ ] **Step 1: Cek hooks punya akses ke `useToast`**

Baca ketiga file dan pastikan setiap error handler saat ini hanya `console.error(...)`. Akan diganti jadi: `console.error(...)` + `useToast().push({ variant: "error", title, description })`.

- [ ] **Step 2: Update `src/hooks/useBookmarks.ts`**

Pastikan import sudah ada (tambah jika belum):

```ts
import { useToast } from "@/hooks/useToast";
```

Tambah `const toast = useToast();` di awal hook function.

Untuk semua `.catch` (saat ini 4 lokasi: load, create, rename, remove), ganti pola dari:

```ts
.catch((e) => {
  console.error("[useBookmarks] X error:", e);
});
```

jadi:

```ts
.catch((e) => {
  console.error("[useBookmarks] X error:", e);
  toast.push({
    variant: "error",
    title: "...",
    description: e instanceof Error ? e.message : "Unknown error",
  });
});
```

Title per aksi (EN/ID-aware via `useTranslations`):

- load → `t("toast.bookmarksLoadFailed.title")` / `t("toast.bookmarksLoadFailed.description")`
- create → `t("toast.bookmarkCreateFailed.title")` / `t("toast.bookmarkCreateFailed.description")`
- rename → `t("toast.bookmarkRenameFailed.title")` / `t("toast.bookmarkRenameFailed.description")`
- remove → `t("toast.bookmarkRemoveFailed.title")` / `t("toast.bookmarkRemoveFailed.description")`

Tambahkan ke `src/messages/en/common.json`:

```json
"toast": {
  "bookmarksLoadFailed": {
    "title": "Couldn't load bookmarks",
    "description": "Your saved views will appear once the connection is restored."
  },
  "bookmarkCreateFailed": {
    "title": "Couldn't save bookmark",
    "description": "Try again in a moment."
  },
  "bookmarkRenameFailed": {
    "title": "Couldn't rename bookmark",
    "description": "Try again in a moment."
  },
  "bookmarkRemoveFailed": {
    "title": "Couldn't delete bookmark",
    "description": "Try again in a moment."
  }
}
```

Tambahkan versi ID di `src/messages/id/common.json`.

- [ ] **Step 3: Update `src/hooks/useProgress.ts`**

Pattern sama: `load` dan `track`. Keys:

```json
"toast": {
  "progressLoadFailed": { "title": "...", "description": "..." },
  "progressTrackFailed": { "title": "...", "description": "..." }
}
```

- [ ] **Step 4: Update `src/hooks/useAchievements.ts`**

Pattern sama: `load` dan `award`. Keys:

```json
"toast": {
  "achievementsLoadFailed": { "title": "...", "description": "..." },
  "achievementAwardFailed": { "title": "...", "description": "..." }
}
```

- [ ] **Step 5: Verifikasi tipe check + lint**

```bash
npm run type-check
npm run lint
```

- [ ] **Step 6: Verify manual in dev**

```bash
npm run dev
```

Login → buka Dashboard. Buka DevTools → Network → Offline → refresh. Hooks akan error → toast merah muncul di pojok kanan bawah. Kembali online → toast hilang otomatis.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useBookmarks.ts src/hooks/useProgress.ts src/hooks/useAchievements.ts src/messages/en/common.json src/messages/id/common.json
git commit -m "feat(toast): pipe Supabase error catches to error toast instead of silent console.error"
```

---

### B2. Set Jest coverage threshold

**Files:**

- Modify: `jest.config.js`

**Tujuan:** Coverage minimum jadi gate —`npm test` akan fail kalau turun dari ambang.

- [ ] **Step 1: Tambah `coverageThreshold` ke `jest.config.js`**

Ganti seluruh isi:

```js
/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: ["node_modules/(?!(@react-three|three)/)"],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/messages/**",
    "!src/**/*.test.{ts,tsx}",
    "!src/types/**",
    "!src/scripts/**",
    "!src/i18n/**",
  ],
};
```

Catatan: threshold 60/70/70/70 konservatif karena codebase sudah di tempat. Bisa naikkan setelah fase berikutnya.

- [ ] **Step 2: Jalankan test dengan coverage**

```bash
npm test -- --coverage
```

Expected: tabel coverage muncul. Jika di bawah threshold, command akan exit non-zero — perbaikan akan tercatat sebagai task lagi nanti (di luar scope TA).

- [ ] **Step 3: Commit**

```bash
git add jest.config.js
git commit -m "chore(test): enforce minimum coverage threshold in Jest config"
```

---

### B3. Tighten TypeScript strictness

**Files:**

- Modify: `tsconfig.json`

**Tujuan:** Tangkap null/undefined access di indexer & override method yang buggy saat compile time, bukan runtime.

- [ ] **Step 1: Tambahkan 4 strict flags**

Modify `compilerOptions` di `tsconfig.json`:

```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/data/*": ["./src/data/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 2: Jalankan type-check dan perbaiki error**

```bash
npm run type-check
```

**Expected error patterns** yang akan muncul dan cara fix-nya:

**(a) `noUncheckedIndexedAccess`** — banyak akses `array[i]` atau `Record<string, T>[key]` sekarang typed `T | undefined`. Fix pattern:

```ts
// BEFORE:
const item = arr[0];
item.doSomething();

// AFTER:
const item = arr[0];
if (item) item.doSomething();
// atau:
const item = arr[0]!; // kasih fallback sadar
```

Untuk `Record<string, T>[locale]` pattern di hooks (e.g. `useAchievements.ts`, `useBookmarks.ts`), tambahkan nullish fallback:

```ts
const dict = def.description as unknown as Record<string, string>;
return dict[locale] ?? dict.en ?? "";
```

**(b) `exactOptionalPropertyTypes`** — `prop?: T` tidak lagi menerima `undefined` eksplisit. Fix dengan menghapus `| undefined` atau `?? undefined`.

**(c) `noImplicitOverride`** — subclass method harus pakai keyword `override` (next.js 14 jarang ada, skip).

**(d) `noFallthroughCasesInSwitch`** — switch case tanpa `return/break` akan jadi error. Fix dengan tambah `break` eksplisit.

- [ ] **Step 3: Verifikasi semua jenis test pass**

```bash
npm run type-check
npm run lint
npm test -- --coverage
```

Semua hijau.

- [ ] **Step 4: Commit**

```bash
git add tsconfig.json src/
git commit -m "chore(types): enable noUncheckedIndexedAccess + noImplicitOverride + noFallthroughCasesInSwitch + exactOptionalPropertyTypes"
```

---

### B4. Perluas `.env.example` + tambah `check-env` script

**Files:**

- Modify: `.env.example`
- Modify: `package.json`

**Tujuan:** Dokumentasikan semua env var dengan jelas, tambahkan sanity-check script.

- [ ] **Step 1: Tulis ulang `.env.example`**

Ganti seluruh isi:

```env
# ─── PUBLIC (di-expose ke browser, prefix NEXT_PUBLIC_) ────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://your-production-domain.com

# ─── SERVER ONLY (JANGAN di-expose ke browser) ────────────────────
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...   # Bypass RLS — hanya untuk seed script

# ─── OPTIONAL: deploy tokens ─────────────────────────────────────
VERCEL_TOKEN=your-vercel-token
RAILWAY_API_TOKEN=your-railway-token
```

- [ ] **Step 2: Tambah `check-env` script di `package.json`**

```json
"check-env": "tsx -e \"import('./src/lib/env').then(() => console.log('✓ Environment OK')).catch((e) => { console.error(e.message); process.exit(1); })\""
```

(Penempatan ini membuat script populate `process.env` dari `.env.local` via `tsx` runner. `src/lib/env.ts` akan throw jika ada yang hilang, exit non-zero.)

- [ ] **Step 3: Test script**

```bash
npm run check-env
```

Expected tanpa `.env.local`: exit 1 dengan pesan jelas variabel mana yang kurang.
Expected dengan `.env.local` lengkap: `✓ Environment OK`.

- [ ] **Step 4: Commit**

```bash
git add .env.example package.json
git commit -m "chore(env): expand .env.example with PUBLIC/SERVER split and add check-env script"
```

---

### B5. Final verification — type-check, lint, test, build

**Files:** (no changes — pure verification step)

- [ ] **Step 1: validation pipeline lengkap**

```bash
npm run check-env
npm run lint
npm run type-check
npm test -- --coverage
npm run build
```

Expected: semua exit 0. Build sukses dengan output `✓ Compiled successfully`.

- [ ] **Step 2: Manual smoke test in dev**

```bash
npm run dev
```

Verifikasi semua ini bekerja:

| Test                  | Path                               | Expected                                                                        |
| --------------------- | ---------------------------------- | ------------------------------------------------------------------------------- |
| Home loads with Scene | `/en`                              | CosmicLoader → Scene muncul dalam ~500ms                                        |
| Dashboard loads       | `/en/dashboard`                    | Loading skeleton → dashboard full                                               |
| 404 page              | `/en/non-existent`                 | Halaman 404 kosmik                                                              |
| Sitemap served        | `/sitemap.xml`                     | XML output valid                                                                |
| Robots served         | `/robots.txt`                      | Plain text dengan Sitemap URL                                                   |
| Login form            | `/en/login`                        | Form render dengan i18n                                                         |
| Locale switch         | `/en` → `/id`                      | Header subtitle berubah bahasa                                                  |
| Font loaded           | Open DevTools Network              | `inter` Latin subset loaded dengan `display: swap`                              |
| Security headers      | `curl -I http://localhost:3000/en` | `X-Frame-Options: DENY`, `Content-Security-Policy: ...`, `Referrer-Policy: ...` |
| Production build      | `npm start` setelah build          | Tidak ada console error di browser                                              |

- [ ] **Step 3: Commit jika ada perubahan kecil**

Jika Step 2 butuh fix kode (mis. ada header missing), commit dengan pesan `fix:` prefix terpisah.

- [ ] **Step 4: Tag release**

```bash
git tag v0.2.0-saas-graded -m "SaaS-graded optimization: security headers, env validation, metadata, loading states"
```

---

## Self-Review Checklist

- [ ] Spec coverage: setiap item di SaaS-analisis Phase A & B memiliki task.
  - A1: env validation ✓
  - A2: security headers ✓
  - A3: global-error + sanitasi ✓
  - A4: skeleton + loading.tsx ✓
  - A5: metadata + next/font + next/dynamic ✓
  - A6: sitemap + robots ✓
  - A7: not-found ✓
  - B1: error toast piping ✓
  - B2: coverage threshold ✓
  - B3: strict TS ✓
  - B4: env example + check-env ✓
  - B5: final verification ✓
- [ ] No placeholder: setiap step punya code atau perintah konkret (cek untuk "TBD", "fill in" → tidak ada).
- [ ] Type/name consistency: `env.NEXT_PUBLIC_SUPABASE_URL` (camelCase object access) konsisten di A1.
- [ ] Path conventions: `@/lib/env` cocok dengan `tsconfig.paths "@/lib/*": ["./src/lib/*"]`.

## Di luar scope (TA-relevant, tapi tidak termasuk dalam plan ini)

- Sentry / Vercel Analytics (perlu akun eksternal + key)
- E2E Playwright (~3-4 jam tambahan)
- Rate limiting middleware (perlu Redis/Upstash)
- Dockerfile multistage (~1 jam)
- Bundle analyzer setup (~30 menit, tapi rendering tidak berubah)
- Audio system (Howler dormant) — lihat plan terpisah di Phase 9 sebelumnya (superpowers plans)
- Quiz system — lihat plan terpisah
- Library page content — lihat plan terpisah

Jika ada waktu setelah ini, task natural berikut: audio system (lebih impactful untuk nilai multimedia TA) dibanding enterprise tooling di list di atas.
