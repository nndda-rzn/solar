import { useExplorerStore } from "../explorer-store";
import * as THREE from "three";

// Reset store between tests to avoid state leaking
const resetStore = () => {
  useExplorerStore.setState({
    scale: "solar",
    selectedPlanet: null,
    selectedStar: null,
    selectedConstellation: null,
    hoveredPlanet: null,
    hoveredStar: null,
    hoveredConstellation: null,
    isTransitioning: false,
    cameraTarget: null,
    isInfoPanelOpen: false,
    isSearchOpen: false,
  });
};

describe("useExplorerStore", () => {
  beforeEach(() => {
    resetStore();
  });

  describe("scale navigation", () => {
    it("defaults to solar scale", () => {
      expect(useExplorerStore.getState().scale).toBe("solar");
    });

    it("setScale updates the active scale", () => {
      useExplorerStore.getState().setScale("stellar");
      expect(useExplorerStore.getState().scale).toBe("stellar");
    });
  });

  describe("planet selection", () => {
    it("selectedPlanet defaults to null", () => {
      expect(useExplorerStore.getState().selectedPlanet).toBeNull();
    });

    it("selectPlanet stores the given id", () => {
      useExplorerStore.getState().selectPlanet("earth");
      expect(useExplorerStore.getState().selectedPlanet).toBe("earth");
    });

    it("selectPlanet(null) clears the selection", () => {
      useExplorerStore.getState().selectPlanet("mars");
      useExplorerStore.getState().selectPlanet(null);
      expect(useExplorerStore.getState().selectedPlanet).toBeNull();
    });
  });

  describe("star selection", () => {
    it("star and planet selections are independent", () => {
      useExplorerStore.getState().selectPlanet("earth");
      useExplorerStore.getState().selectStar("sirius");
      const state = useExplorerStore.getState();
      expect(state.selectedPlanet).toBe("earth");
      expect(state.selectedStar).toBe("sirius");
    });
  });

  describe("constellation selection", () => {
    it("selectConstellation stores the given id", () => {
      useExplorerStore.getState().selectConstellation("orion");
      expect(useExplorerStore.getState().selectedConstellation).toBe("orion");
    });
  });

  describe("hover state", () => {
    it("hoverPlanet updates hoveredPlanet only", () => {
      useExplorerStore.getState().hoverPlanet("jupiter");
      const state = useExplorerStore.getState();
      expect(state.hoveredPlanet).toBe("jupiter");
      expect(state.hoveredStar).toBeNull();
      expect(state.hoveredConstellation).toBeNull();
    });

    it("hoverStar and hoverPlanet are independent", () => {
      useExplorerStore.getState().hoverPlanet("earth");
      useExplorerStore.getState().hoverStar("vega");
      const state = useExplorerStore.getState();
      expect(state.hoveredPlanet).toBe("earth");
      expect(state.hoveredStar).toBe("vega");
    });
  });

  describe("info panel", () => {
    it("toggleInfoPanel flips the open state", () => {
      expect(useExplorerStore.getState().isInfoPanelOpen).toBe(false);
      useExplorerStore.getState().toggleInfoPanel();
      expect(useExplorerStore.getState().isInfoPanelOpen).toBe(true);
      useExplorerStore.getState().toggleInfoPanel();
      expect(useExplorerStore.getState().isInfoPanelOpen).toBe(false);
    });

    it("setInfoPanelOpen sets the state directly", () => {
      useExplorerStore.getState().setInfoPanelOpen(true);
      expect(useExplorerStore.getState().isInfoPanelOpen).toBe(true);
    });
  });

  describe("search", () => {
    it("toggleSearch flips the open state", () => {
      useExplorerStore.getState().toggleSearch();
      expect(useExplorerStore.getState().isSearchOpen).toBe(true);
    });
  });

  describe("camera target", () => {
    it("setCameraTarget stores the given vector", () => {
      const target = new THREE.Vector3(1, 2, 3);
      useExplorerStore.getState().setCameraTarget(target);
      expect(useExplorerStore.getState().cameraTarget).toBe(target);
    });

    it("setCameraTarget(null) clears the target", () => {
      useExplorerStore.getState().setCameraTarget(new THREE.Vector3());
      useExplorerStore.getState().setCameraTarget(null);
      expect(useExplorerStore.getState().cameraTarget).toBeNull();
    });
  });

  describe("transition state", () => {
    it("setIsTransitioning updates the flag", () => {
      useExplorerStore.getState().setIsTransitioning(true);
      expect(useExplorerStore.getState().isTransitioning).toBe(true);
    });
  });
});
