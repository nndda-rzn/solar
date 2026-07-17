import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TourState {
  isTourActive: boolean;
  currentStep: number;
  hasCompletedTour: boolean;
  startTour: () => void;
  nextStep: (totalSteps: number) => void;
  skipTour: () => void;
  completeTour: () => void;
}

export const useTourStore = create<TourState>()(
  persist(
    (set) => ({
      isTourActive: false,
      currentStep: 0,
      hasCompletedTour: false,

      startTour: () => set({ isTourActive: true, currentStep: 0 }),

      nextStep: (totalSteps: number) =>
        set((s) => {
          if (s.currentStep + 1 >= totalSteps) {
            return {
              isTourActive: false,
              currentStep: 0,
              hasCompletedTour: true,
            };
          }
          return { currentStep: s.currentStep + 1 };
        }),

      skipTour: () =>
        set({ isTourActive: false, currentStep: 0, hasCompletedTour: true }),

      completeTour: () =>
        set({ isTourActive: false, currentStep: 0, hasCompletedTour: true }),
    }),
    {
      name: "cosmic-tour",
      partialize: (state) => ({ hasCompletedTour: state.hasCompletedTour }),
    },
  ),
);
