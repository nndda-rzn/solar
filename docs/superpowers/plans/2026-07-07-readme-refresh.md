# README Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Menulis ulang `README.md` agar mencerminkan status proyek terkini dengan badge, branding, setup, status fitur, dan link dokumentasi yang akurat.

**Architecture:** Pekerjaan dibatasi pada dokumentasi akar proyek dan satu file plan. README baru akan memakai banner eksternal, badge stack/status, struktur section yang jelas, serta informasi yang diambil dari kode dan dokumentasi yang sudah ada agar tidak overclaim. Tidak ada perubahan source code aplikasi.

**Tech Stack:** Markdown, GitHub Flavored Markdown, Next.js project metadata, existing docs

---

### Task 1: Kumpulkan fakta proyek yang harus tampil di README

**Files:**

- Modify: `README.md`
- Reference: `package.json`
- Reference: `docs/PROJECT.md`
- Reference: `docs/ARCHITECTURE.md`
- Reference: `src/app/[locale]/dashboard/page.tsx`
- Reference: `src/components/cosmic-explorer/Scene.tsx`

- [ ] **Step 1: Petakan metadata inti proyek**

Catat data berikut agar isi README akurat:

```text
Nama: Interactive Cosmic Explorer
Versi: 0.1.0-alpha
Framework: Next.js 14
Bahasa UI: EN / ID
Stack utama: React, TypeScript, Three.js, R3F, Tailwind, Supabase, Zustand, Jest
```

- [ ] **Step 2: Petakan fitur yang benar-benar tersedia**

Gunakan fakta yang sudah tampak di kode:

```text
- Explorer 3D multi-scale
- Dashboard + AppShell
- Search modal
- Bookmark + progress + achievements
- Settings/help/library pages
- Auth Supabase
- Reusable UI primitives hasil refactor
```

- [ ] **Step 3: Catat hal yang belum lengkap agar README tidak overclaim**

```text
- Library masih coming soon
- Quiz system penuh belum selesai
- Beberapa refactor lanjutan masih roadmap
```

### Task 2: Tulis ulang README utama

**Files:**

- Modify: `README.md`

- [ ] **Step 1: Ganti hero section dengan banner dan badge**

Masukkan elemen seperti berikut di awal file:

```md
<p align="center">
  <img src="https://capsule-render.vercel.app/api?..." alt="Interactive Cosmic Explorer banner" />
</p>
```

- [ ] **Step 2: Tambahkan section inti README**

README harus memuat section berikut:

```md
## Ringkasan

## Status Saat Ini

## Fitur Utama

## Tech Stack

## Arsitektur Singkat

## Struktur Folder

## Menjalankan Proyek

## Environment Variables

## Scripts

## Testing dan Verifikasi

## Dokumentasi

## Roadmap Lanjutan

## Lisensi dan Atribusi
```

- [ ] **Step 3: Pastikan semua command bisa langsung dipakai**

Command yang harus ada:

```bash
git clone https://github.com/nndda-rzn/solar.git
cd solar
npm install
cp .env.example .env.local
npm run dev
```

### Task 3: Verifikasi hasil dokumentasi

**Files:**

- Modify: `README.md`
- Modify: `docs/superpowers/plans/2026-07-07-readme-refresh.md`

- [ ] **Step 1: Jalankan pengecekan format Markdown**

Run: `npx prettier --check README.md docs/superpowers/plans/2026-07-07-readme-refresh.md`

Expected: output menyatakan semua file sesuai format Prettier.

- [ ] **Step 2: Review isi README secara manual**

Checklist manual:

```text
- Tidak ada badge yang misleading
- Tidak ada fitur yang di-claim tapi belum ada di repo
- Semua path file dan link docs valid
- Bahasa Indonesia konsisten
```

- [ ] **Step 3: Simpan perubahan**

```bash
git add README.md docs/superpowers/plans/2026-07-07-readme-refresh.md
git commit -m "docs: refresh project README"
```

Lakukan langkah commit hanya jika memang diminta user.
