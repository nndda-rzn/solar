import { create } from "zustand";
import {
  clampDayOffset,
  MAX_DAY_OFFSET,
  MS_PER_DAY,
  SECONDS_PER_DAY,
} from "@/lib/config/simulation";

interface SimulationState {
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;

  speed: number;
  setSpeed: (speed: number) => void;

  dayOffset: number;
  maxDayOffset: number;
  setDayOffset: (dayOffset: number) => void;
  advanceDayOffset: (delta: number) => void;
  jumpToDate: (date: Date) => void;

  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  isPlaying: true,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),

  speed: 1,
  setSpeed: (speed) => set({ speed }),

  dayOffset: 0,
  maxDayOffset: MAX_DAY_OFFSET,
  setDayOffset: (dayOffset) => set({ dayOffset: clampDayOffset(dayOffset) }),
  advanceDayOffset: (delta) => {
    const state = get();
    if (!state.isPlaying) return;
    const newOffset = state.dayOffset + (delta / SECONDS_PER_DAY) * state.speed;
    set({ dayOffset: clampDayOffset(newOffset) });
  },
  jumpToDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = (date.getTime() - today.getTime()) / MS_PER_DAY;
    set({ dayOffset: clampDayOffset(Math.floor(diff)) });
  },

  reset: () => set({ isPlaying: true, speed: 1 }),
}));
