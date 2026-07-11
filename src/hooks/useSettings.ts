"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PerfMode = "high" | "low";

interface SettingsState {
  perfMode: PerfMode;
  setPerfMode: (mode: PerfMode) => void;
  muted: boolean;
  setMuted: (muted: boolean) => void;
  ambientEnabled: boolean;
  setAmbientEnabled: (enabled: boolean) => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      perfMode: "high",
      setPerfMode: (perfMode) => set({ perfMode }),
      muted: false,
      setMuted: (muted) => set({ muted }),
      ambientEnabled: true,
      setAmbientEnabled: (ambientEnabled) => set({ ambientEnabled }),
      volume: 0.5,
      setVolume: (volume) => set({ volume }),
    }),
    { name: "cosmic-settings" },
  ),
);
