import { create } from "zustand";

interface SelectionState {
  selectedPlanet: string | null;
  selectedStar: string | null;
  selectedConstellation: string | null;
  selectPlanet: (planet: string | null) => void;
  selectStar: (star: string | null) => void;
  selectConstellation: (constellation: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedPlanet: null,
  selectedStar: null,
  selectedConstellation: null,
  selectPlanet: (planet) => set({ selectedPlanet: planet }),
  selectStar: (star) => set({ selectedStar: star }),
  selectConstellation: (constellation) =>
    set({ selectedConstellation: constellation }),
}));
