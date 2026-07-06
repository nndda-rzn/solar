import { create } from "zustand";
import { ScaleMode } from "@/config/scales";
import * as THREE from "three";

interface ExplorerState {
  // Scale navigation
  scale: ScaleMode;
  setScale: (scale: ScaleMode) => void;

  // Selected object (planets)
  selectedPlanet: string | null;
  selectPlanet: (planet: string | null) => void;

  // Selected object (stars)
  selectedStar: string | null;
  selectStar: (star: string | null) => void;

  // Selected object (constellations)
  selectedConstellation: string | null;
  selectConstellation: (constellation: string | null) => void;

  // Hovered object (planets)
  hoveredPlanet: string | null;
  hoverPlanet: (planet: string | null) => void;

  // Hovered object (stars)
  hoveredStar: string | null;
  hoverStar: (star: string | null) => void;

  // Hovered object (constellations)
  hoveredConstellation: string | null;
  hoverConstellation: (constellation: string | null) => void;

  // Transition state
  isTransitioning: boolean;
  setIsTransitioning: (isTransitioning: boolean) => void;

  // Camera fly-to target
  cameraTarget: THREE.Vector3 | null;
  setCameraTarget: (target: THREE.Vector3 | null) => void;

  // Camera position (for bookmark capture)
  cameraPosition: THREE.Vector3 | null;
  setCameraPosition: (pos: THREE.Vector3 | null) => void;

  // Bookmark modal
  isBookmarkModalOpen: boolean;
  toggleBookmarkModal: () => void;
  setBookmarkModalOpen: (isOpen: boolean) => void;

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

  // Selected object (planets)
  selectedPlanet: null,
  selectPlanet: (planet) => set({ selectedPlanet: planet }),

  // Selected object (stars)
  selectedStar: null,
  selectStar: (star) => set({ selectedStar: star }),

  // Selected object (constellations)
  selectedConstellation: null,
  selectConstellation: (constellation) =>
    set({ selectedConstellation: constellation }),

  // Hovered object (planets)
  hoveredPlanet: null,
  hoverPlanet: (planet) => set({ hoveredPlanet: planet }),

  // Hovered object (stars)
  hoveredStar: null,
  hoverStar: (star) => set({ hoveredStar: star }),

  // Hovered object (constellations)
  hoveredConstellation: null,
  hoverConstellation: (constellation) =>
    set({ hoveredConstellation: constellation }),

  // Transition state
  isTransitioning: false,
  setIsTransitioning: (isTransitioning) => set({ isTransitioning }),

  // Camera fly-to target
  cameraTarget: null,
  setCameraTarget: (target) => set({ cameraTarget: target }),

  // Camera position (for bookmark capture)
  cameraPosition: null,
  setCameraPosition: (pos) => set({ cameraPosition: pos }),

  // Bookmark modal
  isBookmarkModalOpen: false,
  toggleBookmarkModal: () =>
    set((state) => ({ isBookmarkModalOpen: !state.isBookmarkModalOpen })),
  setBookmarkModalOpen: (isOpen) => set({ isBookmarkModalOpen: isOpen }),

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
