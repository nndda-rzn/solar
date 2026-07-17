import { useSelectionStore } from "../selection-store";

describe("useSelectionStore", () => {
  beforeEach(() => {
    useSelectionStore.setState({
      selectedPlanet: null,
      selectedStar: null,
      selectedConstellation: null,
    });
  });

  it("selectPlanet sets selectedPlanet", () => {
    useSelectionStore.getState().selectPlanet("earth");
    expect(useSelectionStore.getState().selectedPlanet).toBe("earth");
  });

  it("selectPlanet(null) deselects", () => {
    useSelectionStore.getState().selectPlanet("earth");
    useSelectionStore.getState().selectPlanet(null);
    expect(useSelectionStore.getState().selectedPlanet).toBeNull();
  });

  it("selectStar and selectConstellation work independently", () => {
    useSelectionStore.getState().selectStar("sirius");
    useSelectionStore.getState().selectConstellation("orion");
    expect(useSelectionStore.getState().selectedStar).toBe("sirius");
    expect(useSelectionStore.getState().selectedConstellation).toBe("orion");
  });
});
