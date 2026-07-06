import { create } from "zustand";

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

export const useSimulationStore = create<SimulationState>((set) => ({
  isPlaying: true,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),

  speed: 1,
  setSpeed: (speed) => set({ speed }),

  dayOffset: 0,
  maxDayOffset: 36500,
  setDayOffset: (dayOffset) =>
    set({ dayOffset: Math.max(0, Math.min(36500, dayOffset)) }),
  advanceDayOffset: (delta) =>
    set((state) => ({
      dayOffset: state.isPlaying
        ? Math.max(
            0,
            Math.min(36500, state.dayOffset + (delta / 86400) * state.speed),
          )
        : state.dayOffset,
    })),
  jumpToDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((date.getTime() - today.getTime()) / 86400000);
    set({ dayOffset: Math.max(0, Math.min(36500, diff)) });
  },

  reset: () => set({ isPlaying: true, speed: 1 }),
}));
