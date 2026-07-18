<p align="center">
  <img
    src="https://capsule-render.vercel.app/api?type=waving&color=0:050816,50:0B1F3A,100:1D4ED8&height=220&section=header&text=Interactive%20Cosmic%20Explorer&fontSize=40&fontColor=E5F2FF&animation=fadeIn&fontAlignY=38&desc=Platform%20eksplorasi%20astronomi%203D%20interaktif%20berbasis%20Next.js%20dan%20Three.js&descAlignY=60&descSize=16"
    alt="Interactive Cosmic Explorer banner"
  />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/status-alpha-2563EB?style=for-the-badge" alt="Status alpha" />
  <img src="https://img.shields.io/badge/version-0.1.0--alpha-0F172A?style=for-the-badge" alt="Version 0.1.0-alpha" />
  <img src="https://img.shields.io/badge/tests-102%20passing-16A34A?style=for-the-badge" alt="102 tests passing" />
  <img src="https://img.shields.io/badge/build-verified-0891B2?style=for-the-badge" alt="Build verified" />
  <img src="https://img.shields.io/badge/i18n-EN%20%7C%20ID-7C3AED?style=for-the-badge" alt="English and Indonesian" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=flat-square&logo=nextdotjs&logoColor=white" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/React-18-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 18" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5" />
  <img src="https://img.shields.io/badge/Three.js-3D-000000?style=flat-square&logo=threedotjs&logoColor=white" alt="Three.js" />
  <img src="https://img.shields.io/badge/R3F-Drei-111827?style=flat-square&logo=react&logoColor=61DAFB" alt="React Three Fiber and Drei" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%26%20Data-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Zustand-State-4B5563?style=flat-square" alt="Zustand" />
  <img src="https://img.shields.io/badge/next--intl-i18n-0EA5E9?style=flat-square" alt="next-intl" />
  <img src="https://img.shields.io/badge/Jest-Testing-C21325?style=flat-square&logo=jest&logoColor=white" alt="Jest" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,supabase,threejs,jest" alt="Tech logos" />
</p>

Platform web edukasi astronomi yang menggabungkan eksplorasi 3D, simulasi waktu nyata, progres belajar, dan pengalaman dashboard modern untuk membantu pengguna menjelajahi Tata Surya, bintang-bintang terdekat, struktur galaksi, hingga skala kosmik.

## Daftar Isi

- [Ringkasan](#ringkasan)
- [Status Saat Ini](#status-saat-ini)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur Singkat](#arsitektur-singkat)
- [Struktur Folder](#struktur-folder)
- [Menjalankan Proyek](#menjalankan-proyek)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing dan Verifikasi](#testing-dan-verifikasi)
- [Dokumentasi](#dokumentasi)
- [Roadmap Lanjutan](#roadmap-lanjutan)
- [Lisensi dan Atribusi](#lisensi-dan-atribusi)

## Ringkasan

`Interactive Cosmic Explorer` adalah aplikasi `Next.js` dengan pengalaman inti berupa kanvas 3D interaktif. Pengguna dapat berpindah antar skala eksplorasi, membuka panel informasi objek langit, memakai pencarian cepat, menyimpan bookmark posisi kamera, memantau progres eksplorasi, serta mengelola preferensi antarmuka melalui dashboard dan halaman pendukung.

Repositori ini saat ini sudah mencakup:

- alur auth dan dashboard yang lebih rapi,
- sidebar dan topbar bergaya aplikasi,
- explorer 3D multi-scale,
- sistem progres, achievements, dan bookmarks,
- modal bantuan shortcut serta mode performa,
- refactor shared UI/components/hooks agar codebase lebih granular dan scalable,
- safety net test untuk area UI penting.

## Status Saat Ini

| Area                                    | Status             | Catatan                                                        |
| --------------------------------------- | ------------------ | -------------------------------------------------------------- |
| Setup proyek dan fondasi App Router     | Selesai            | Next.js 14 + TypeScript aktif                                  |
| Cosmic explorer 3D                      | Selesai            | `solar`, `stellar`, `galactic`, `cosmic` scene sudah terhubung |
| Simulasi waktu nyata                    | Selesai            | preset speed, timeline 100 tahun, jump to date                 |
| Search dan object selection             | Selesai            | search modal, search index, camera target resolver             |
| Auth, profile, bookmarks, progress      | Selesai            | terhubung ke Supabase/provider lokal yang ada                  |
| Dashboard, achievements, settings, help | Selesai            | app shell dengan sidebar + topbar                              |
| i18n EN/ID                              | Selesai            | `next-intl` dan route locale aktif                             |
| Library encyclopedia                    | Dalam pengembangan | halaman tersedia, konten masih coming soon                     |
| Quiz system penuh                       | Belum selesai      | masih bagian roadmap                                           |

## Fitur Utama

### 1. Explorer 3D Multi-Scale

- `Solar System`, `Stellar`, `Galactic`, dan `Cosmic` scene berada dalam satu alur eksplorasi.
- `ScaleManager`, `Camera`, `Lighting`, dan `SimulationClock` mengatur perpindahan dan pengalaman visual utama.
- `OrbitControls`, `Stars`, `Bloom`, dan `ToneMapping` dipakai untuk navigasi dan atmosfer visual.

### 2. Simulasi Waktu dan Kontrol Interaksi

- play/pause simulasi,
- pengaturan kecepatan waktu,
- preset speed buttons,
- scrub timeline hingga 100 tahun,
- input `datetime-local` untuk lompat ke tanggal tertentu.

### 3. Search, Bookmark, dan Info Panel

- pencarian objek cepat dari UI,
- panel informasi planet/bintang/konstelasi,
- bookmark posisi kamera dan konteks eksplorasi,
- modal reusable hasil refactor: `ModalBase`, `SlidePanel`, `CloseButton`, `Stat`.

### 4. Dashboard dan Progress Tracking

- halaman `dashboard`, `profile`, `achievements`, `settings`, `help`, `library`,
- level, XP, progres kunjungan, dan bookmarks,
- shell aplikasi konsisten dengan `Sidebar` dan `TopBar`.

### 5. Auth dan Personalisasi

- login dan signup berbasis Supabase,
- logout reusable via custom hook,
- toggle bahasa EN/ID,
- performance mode high/low quality,
- shortcut help dan error boundary untuk pengalaman yang lebih tahan gangguan.

### 6. Refactor dan Quality Improvements Terbaru

- ekstraksi formatter tanggal/waktu ke `src/lib/utils/format.ts`,
- ekstraksi `generateStars` dan `useShootingStars`,
- ekstraksi `buildSearchIndex` dan `resolveObjectSelect`,
- shared hooks: `useClickOutside`, `useSupabaseLogout`,
- safety net test untuk `HeaderBar`, `SearchModal`, `StellarInfoPanel`, dan `StarBackground`.

## Tech Stack

| Layer                | Teknologi                            |
| -------------------- | ------------------------------------ |
| Framework            | Next.js 14 App Router                |
| UI                   | React 18                             |
| 3D Engine            | Three.js, React Three Fiber, Drei    |
| Styling              | Tailwind CSS 4                       |
| Animasi              | Framer Motion                        |
| State Management     | Zustand                              |
| Auth dan Data        | Supabase                             |
| Internationalization | next-intl                            |
| Audio                | Howler.js                            |
| Testing              | Jest, Testing Library                |
| Tooling              | ESLint, Prettier, Husky, lint-staged |

## Arsitektur Singkat

Alur utama aplikasi saat ini:

1. `src/app/` menangani route App Router dan locale.
2. `src/components/cosmic-explorer/` mengorkestrasi kanvas 3D dan scene.
3. `src/components/ui/` dan `src/components/layout/` menangani HUD, modal, panel, serta app shell.
4. `src/lib/store/` menyimpan state global eksplorasi dan simulasi.
5. `src/hooks/` dan `src/lib/` memegang business logic yang sudah mulai dipisah dari komponen besar.
6. `src/lib/providers/` dan `src/utils/supabase/` menangani auth/persistensi berbasis Supabase.

Status arsitektur terkini mengikuti refactor granular Phase 0+1: shared primitives, shared hooks, extracted search/canvas logic, dan coverage test untuk area rentan regresi.

## Struktur Folder

```text
src/
├── app/                      # Next.js App Router + locale pages
├── components/
│   ├── auth/                 # Auth screens dan background visual
│   ├── cosmic-explorer/      # Orkestrasi kanvas 3D utama
│   ├── layout/               # Sidebar, TopBar, AppShell
│   ├── solar-system/         # Scene skala tata surya
│   ├── stellar/              # Scene bintang dan konstelasi
│   ├── galactic/             # Scene galaksi
│   ├── cosmic/               # Scene kosmik
│   └── ui/                   # Modal, panel, HUD, loader, controls
├── hooks/                    # Custom hooks UI, auth, data, canvas
├── lib/
│   ├── providers/            # Progress, bookmarks, achievements
│   ├── search/               # Search index dan object selection logic
│   ├── store/                # Zustand stores
│   └── utils/                # Formatter, astronomy, constants
├── messages/                 # next-intl translations EN/ID
├── types/                    # Domain types
└── utils/supabase/           # Supabase client, server, middleware helpers

docs/
├── README.md                 # Indeks dokumentasi
├── ARCHITECTURE.md
├── DEVELOPMENT.md
├── FOLDER_STRUCTURE.md
├── PROJECT.md
├── SETUP.md
└── superpowers/
    ├── plans/
    └── specs/
```

## Menjalankan Proyek

### Prasyarat

- Node.js `18.17+` atau `20+`
- npm
- project Supabase jika ingin menguji fitur auth dan persistence secara penuh

### Instalasi

```bash
git clone https://github.com/nndda-rzn/solar.git
cd solar
npm install
```

### Menyiapkan environment

```bash
cp .env.example .env.local
```

Untuk PowerShell Windows:

```powershell
Copy-Item .env.example .env.local
```

### Menjalankan development server

```bash
npm run dev
```

Buka `http://localhost:3000`.

Route root akan mengarahkan ke `/en`. Anda juga bisa membuka `/id` untuk locale Indonesia.

## Environment Variables

Contoh variabel yang tersedia di `.env.example`:

| Variable                               | Keterangan                                            |
| -------------------------------------- | ----------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`             | URL project Supabase                                  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public anon/publishable key Supabase                  |
| `SUPABASE_SERVICE_ROLE_KEY`            | Service role key untuk kebutuhan server-side tertentu |
| `VERCEL_TOKEN`                         | Opsional untuk deployment automation                  |
| `RAILWAY_API_TOKEN`                    | Opsional untuk deployment/integrasi Railway           |

## Scripts

| Command              | Fungsi                                                |
| -------------------- | ----------------------------------------------------- |
| `npm run dev`        | Menjalankan development server                        |
| `npm run build`      | Build production Next.js                              |
| `npm run start`      | Menjalankan hasil build production                    |
| `npm run lint`       | Menjalankan ESLint pada `src`                         |
| `npm run format`     | Menjalankan Prettier untuk `src` dan Markdown terkait |
| `npm run type-check` | Menjalankan TypeScript check tanpa emit               |
| `npm run test`       | Menjalankan Jest                                      |
| `npm run test:ci`    | Menjalankan Jest mode CI                              |
| `npm run db:seed`    | Menjalankan seeding script                            |

## Testing dan Verifikasi

Command verifikasi utama yang dipakai di branch pengembangan ini:

```bash
npx tsc --noEmit
npm run lint
npm run test
npm run build
```

Status verifikasi terakhir sebelum update dokumentasi ini:

- `npx tsc --noEmit` lulus,
- `npm run lint` lulus,
- `npm run test` lulus dengan `13 suites / 102 tests`,
- `npm run build` lulus.

Contoh test coverage area penting yang sudah ada:

- `src/components/ui/__tests__/HeaderBar.test.tsx`
- `src/components/ui/__tests__/SearchModal.test.tsx`
- `src/components/ui/__tests__/StellarInfoPanel.test.tsx`
- `src/components/auth/__tests__/StarBackground.test.tsx`
- `src/components/stellar/stars/__tests__/Star.test.tsx`
- `src/components/stellar/stars/__tests__/StarGlow.test.tsx`

## Dokumentasi

Dokumentasi proyek berada di folder [`docs/`](docs/).

Referensi utama:

- [`docs/README.md`](docs/README.md) - indeks dokumentasi
- [`docs/PROJECT.md`](docs/PROJECT.md) - overview proyek dan target produk
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) - arsitektur dan store design
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) - workflow pengembangan
- [`docs/FOLDER_STRUCTURE.md`](docs/FOLDER_STRUCTURE.md) - struktur folder detail
- [`docs/SETUP.md`](docs/SETUP.md) - setup environment
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) - catatan deployment

## Roadmap Lanjutan

Beberapa pekerjaan lanjutan yang sudah teridentifikasi:

- memindahkan `ConstellationData` ke lokasi data yang lebih tepat,
- mengekstrak konfigurasi simulasi seperti `SPEED_PRESETS` dan `JUMP_AMOUNTS`,
- memecah `explorer-store.ts` menjadi store yang lebih spesifik,
- merapikan duplikasi type untuk domain celestial vs canvas,
- melanjutkan konten `Library`, quiz system, dan perluasan dokumentasi teknis.

## Lisensi dan Atribusi

- Proyek ini bersifat edukasional.
- `package.json` saat ini menggunakan lisensi `ISC`.
- Beberapa aset/data astronomi mengikuti lisensi sumber masing-masing, termasuk public domain dan `CC BY 4.0` sebagaimana dicatat di dokumentasi proyek.

Jika Anda ingin, langkah berikutnya yang paling natural adalah menambahkan screenshot atau GIF aplikasi ke README agar showcase GitHub-nya lebih kuat.
