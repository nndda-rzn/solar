import { create } from "zustand";
import { ScaleMode } from "@/config/scales";
import * as THREE from "three";

interface ExplorerState {
  // Scale navigation
  scale: ScaleMode;
  setScale: (scale: ScaleMode) => void;

  // Selected object
  selectedPlanet: string | null;
  selectPlanet: (planet: string | null) => void;

  // Hovered object
  hoveredPlanet: string | null;
  hoverPlanet: (planet: string | null) => void;

  // Transition state
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;

  // Camera fly-to target
  cameraTarget: THREE.Vector3 | null;
  setCameraTarget: (target: THREE.Vector3 | null) => void;

  // Info panel
  isInfoPanelOpen: boolean;
  toggleInfoPanel: () => void;
  setInfoPanelOpen: (isOpen: boolean) => void;

  // Search
  isSearchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (isOpen: boolean) => void;
}

export const useExplorerStore = create<ExplorerState>((set) => ({
  // Scale navigation
  scale: "solar",
  setScale: (scale) => set({ scale }),

  // Selected object
  selectedPlanet: null,
  selectPlanet: (planet) => set({ selectedPlanet: planet }),

  // Hovered object
  hoveredPlanet: null,
  hoverPlanet: (planet) => set({ hoveredPlanet: planet }),

  // Transition state
  isTransitioning: false,
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

  // Camera fly-to target
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // Info panel
  isInfoPanelOpen: false,
  toggleInfoPanel: () =>
    set((state) => ({ isInfoPanelOpen: !state.isInfoPanelOpen })),
  setInfoPanelOpen: (isOpen) => set({ isInfoPanelOpen: isOpen }),

  // Search
  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (isOpen) => set({ isSearchOpen: isOpen }),
}));
