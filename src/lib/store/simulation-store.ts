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
  setDayOffset: (dayOffset: number) => void;

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
  setDayOffset: (dayOffset) => set({ dayOffset }),

  // Reset all
  reset: () => set({ isPlaying: true, speed: 1, dayOffset: 0 }),
}));
