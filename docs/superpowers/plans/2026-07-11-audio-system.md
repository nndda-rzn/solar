# Audio System Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax.

**Goal:** Add immersive audio to the Cosmic Explorer — ambient background soundscape, UI sound effects, and navigation audio. Start with procedural audio (Web Audio API) for instant integration, then supplement with royalty-free ambient assets from Pixabay.

**Architecture:** Three-layer audio system: (1) `AudioManager` singleton wrapping Howler.js for asset-based audio, (2) `ProceduralAudio` utility using Web Audio API for generated sounds, (3) Zustand `useSettingsStore` extended with audio controls (mute, volume, ambient toggle). All audio respects `reducedMotion` preference.

**Tech Stack:** Howler.js (already in package.json), Web Audio API (built-in browser), Zustand settings store (existing `useSettings`).

**Assets to download:** 1-2 ambient space soundscapes from Pixabay (CC0, ~3-5MB total as mp3).

**Verification:** `npx tsc --noEmit && npm run test && npm run build` after each phase. Manual smoke test: play/pause, mute toggle, volume slider, audio across page navigation.

---

## File Structure

### Files Created

- `src/lib/audio/procedural.ts` — Web Audio API procedural sound generators (Phase 1)
- `src/lib/audio/audio-manager.ts` — Howler.js wrapper singleton (Phase 2)
- `src/hooks/useAudio.ts` — React hook bridging audio system with settings store (Phase 1)
- `src/components/ui/AudioSettings.tsx` — Mute/volume/ambient toggle component (Phase 3)

### Files Modified

- `src/hooks/useSettings.ts` — Add audio state fields (muted: boolean, volume: number, ambientEnabled: boolean)
- `src/components/ui/SettingsModal.tsx` — Add audio controls panel
- `src/components/ui/HUD.tsx` — Mount audio hook
- `src/components/cosmic-explorer/CosmicExplorer.tsx` — Play ambient on mount
- `src/messages/en/settings.json` and `src/messages/id/settings.json` — Audio i18n keys

### External Assets

- `public/audio/ambient-space.mp3` — Download from Pixabay (Phase 4)

---

## Phase 1: Procedural Audio + Settings Foundation

### Task 1.1: Add audio state to settings store

**Files:**

- Modify: `src/hooks/useSettings.ts`

- [ ] **Step 1: Read current useSettings**

Read `src/hooks/useSettings.ts` to understand current state shape and persist mechanism.

- [ ] **Step 2: Add audio fields**

Add three new state fields and their setters:

```typescript
interface SettingsState {
  // ... existing fields (perfMode, locale, etc.)
  muted: boolean;
  ambientEnabled: boolean;
  volume: number; // 0.0 to 1.0
  setMuted: (muted: boolean) => void;
  setAmbientEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

// Default values
muted: false,
ambientEnabled: true,
volume: 0.5,
```

If the store uses localStorage persistence, these new fields will be automatically persisted.

- [ ] **Step 3: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useSettings.ts
git commit -m "feat(audio): add audio state fields to settings store"
```

---

### Task 1.2: Create procedural audio module

**Files:**

- Create: `src/lib/audio/procedural.ts`

- [ ] **Step 1: Create the file**

```typescript
let audioContext: AudioContext | null = null;

function getContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

export function playNavigateWhoosh(volume: number) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(800, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3);

  gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

export function playSelectPlanet(volume: number, frequency: number = 440) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(frequency, ctx.currentTime);
  osc.frequency.setValueAtTime(frequency * 1.5, ctx.currentTime + 0.1);

  gain.gain.setValueAtTime(volume * 0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.25);
}

export function playAchievementUnlock(volume: number) {
  const ctx = getContext();

  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;

    const startTime = ctx.currentTime + i * 0.12;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.12, startTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
}

export function playButtonClick(volume: number) {
  const ctx = getContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(volume * 0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}
```

- [ ] **Step 2: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/audio/procedural.ts
git commit -m "feat(audio): add procedural sound generators (Web Audio API)"
```

---

### Task 1.3: Create useAudio hook

**Files:**

- Create: `src/hooks/useAudio.ts`

- [ ] **Step 1: Create the hook**

```typescript
"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSettings } from "@/hooks/useSettings";
import {
  playNavigateWhoosh,
  playSelectPlanet,
  playAchievementUnlock,
  playButtonClick,
} from "@/lib/audio/procedural";
import { cosmicEventBus } from "@/lib/events/event-bus";

export function useAudio() {
  const muted = useSettings((s) => s.muted);
  const volume = useSettings((s) => s.volume);
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);

  useEffect(() => {
    mutedRef.current = muted;
    volumeRef.current = volume;
  }, [muted, volume]);

  const ifNotMuted = useCallback((fn: (volume: number) => void) => {
    if (!mutedRef.current) fn(volumeRef.current);
  }, []);

  useEffect(() => {
    const unsubs = [
      cosmicEventBus.on("planet_visited", () =>
        ifNotMuted((v) => playSelectPlanet(v, 220 + Math.random() * 660)),
      ),
      cosmicEventBus.on("star_visited", () =>
        ifNotMuted((v) => playSelectPlanet(v, 880)),
      ),
      cosmicEventBus.on("constellation_visited", () =>
        ifNotMuted((v) => playSelectPlanet(v, 1320)),
      ),
      cosmicEventBus.on("bookmark_saved", () =>
        ifNotMuted((v) => playButtonClick(v)),
      ),
      cosmicEventBus.on("achievement_unlocked", () =>
        ifNotMuted((v) => playAchievementUnlock(v)),
      ),
      cosmicEventBus.on("scale_reached", () =>
        ifNotMuted((v) => playNavigateWhoosh(v)),
      ),
    ];

    return () => unsubs.forEach((u) => u());
  }, [ifNotMuted]);

  const playClick = useCallback(
    () => ifNotMuted(playButtonClick),
    [ifNotMuted],
  );

  return { playClick };
}
```

- [ ] **Step 2: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAudio.ts
git commit -m "feat(audio): add useAudio hook bridging events to procedural sounds"
```

---

### Task 1.4: Mount useAudio in HUD

**Files:**

- Modify: `src/components/ui/HUD.tsx`

- [ ] **Step 1: Add useAudio hook call**

Inside the HUD component, add:

```typescript
import { useAudio } from "@/hooks/useAudio";

// Inside HUD():
const { playClick } = useAudio();
```

Mount the hook. The event bus subscriptions inside useAudio will pick up events and play sounds automatically.

- [ ] **Step 2: Add click sound to interactive elements**

Find buttons/controls inside HUD that benefit from click feedback and add `onClick` wrapper:

```typescript
onClick={() => { playClick(); originalHandler(); }}
```

- [ ] **Step 3: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Manual smoke test**

Run `npm run dev`. Click a planet — should hear a subtle ping. Switch scale — should hear whoosh. Unlock achievement — should hear ascending chime.

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/HUD.tsx
git commit -m "feat(audio): mount useAudio hook in HUD for procedural SFX"
```

---

### Task 1.5: Add audio controls to Settings modal

**Files:**

- Modify: `src/components/ui/SettingsModal.tsx`

- [ ] **Step 1: Add audio section**

Add controls inside the Settings modal for:

- Mute toggle (switch)
- Volume slider (range 0-100)
- Ambient sound toggle (switch)

```tsx
<div className="border-t border-white/10 pt-4">
  <h3 className="text-sm font-medium text-white/80">{t("audio.title")}</h3>

  <div className="mt-3 flex items-center justify-between">
    <label className="text-sm text-white/60">{t("audio.mute")}</label>
    <button onClick={toggleMute}>
      {muted ? <VolumeX /> : <Volume2 />}
    </button>
  </div>

  <div className="mt-2">
    <label className="text-sm text-white/60">{t("audio.volume")}</label>
    <input type="range" min={0} max={100} value={volume * 100} onChange={...} />
  </div>

  <div className="mt-2 flex items-center justify-between">
    <label className="text-sm text-white/60">{t("audio.ambient")}</label>
    <button onClick={toggleAmbient} className={ambientEnabled ? "text-cosmic-accent" : ""}>
      ...
    </button>
  </div>
</div>
```

- [ ] **Step 2: Add i18n keys**

Add to `src/messages/en/settings.json` and `src/messages/id/settings.json`:

```json
"audio": {
  "title": "Audio",
  "mute": "Mute",
  "volume": "Volume",
  "ambient": "Ambient"
}
```

(ID version: "Audio", "Bisu", "Volume", "Ambient")

- [ ] **Step 3: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/SettingsModal.tsx src/messages/en/settings.json src/messages/id/settings.json
git commit -m "feat(audio): add audio controls to settings modal"
```

---

## Phase 2: Ambient Audio + Howler.js Integration

### Task 2.1: Create AudioManager singleton

**Files:**

- Create: `src/lib/audio/audio-manager.ts`

- [ ] **Step 1: Create the file**

```typescript
import { Howl } from "howler";

interface TrackConfig {
  src: string;
  volume: number;
  loop: boolean;
}

class AudioManager {
  private tracks: Map<string, Howl> = new Map();

  load(key: string, config: TrackConfig) {
    const howl = new Howl({
      src: [config.src],
      volume: config.volume,
      loop: config.loop,
    });
    this.tracks.set(key, howl);
    return howl;
  }

  play(key: string) {
    const track = this.tracks.get(key);
    if (track && !track.playing()) {
      track.play();
    }
  }

  stop(key: string) {
    const track = this.tracks.get(key);
    if (track) {
      track.stop();
    }
  }

  fadeOut(key: string, duration: number = 1000) {
    const track = this.tracks.get(key);
    if (track) {
      track.fade(track.volume(), 0, duration);
    }
  }

  setVolume(key: string, volume: number) {
    const track = this.tracks.get(key);
    if (track) {
      track.volume(volume);
    }
  }

  muteAll() {
    this.tracks.forEach((t) => t.mute(true));
  }

  unmuteAll() {
    this.tracks.forEach((t) => t.mute(false));
  }
}

export const audioManager = new AudioManager();
```

- [ ] **Step 2: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/lib/audio/audio-manager.ts
git commit -m "feat(audio): add AudioManager singleton wrapping Howler.js"
```

---

### Task 2.2: Add ambient playback to CosmicExplorer

**Files:**

- Modify: `src/components/cosmic-explorer/CosmicExplorer.tsx`

- [ ] **Step 1: Add ambient track loading and playback**

```typescript
import { useEffect } from "react";
import { audioManager } from "@/lib/audio/audio-manager";
import { useSettings } from "@/hooks/useSettings";

// Inside CosmicExplorer():
const ambientEnabled = useSettings((s) => s.ambientEnabled);
const muted = useSettings((s) => s.muted);
const volume = useSettings((s) => s.volume);

useEffect(() => {
  audioManager.load("ambient", {
    src: "/audio/ambient-space.mp3",
    volume: 0.3,
    loop: true,
  });

  return () => {
    audioManager.stop("ambient");
  };
}, []);

useEffect(() => {
  if (muted) {
    audioManager.muteAll();
  } else {
    audioManager.unmuteAll();
  }
}, [muted]);

useEffect(() => {
  audioManager.setVolume("ambient", volume * 0.3);
}, [volume]);

useEffect(() => {
  if (ambientEnabled && !muted) {
    audioManager.play("ambient");
  } else {
    audioManager.fadeOut("ambient");
  }
}, [ambientEnabled, muted]);
```

- [ ] **Step 2: Verify TS**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add src/components/cosmic-explorer/CosmicExplorer.tsx
git commit -m "feat(audio): add ambient background playback in explorer"
```

---

### Task 2.3: Download ambient audio asset

**Files:**

- Download: `public/audio/ambient-space.mp3`

- [ ] **Step 1: Download from Pixabay**

Download "Ambient soundscapes 001" by AudioPapkin from:
`https://pixabay.com/sound-effects/ambient-soundscapes-001-172187/`

Or use the shorter "Deep Space Loop" by IdoBerg (12s, loopable):
`https://pixabay.com/sound-effects/deep-space-loop-246127/`

Save as: `public/audio/ambient-space.mp3`

- [ ] **Step 2: Verify file exists and plays**

Run: `npm run dev`, open `/en`, verify ambient plays in background.

- [ ] **Step 3: Commit**

```bash
git add public/audio/ambient-space.mp3
git commit -m "feat(audio): add ambient space soundscape asset"
```

---

## Phase 3: Polish + Integration

### Task 3.1: Connect mute/volume to AudioManager

**Files:**

- Modify: `src/hooks/useAudio.ts`

- [ ] **Step 1: Add AudioManager integration**

In the `useAudio` hook, add a `useEffect` that syncs settings to AudioManager:

```typescript
useEffect(() => {
  if (muted) {
    audioManager.muteAll();
  } else {
    audioManager.unmuteAll();
  }
}, [muted]);
```

- [ ] **Step 2: Verify TS and test**

Run: `npx tsc --noEmit && npm run test`

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useAudio.ts
git commit -m "feat(audio): sync mute state to AudioManager"
```

---

### Task 3.2: Full verification + smoke test

- [ ] **Step 1: Run all checks**

```bash
npx tsc --noEmit && npm run lint && npm run test && npm run build
```

Expected: all pass.

- [ ] **Step 2: Smoke test checklist**

| Test                        | Expected                                     |
| --------------------------- | -------------------------------------------- |
| Klik planet                 | Dengar subtle ping (nada berbeda per planet) |
| Zoom ke stellar             | Dengar whoosh                                |
| Unlock achievement          | Dengar ascending chime                       |
| Bookmark planet             | Dengar click tone                            |
| Settings → mute ON          | Semua suara berhenti                         |
| Settings → volume slider    | Volume berubah                               |
| Settings → ambient OFF      | Background hening                            |
| Reload page → open settings | Mute/volume state persists                   |
| `/id` → settings modal      | Label Bahasa Indonesia                       |

- [ ] **Step 3: Commit any final tweaks**

---

## Rollback Plan

- Procedural audio: zero external dependencies. If broken, comment out `useAudio()` call in HUD.
- Ambient audio: remove `public/audio/ambient-space.mp3` and the `useEffect` in CosmicExplorer.
- Settings: remove audio fields from useSettings, revert SettingsModal to previous state.
