# Guided Tour Interaktif — Implementation Plan

> **Date:** 2026-07-13
> **For agentic workers:** Use `superpowers:executing-plans` to implement task-by-task. Steps use checkbox syntax.

---

## Tujuan

Membangun fitur Guided Tour interaktif yang memandu user menjelajahi Cosmic Explorer secara terstruktur. Tour ditampilkan sebagai tooltip card bottom-center di atas scene 3D (scene tetap visible), user navigasi dengan tombol Next/Skip, dan muncul otomatis saat pertama kali buka app.

---

## Desain Final

- **Tampilan:** Tooltip card fixed bottom-center, backdrop semi-transparan minimal, scene 3D tetap terlihat penuh
- **Navigasi:** Tombol "Next" dan "Skip Tour" di setiap step
- **Trigger:** Auto popup saat pertama kali buka app (cek `localStorage["cosmic-tour-completed"]`), tombol replay di TopBar/HUD
- **Steps:** 10 step, mulai solar system sampai cosmic scale

---

## Tour Steps

| Step | ID       | Skala    | Target Camera    | Planet Select | Narasi (EN)                                                                |
| ---- | -------- | -------- | ---------------- | ------------- | -------------------------------------------------------------------------- |
| 0    | welcome  | solar    | null             | null          | Welcome to Cosmic Explorer — your interactive journey through the universe |
| 1    | sun      | solar    | [0,0,0]          | null          | The Sun — our star, containing 99.8% of the solar system's mass            |
| 2    | earth    | solar    | earth position   | earth         | Earth — our home, the only known planet with life                          |
| 3    | saturn   | solar    | saturn position  | saturn        | Saturn — famous for its spectacular ring system                            |
| 4    | neptune  | solar    | neptune position | neptune       | Neptune — the furthest planet, 30 AU from the Sun                          |
| 5    | stellar  | stellar  | null             | null          | Beyond our solar system — thousands of stars in our stellar neighborhood   |
| 6    | galactic | galactic | null             | null          | The Milky Way — our galaxy, home to 200-400 billion stars                  |
| 7    | cosmic   | cosmic   | null             | null          | The observable universe — 93 billion light-years across                    |
| 8    | return   | solar    | null             | null          | You've explored the universe. Now explore on your own!                     |

---

## Arsitektur

```
useTourStore (Zustand, persisted)
  ├── isTourActive: boolean
  ├── currentStep: number
  ├── hasCompletedTour: boolean (persist ke localStorage)
  ├── startTour()
  ├── nextStep()
  ├── skipTour()
  └── completeTour()

GuidedTour component (mount di HUD.tsx)
  ├── Watch isTourActive
  ├── Render TourCard (fixed bottom-center)
  └── Auto-trigger camera + scale per step

TourCard component
  ├── Step indicator (1/9)
  ├── Title + description text
  ├── Progress bar
  └── Tombol Next + Skip
```

---

## File yang Dibuat

| File                               | Keterangan                           |
| ---------------------------------- | ------------------------------------ |
| `src/lib/store/tour-store.ts`      | Zustand store untuk state tour       |
| `src/components/ui/GuidedTour.tsx` | Komponen utama tour + logic camera   |
| `src/components/ui/TourCard.tsx`   | Card UI yang tampil di bottom screen |
| `src/data/tour-steps.ts`           | Data 9 step tour (EN + ID)           |

## File yang Dimodifikasi

| File                           | Perubahan                 |
| ------------------------------ | ------------------------- |
| `src/components/ui/HUD.tsx`    | Mount `<GuidedTour />`    |
| `src/components/ui/TopBar.tsx` | Tambah tombol replay tour |
| `src/messages/en/common.json`  | Tambah i18n keys tour     |
| `src/messages/id/common.json`  | Tambah i18n keys tour     |

---

## Phase 1: Tour Store

### Task 1.1 — Buat `src/lib/store/tour-store.ts`

- [ ] **Step 1: Buat file store**

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  isTourActive: boolean;
  currentStep: number;
  hasCompletedTour: boolean;
  startTour: () => void;
  nextStep: (totalSteps: number) => void;
  skipTour: () => void;
  completeTour: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      isTourActive: false,
      currentStep: 0,
      hasCompletedTour: false,

      startTour: () => set({ isTourActive: true, currentStep: 0 }),

      nextStep: (totalSteps: number) =>
        set((s) => {
          if (s.currentStep + 1 >= totalSteps) {
            return {
              isTourActive: false,
              currentStep: 0,
              hasCompletedTour: true,
            };
          }
          return { currentStep: s.currentStep + 1 };
        }),

      skipTour: () =>
        set({ isTourActive: false, currentStep: 0, hasCompletedTour: true }),

      completeTour: () =>
        set({ isTourActive: false, currentStep: 0, hasCompletedTour: true }),
    }),
    { name: "cosmic-tour", partialState: ["hasCompletedTour"] },
  ),
);
```

- [ ] **Step 2: Verifikasi TypeScript**
  ```bash
  npx tsc --noEmit
  ```

---

## Phase 2: Tour Steps Data

### Task 2.1 — Buat `src/data/tour-steps.ts`

- [ ] **Step 1: Buat file data steps**

```typescript
import * as THREE from "three";
import type { ScaleMode } from "@/config/scales";

export interface TourStep {
  id: string;
  scale: ScaleMode;
  cameraTarget: THREE.Vector3 | null;
  selectPlanet: string | null;
  titleKey: string; // i18n key
  descriptionKey: string; // i18n key
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    scale: "solar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.welcome.title",
    descriptionKey: "tour.steps.welcome.description",
  },
  {
    id: "sun",
    scale: "solar",
    cameraTarget: new THREE.Vector3(0, 5, 20),
    selectPlanet: null,
    titleKey: "tour.steps.sun.title",
    descriptionKey: "tour.steps.sun.description",
  },
  {
    id: "earth",
    scale: "solar",
    cameraTarget: new THREE.Vector3(15, 2, 5),
    selectPlanet: "earth",
    titleKey: "tour.steps.earth.title",
    descriptionKey: "tour.steps.earth.description",
  },
  {
    id: "saturn",
    scale: "solar",
    cameraTarget: new THREE.Vector3(95, 5, 10),
    selectPlanet: "saturn",
    titleKey: "tour.steps.saturn.title",
    descriptionKey: "tour.steps.saturn.description",
  },
  {
    id: "neptune",
    scale: "solar",
    cameraTarget: new THREE.Vector3(300, 5, 10),
    selectPlanet: "neptune",
    titleKey: "tour.steps.neptune.title",
    descriptionKey: "tour.steps.neptune.description",
  },
  {
    id: "stellar",
    scale: "stellar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.stellar.title",
    descriptionKey: "tour.steps.stellar.description",
  },
  {
    id: "galactic",
    scale: "galactic",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.galactic.title",
    descriptionKey: "tour.steps.galactic.description",
  },
  {
    id: "cosmic",
    scale: "cosmic",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.cosmic.title",
    descriptionKey: "tour.steps.cosmic.description",
  },
  {
    id: "finish",
    scale: "solar",
    cameraTarget: null,
    selectPlanet: null,
    titleKey: "tour.steps.finish.title",
    descriptionKey: "tour.steps.finish.description",
  },
];
```

---

## Phase 3: TourCard UI Component

### Task 3.1 — Buat `src/components/ui/TourCard.tsx`

- [ ] **Step 1: Buat komponen card**

```tsx
"use client";

import { useTranslations } from "next-intl";
import { useTourStore } from "@/lib/store/tour-store";
import { TOUR_STEPS } from "@/data/tour-steps";
import { ChevronRight, X } from "lucide-react";

export function TourCard() {
  const t = useTranslations("common");
  const { currentStep, nextStep, skipTour } = useTourStore();
  const step = TOUR_STEPS[currentStep];
  const total = TOUR_STEPS.length;
  const isLast = currentStep === total - 1;

  if (!step) return null;

  return (
    <div className="fixed bottom-8 left-1/2 z-50 w-full max-w-md -translate-x-1/2 px-4">
      <div className="relative rounded-2xl border border-white/10 bg-cosmic-deep/90 p-5 shadow-2xl backdrop-blur-md">
        {/* Step indicator */}
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-medium uppercase tracking-widest text-cosmic-accent">
            {t("tour.step")} {currentStep + 1} / {total}
          </span>
          <button
            onClick={skipTour}
            aria-label={t("tour.skip")}
            className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
          >
            <X className="h-3 w-3" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-0.5 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-cosmic-accent transition-all duration-500"
            style={{ width: `${((currentStep + 1) / total) * 100}%` }}
          />
        </div>

        {/* Content */}
        <h3 className="mb-1.5 text-base font-semibold text-white">
          {t(step.titleKey)}
        </h3>
        <p className="text-sm leading-relaxed text-white/60">
          {t(step.descriptionKey)}
        </p>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={skipTour}
            className="text-xs text-white/30 transition-colors hover:text-white/50"
          >
            {t("tour.skip")}
          </button>
          <button
            onClick={() => nextStep(total)}
            className="flex items-center gap-1.5 rounded-lg bg-cosmic-accent px-4 py-2 text-sm font-medium text-cosmic-deep transition-opacity hover:opacity-90"
          >
            {isLast ? t("tour.finish") : t("tour.next")}
            {!isLast && <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## Phase 4: GuidedTour — Logic Camera + Auto-trigger

### Task 4.1 — Buat `src/components/ui/GuidedTour.tsx`

- [ ] **Step 1: Buat komponen utama**

```tsx
"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { useTourStore } from "@/lib/store/tour-store";
import { useCameraStore } from "@/lib/store/camera-store";
import { useScaleStore } from "@/lib/store/scale-store";
import { useSelectionStore } from "@/lib/store/selection-store";
import { TOUR_STEPS } from "@/data/tour-steps";
import { TourCard } from "./TourCard";
import type { ScaleMode } from "@/config/scales";

export function GuidedTour() {
  const { isTourActive, currentStep, hasCompletedTour, startTour } =
    useTourStore();
  const setCameraTarget = useCameraStore((s) => s.setCameraTarget);
  const setScale = useScaleStore((s) => s.setScale);
  const selectPlanet = useSelectionStore((s) => s.selectPlanet);

  // Auto-trigger on first visit
  useEffect(() => {
    if (!hasCompletedTour) {
      const timer = setTimeout(() => startTour(), 1500);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply camera + scale + selection when step changes
  useEffect(() => {
    if (!isTourActive) return;
    const step = TOUR_STEPS[currentStep];
    if (!step) return;

    // Set scale
    setScale(step.scale as ScaleMode);

    // Set camera target
    if (step.cameraTarget) {
      setCameraTarget(
        new THREE.Vector3(
          step.cameraTarget.x,
          step.cameraTarget.y,
          step.cameraTarget.z,
        ),
      );
    } else {
      setCameraTarget(null);
    }

    // Select planet if specified
    selectPlanet(step.selectPlanet);
  }, [isTourActive, currentStep, setCameraTarget, setScale, selectPlanet]);

  if (!isTourActive) return null;

  return <TourCard />;
}
```

---

## Phase 5: Mount di HUD + Tombol Replay

### Task 5.1 — Tambah GuidedTour ke HUD.tsx

- [ ] **Step 1: Baca HUD.tsx**
      Konfirmasi struktur dan di mana komponen lain di-mount.

- [ ] **Step 2: Tambah import dan mount**
  ```tsx
  import { GuidedTour } from "./GuidedTour";
  // Di dalam return HUD:
  <GuidedTour />;
  ```

### Task 5.2 — Tambah tombol replay di TopBar

- [ ] **Step 1: Baca TopBar.tsx**
      Cari slot yang tepat untuk tombol tour.

- [ ] **Step 2: Tambah tombol**
      Import `useTourStore`, tambah tombol dengan icon `Map` dari lucide-react.
  ```tsx
  import { Map } from "lucide-react";
  import { useTourStore } from "@/lib/store/tour-store";
  // Di dalam TopBar:
  const startTour = useTourStore((s) => s.startTour);
  // Button:
  <button onClick={startTour} title={t("tour.replay")}>
    <Map className="h-4 w-4" />
  </button>;
  ```

---

## Phase 6: i18n Keys

### Task 6.1 — Tambah keys ke EN dan ID

- [ ] **Step 1: Baca `src/messages/en/common.json`**
      Konfirmasi struktur file sebelum edit.

- [ ] **Step 2: Tambah ke `src/messages/en/common.json`**

```json
"tour": {
  "step": "Step",
  "next": "Next",
  "skip": "Skip Tour",
  "finish": "Start Exploring",
  "replay": "Restart Tour",
  "steps": {
    "welcome": {
      "title": "Welcome to Cosmic Explorer",
      "description": "An interactive journey through our solar system and beyond. Let's explore the universe together."
    },
    "sun": {
      "title": "The Sun",
      "description": "Our star at the center of the solar system, containing 99.8% of all the mass in the solar system."
    },
    "earth": {
      "title": "Earth",
      "description": "Our home planet — the only known world harboring life, with liquid water oceans and a protective atmosphere."
    },
    "saturn": {
      "title": "Saturn",
      "description": "The jewel of the solar system, famous for its spectacular ring system made of ice and rock particles."
    },
    "neptune": {
      "title": "Neptune",
      "description": "The farthest planet from the Sun, 30 times Earth's distance away, with winds reaching 2,100 km/h."
    },
    "stellar": {
      "title": "Stellar Neighborhood",
      "description": "Zoom out beyond our solar system. Thousands of nearby stars become visible within 100 light-years."
    },
    "galactic": {
      "title": "The Milky Way",
      "description": "Our home galaxy — a spiral galaxy containing 200 to 400 billion stars, 100,000 light-years across."
    },
    "cosmic": {
      "title": "The Observable Universe",
      "description": "The largest scale — the entire observable universe, 93 billion light-years in diameter, containing trillions of galaxies."
    },
    "finish": {
      "title": "You're Ready to Explore!",
      "description": "You've seen the full scale of the cosmos. Now explore freely — click planets, zoom in and out, discover the universe."
    }
  }
}
```

- [ ] **Step 3: Tambah ke `src/messages/id/common.json`**

```json
"tour": {
  "step": "Langkah",
  "next": "Lanjut",
  "skip": "Lewati Tour",
  "finish": "Mulai Eksplorasi",
  "replay": "Ulangi Tour",
  "steps": {
    "welcome": {
      "title": "Selamat Datang di Cosmic Explorer",
      "description": "Perjalanan interaktif melalui tata surya dan alam semesta. Mari kita jelajahi bersama."
    },
    "sun": {
      "title": "Matahari",
      "description": "Bintang kita di pusat tata surya, mengandung 99,8% dari seluruh massa di tata surya."
    },
    "earth": {
      "title": "Bumi",
      "description": "Planet kita — satu-satunya dunia yang diketahui memiliki kehidupan, dengan lautan dan atmosfer pelindung."
    },
    "saturn": {
      "title": "Saturnus",
      "description": "Permata tata surya, terkenal dengan sistem cincinnya yang spektakuler dari es dan batuan."
    },
    "neptune": {
      "title": "Neptunus",
      "description": "Planet terjauh dari Matahari, 30 kali jarak Bumi, dengan angin mencapai 2.100 km/jam."
    },
    "stellar": {
      "title": "Lingkungan Bintang",
      "description": "Zoom keluar melampaui tata surya kita. Ribuan bintang terdekat terlihat dalam radius 100 tahun cahaya."
    },
    "galactic": {
      "title": "Bima Sakti",
      "description": "Galaksi kita — galaksi spiral dengan 200 hingga 400 miliar bintang, selebar 100.000 tahun cahaya."
    },
    "cosmic": {
      "title": "Alam Semesta yang Dapat Diamati",
      "description": "Skala terbesar — seluruh alam semesta yang dapat diamati, diameter 93 miliar tahun cahaya, berisi triliunan galaksi."
    },
    "finish": {
      "title": "Siap Menjelajah!",
      "description": "Kamu sudah melihat skala penuh kosmos. Sekarang jelajahi secara bebas — klik planet, zoom in dan out, temukan alam semesta."
    }
  }
}
```

---

## Phase 7: Verifikasi

### Task 7.1 — TypeScript check

- [ ] **Step 1:**
  ```bash
  npx tsc --noEmit
  ```

### Task 7.2 — Build check

- [ ] **Step 1:**
  ```bash
  npm run build
  ```

### Task 7.3 — Manual smoke test

- [ ] Buka app fresh (clear localStorage) → tour muncul otomatis setelah 1.5s
- [ ] Klik Next → camera fly ke Sun
- [ ] Klik Next → Earth di-select, camera fly ke Earth
- [ ] Klik Next → Saturn di-select
- [ ] Klik Next → Neptune di-select
- [ ] Klik Next → scale berubah ke stellar
- [ ] Klik Next → scale galactic
- [ ] Klik Next → scale cosmic
- [ ] Klik "Start Exploring" → tour selesai, kembali solar
- [ ] Buka lagi → tour tidak muncul otomatis (sudah completed)
- [ ] Klik tombol replay di TopBar → tour mulai lagi dari step 0
- [ ] Klik Skip → tour berhenti, `hasCompletedTour = true`

---

## Urutan Implementasi

```
Phase 1: tour-store.ts
    ↓
Phase 2: tour-steps.ts
    ↓
Phase 3: TourCard.tsx (UI)
    ↓
Phase 4: GuidedTour.tsx (logic)
    ↓
Phase 5: Mount di HUD + TopBar
    ↓
Phase 6: i18n keys (EN + ID)
    ↓
Phase 7: tsc + build + smoke test
```

**Total file baru:** 4 file
**Total file dimodifikasi:** 4 file
**Tidak ada dependency baru**

---

## Catatan Penting

1. **Camera positions** di `tour-steps.ts` menggunakan koordinat estimasi dari scene solar system. Perlu disesuaikan saat smoke test jika kamera terlalu jauh/dekat dari planet.

2. **`selectPlanet(null)` saat unmount** — saat tour skip/complete, pastikan planet selection di-reset agar InfoPanel tidak tertinggal terbuka.

3. **Persist partial** — hanya `hasCompletedTour` yang di-persist ke localStorage. `isTourActive` dan `currentStep` reset setiap reload (tidak di-persist).

4. **Rollback** — hapus 4 file baru, revert HUD.tsx dan TopBar.tsx. Tidak ada perubahan breaking.
