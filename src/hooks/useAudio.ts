"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { useSettings } from "@/hooks/useSettings";
import {
  playNavigateWhoosh,
  playSelectPlanet,
  playAchievementUnlock,
  playButtonClick,
} from "@/lib/audio/procedural";
import { audioManager } from "@/lib/audio/audio-manager";
import { cosmicEventBus } from "@/lib/events/event-bus";

// ---------------------------------------------------------------------------
// Ambient track mapping
// ---------------------------------------------------------------------------

const AMBIENT_TRACKS = {
  solar: "/audio/monume-space-ambient-547940.mp3",
  stellar:
    "/audio/audiopapkin-ambient-soundscapes-007-space-atmosphere-304974.mp3",
  cosmic: "/audio/atlasaudio-drone-ambient-518685.mp3",
} as const;

type AmbientKey = keyof typeof AMBIENT_TRACKS;

function scaleToAmbient(scale: string): AmbientKey {
  if (scale === "cosmic") return "cosmic";
  if (scale === "galactic" || scale === "stellar") return "stellar";
  return "solar";
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAudio() {
  const muted = useSettings((s) => s.muted);
  const volume = useSettings((s) => s.volume);
  const ambientEnabled = useSettings((s) => s.ambientEnabled);

  // Refs so event-bus callbacks never close over stale values
  const mutedRef = useRef(muted);
  const volumeRef = useRef(volume);
  const ambientEnabledRef = useRef(ambientEnabled);
  const activeAmbientKey = useRef<AmbientKey>("solar");
  const loadedRef = useRef(false);

  // Stop ambient when navigating away from explorer root (/en or /id)
  const pathname = usePathname();
  const isExplorer = /^\/[a-z]{2}\/?$/.test(pathname);

  useEffect(() => {
    if (!loadedRef.current) return;
    if (isExplorer && !muted && ambientEnabled) {
      audioManager.fadeIn(activeAmbientKey.current, volume, 1500);
    } else if (!isExplorer) {
      (Object.keys(AMBIENT_TRACKS) as AmbientKey[]).forEach((key) =>
        audioManager.fadeOutAndStop(key, 1000),
      );
    }
  }, [isExplorer]);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  useEffect(() => {
    ambientEnabledRef.current = ambientEnabled;
  }, [ambientEnabled]);

  // -------------------------------------------------------------------------
  // Guard helper for procedural SFX
  // -------------------------------------------------------------------------

  const ifNotMuted = useCallback((fn: (volume: number) => void) => {
    if (!mutedRef.current) fn(volumeRef.current);
  }, []);

  // -------------------------------------------------------------------------
  // Load ambient tracks once on mount, stop all on unmount
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    (Object.entries(AMBIENT_TRACKS) as [AmbientKey, string][]).forEach(
      ([key, src]) => {
        audioManager.load(key, { src, volume: 0, loop: true });
      },
    );

    // Auto-play initial track after a short delay (browser autoplay policy)
    const timer = setTimeout(() => {
      if (!mutedRef.current && ambientEnabledRef.current) {
        audioManager.fadeIn("solar", volumeRef.current, 3000);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
      (Object.keys(AMBIENT_TRACKS) as AmbientKey[]).forEach((key) =>
        audioManager.fadeOutAndStop(key, 500),
      );
    };
  }, []); // intentional: load once

  // -------------------------------------------------------------------------
  // React to ambientEnabled / muted toggle
  // -------------------------------------------------------------------------

  useEffect(() => {
    const key = activeAmbientKey.current;
    if (muted || !ambientEnabled) {
      audioManager.fadeOut(key, 1500);
    } else {
      audioManager.fadeIn(key, volume, 1500);
    }
  }, [ambientEnabled, muted]);

  // -------------------------------------------------------------------------
  // React to volume changes (no fade, immediate)
  // -------------------------------------------------------------------------

  useEffect(() => {
    if (!muted && ambientEnabled) {
      audioManager.setVolume(activeAmbientKey.current, volume);
    }
  }, [volume, muted, ambientEnabled]);

  // -------------------------------------------------------------------------
  // Procedural SFX + crossfade on scale change
  // -------------------------------------------------------------------------

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
      cosmicEventBus.on("scale_reached", (e) => {
        // Procedural whoosh
        ifNotMuted((v) => playNavigateWhoosh(v));

        // Ambient crossfade
        const newKey = scaleToAmbient(e.payload.scale);
        if (newKey === activeAmbientKey.current) return;

        audioManager.fadeOut(activeAmbientKey.current, 2000);

        if (!mutedRef.current && ambientEnabledRef.current) {
          audioManager.fadeIn(newKey, volumeRef.current, 2000);
        }

        activeAmbientKey.current = newKey;
      }),
    ];

    return () => unsubs.forEach((u) => u());
  }, [ifNotMuted]);

  // -------------------------------------------------------------------------

  const playClick = useCallback(
    () => ifNotMuted(playButtonClick),
    [ifNotMuted],
  );

  return { playClick };
}
