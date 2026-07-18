import { renderHook } from "@testing-library/react";
import { useConstellationData } from "../useConstellationData";

describe("useConstellationData", () => {
  it("returns constellations", () => {
    const { result } = renderHook(() => useConstellationData());
    expect(result.current.constellations.length).toBeGreaterThan(0);
  });

  it("getConstellationById returns correct constellation", () => {
    const { result } = renderHook(() => useConstellationData());
    const orion = result.current.getConstellationById("orion");
    expect(orion?.name).toBe("Orion");
  });

  it("getConstellationById returns undefined for unknown id", () => {
    const { result } = renderHook(() => useConstellationData());
    expect(result.current.getConstellationById("nonexistent")).toBeUndefined();
  });
});
