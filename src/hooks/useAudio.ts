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
