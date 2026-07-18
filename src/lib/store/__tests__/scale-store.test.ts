import { useScaleStore } from "../scale-store";

describe("useScaleStore", () => {
  beforeEach(() => {
    useScaleStore.setState({ scale: "solar" });
  });

  it("defaults to solar scale", () => {
    expect(useScaleStore.getState().scale).toBe("solar");
  });

  it("setScale changes scale", () => {
    useScaleStore.getState().setScale("stellar");
    expect(useScaleStore.getState().scale).toBe("stellar");
  });

  it("supports all 4 scales", () => {
    useScaleStore.getState().setScale("galactic");
    expect(useScaleStore.getState().scale).toBe("galactic");
    useScaleStore.getState().setScale("cosmic");
    expect(useScaleStore.getState().scale).toBe("cosmic");
  });
});
