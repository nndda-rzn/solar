"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type PerfMode = "high" | "low";

interface SettingsState {
  perfMode: PerfMode;
  setPerfMode: (mode: PerfMode) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      perfMode: "high",
      setPerfMode: (perfMode) => set({ perfMode }),
    }),
    { name: "cosmic-settings" },
  ),
);
