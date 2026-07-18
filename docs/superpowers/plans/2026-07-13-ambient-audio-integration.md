# Ambient Audio Integration Plan

> **Status:** Ready to implement
> **Date:** 2026-07-13
> **For agentic workers:** Use `superpowers:executing-plans` to implement task-by-task. Steps use checkbox syntax.

---

## Latar Belakang

3 file audio MP3 sudah tersedia di `public/audio/` (CC0, Freesound). Infrastruktur settings sudah lengkap (`ambientEnabled`, `muted`, `volume` di `useSettings`). UI kontrol sudah ada di `SettingsModal`. Yang belum: koneksi antara file audio dan sistem yang sudah ada.

**Gap aktual:**

- `audioManager` (Howler.js) tidak pernah dipakai — dead code
- `ambientEnabled` state tidak terhubung ke audio apapun
- Tidak ada crossfade antar track saat skala berubah

---

## Asset Mapping

| File                                                                           | Key       | Digunakan pada skala  |
| ------------------------------------------------------------------------------ | --------- | --------------------- |
| `public/audio/monume-space-ambient-547940.mp3`                                 | `solar`   | `solar`               |
| `public/audio/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3` | `stellar` | `stellar`, `galactic` |
| `public/audio/atlasaudio-drone-ambient-518685.mp3`                             | `cosmic`  | `cosmic`              |

---

## Arsitektur

```
useAudio.ts (HUD.tsx)
  ├── procedural SFX (sudah jalan) → tidak diubah
  └── ambient layer (BARU)
        ├── audioManager.load() × 3 saat mount
        ├── watch ambientEnabled + muted + volume
        ├── cosmicEventBus.on("scale_reached") → crossfade
        └── cleanup stop semua saat unmount
```

**Tidak perlu ubah:** `CosmicExplorer.tsx`, `SettingsModal.tsx`, `useSettings.ts`, `audio-manager.ts`

---

## File yang Diubah

| File                             | Perubahan                                                               |
| -------------------------------- | ----------------------------------------------------------------------- |
| `src/hooks/useAudio.ts`          | Tambah ambient logic — load 3 track, watch settings, crossfade on scale |
| `src/lib/audio/audio-manager.ts` | Tambah `fadeIn()` dan `isPlaying()` method                              |

---

## Phase 1: Perkuat `AudioManager`

### Task 1.1 — Tambah `fadeIn` dan `isPlaying` ke `audio-manager.ts`

**File:** `src/lib/audio/audio-manager.ts`

- [ ] **Step 1: Baca file saat ini**

  Konfirmasi baris 1–59 sesuai yang diketahui.

- [ ] **Step 2: Tambah method `fadeIn`**

  ```typescript
  fadeIn(key: string, targetVolume: number, duration: number = 2000) {
    const track = this.tracks.get(key);
    if (track) {
      track.volume(0);
      if (!track.playing()) track.play();
      track.fade(0, targetVolume, duration);
    }
  }
  ```

- [ ] **Step 3: Tambah method `isPlaying`**

  ```typescript
  isPlaying(key: string): boolean {
    const track = this.tracks.get(key);
    return track ? track.playing() : false;
  }
  ```

- [ ] **Step 4: Verifikasi TypeScript**

  ```bash
  npx tsc --noEmit
  ```

---

## Phase 2: Ambient Logic di `useAudio.ts`

### Task 2.1 — Load 3 ambient track saat mount

**File:** `src/hooks/useAudio.ts`

- [ ] **Step 1: Baca file saat ini**

  Konfirmasi baris 1–59.

- [ ] **Step 2: Import tambahan**

  Tambah import:

  ```typescript
  import { audioManager } from "@/lib/audio/audio-manager";
  import { useScaleStore } from "@/lib/store/scale-store";
  ```

- [ ] **Step 3: Tambah konstanta track mapping**

  Di dalam `useAudio`, sebelum return:

  ```typescript
  const AMBIENT_TRACKS = {
    solar: "/audio/monume-space-ambient-547940.mp3",
    stellar:
      "/audio/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3",
    cosmic: "/audio/atlasaudio-drone-ambient-518685.mp3",
  } as const;

  type AmbientKey = keyof typeof AMBIENT_TRACKS;

  const scaleToAmbient = (scale: string): AmbientKey => {
    if (scale === "cosmic") return "cosmic";
    if (scale === "galactic" || scale === "stellar") return "stellar";
    return "solar";
  };
  ```

- [ ] **Step 4: Load semua track saat mount (sekali saja)**

  ```typescript
  useEffect(() => {
    // Load tracks hanya jika belum pernah di-load
    (Object.entries(AMBIENT_TRACKS) as [AmbientKey, string][]).forEach(
      ([key, src]) => {
        audioManager.load(key, { src, volume: 0, loop: true });
      },
    );
    return () => {
      (Object.keys(AMBIENT_TRACKS) as AmbientKey[]).forEach((key) =>
        audioManager.stop(key),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentional: load once
  ```

### Task 2.2 — Watch `ambientEnabled` + `muted` + `volume`

- [ ] **Step 1: Ambil state dari settings**

  Tambah di dalam `useAudio`:

  ```typescript
  const ambientEnabled = useSettings((s) => s.ambientEnabled);
  const currentScale = useScaleStore((s) => s.currentScale);
  const activeAmbientKey = useRef<AmbientKey>("solar");
  ```

- [ ] **Step 2: Effect react terhadap toggle ambient/mute/volume**

  ```typescript
  useEffect(() => {
    const key = activeAmbientKey.current;
    if (muted || !ambientEnabled) {
      audioManager.fadeOut(key, 1500);
    } else {
      audioManager.fadeIn(key, volume, 1500);
    }
  }, [ambientEnabled, muted, volume]);
  ```

- [ ] **Step 3: Effect volume real-time (tanpa fade)**

  ```typescript
  useEffect(() => {
    if (!muted && ambientEnabled) {
      audioManager.setVolume(activeAmbientKey.current, volume);
    }
  }, [volume, muted, ambientEnabled]);
  ```

### Task 2.3 — Crossfade saat skala berubah

- [ ] **Step 1: Subscribe ke `scale_reached` event**

  Tambah ke dalam `useEffect` yang sudah ada (yang berisi `unsubs` array):

  ```typescript
  cosmicEventBus.on("scale_reached", (e) => {
    const newKey = scaleToAmbient(e.payload.scale);
    if (newKey === activeAmbientKey.current) return;

    // Fade out track lama
    audioManager.fadeOut(activeAmbientKey.current, 2000);

    // Fade in track baru (hanya jika tidak muted dan ambient aktif)
    if (!mutedRef.current && ambientEnabledRef.current) {
      audioManager.fadeIn(newKey, volumeRef.current, 2000);
    }

    activeAmbientKey.current = newKey;
  }),
  ```

- [ ] **Step 2: Tambah ref untuk ambientEnabled**

  Agar bisa diakses di dalam callback event tanpa stale closure:

  ```typescript
  const ambientEnabledRef = useRef(ambientEnabled);
  useEffect(() => {
    ambientEnabledRef.current = ambientEnabled;
  }, [ambientEnabled]);
  ```

- [ ] **Step 3: Play ambient pertama kali saat app load**

  Di akhir load effect (Task 2.1 Step 4), tambah:

  ```typescript
  // Auto-play saat pertama mount jika tidak muted
  if (!mutedRef.current && ambientEnabledRef.current) {
    setTimeout(() => {
      audioManager.fadeIn("solar", volumeRef.current, 3000);
    }, 1000); // delay 1s tunggu user interaction
  }
  ```

---

## Phase 3: Verifikasi

### Task 3.1 — TypeScript check

- [ ] **Step 1:**
  ```bash
  npx tsc --noEmit
  ```
  Tidak boleh ada error baru.

### Task 3.2 — Build check

- [ ] **Step 1:**
  ```bash
  npm run build
  ```
  Build harus sukses.

### Task 3.3 — Manual smoke test

- [ ] Buka app → tunggu 1–2 detik → dengar ambient `solar` fade in
- [ ] Settings → Ambient OFF → audio fade out
- [ ] Settings → Ambient ON → audio fade in kembali
- [ ] Settings → Mute ON → semua audio berhenti (SFX juga)
- [ ] Settings → Volume slider → volume berubah real-time
- [ ] Navigate ke stellar scale → dengar crossfade ke `stellar` track
- [ ] Navigate ke cosmic scale → dengar crossfade ke `cosmic` track
- [ ] Reload halaman → settings (mute/volume) persist

---

## Catatan Penting

1. **Browser autoplay policy** — Audio harus dimulai setelah user interaction. `setTimeout 1000ms` di Task 2.3 Step 3 memberi jeda, tapi jika user belum klik apapun, Howler akan queue dan play otomatis saat interaksi pertama.

2. **useScaleStore** — Perlu konfirmasi nama store dan field yang benar sebelum implementasi. Jika nama berbeda, sesuaikan import.

3. **Stale closure** — Semua callback event bus menggunakan `ref` (`mutedRef`, `volumeRef`, `ambientEnabledRef`) untuk menghindari nilai lama.

4. **Rollback** — Jika terjadi masalah: comment out semua kode ambient di `useAudio.ts`. SFX procedural tidak terpengaruh.

---

## Urutan Implementasi

```
Phase 1: audio-manager.ts (tambah fadeIn + isPlaying)
    ↓
Phase 2: useAudio.ts (ambient logic lengkap)
    ↓
Phase 3: verifikasi tsc + build + manual test
```

Total file diubah: **2 file**. Tidak ada komponen baru, tidak ada dependency baru.
