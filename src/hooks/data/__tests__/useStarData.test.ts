import { renderHook } from "@testing-library/react";
import { useStarData } from "../useStarData";

describe("useStarData", () => {
  it("returns positioned stars", () => {
    const { result } = renderHook(() => useStarData());
    expect(result.current.stars.length).toBeGreaterThan(0);
    expect(result.current.stars[0]).toHaveProperty("x");
    expect(result.current.stars[0]).toHaveProperty("y");
    expect(result.current.stars[0]).toHaveProperty("z");
  });

  it("getStarById returns correct star", () => {
    const { result } = renderHook(() => useStarData());
    const sirius = result.current.getStarById("sirius");
    expect(sirius?.name).toBe("Sirius");
  });

  it("getStarById returns undefined for unknown id", () => {
    const { result } = renderHook(() => useStarData());
    expect(result.current.getStarById("nonexistent")).toBeUndefined();
  });
});
