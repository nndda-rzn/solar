import { create } from "zustand";

interface SimulationState {
  // Playback
  isPlaying: boolean;
  togglePlay: () => void;
  setPlaying: (isPlaying: boolean) => void;

  // Speed
  speed: number;
  setSpeed: (speed: number) => void;

  // Day offset (simulation time)
  dayOffset: number;
  maxDayOffset: number;
  setDayOffset: (dayOffset: number) => void;
  advanceDayOffset: (delta: number) => void;
  jumpToDate: (date: Date) => void;

  // Reset
  reset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
  // Playback
  isPlaying: true,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlaying: (isPlaying) => set({ isPlaying }),

  // Speed (default 1x)
  speed: 1,
  setSpeed: (speed) => set({ speed }),

  // Day offset
  dayOffset: 0,
  maxDayOffset: 3650,
  setDayOffset: (dayOffset) =>
    set({ dayOffset: Math.max(0, Math.min(3650, dayOffset)) }),
  advanceDayOffset: (delta) =>
    set((state) => ({
      dayOffset: state.isPlaying
        ? Math.max(0, Math.min(3650, state.dayOffset + delta * state.speed))
        : state.dayOffset,
    })),
  jumpToDate: (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diff = Math.floor((date.getTime() - today.getTime()) / 86400000);
    set({ dayOffset: Math.max(0, Math.min(3650, diff)) });
  },

  // Reset (preserves dayOffset to not affect current date/time)
  reset: () => set({ isPlaying: true, speed: 1 }),
}));
