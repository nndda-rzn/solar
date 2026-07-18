import {
  MS_PER_DAY,
  SECONDS_PER_DAY,
  DAYS_PER_YEAR,
  MAX_DAY_OFFSET,
  clampDayOffset,
  SPEED_PRESETS,
  JUMP_AMOUNTS,
} from "../simulation";

describe("clampDayOffset", () => {
  it("returns value when within bounds", () => {
    expect(clampDayOffset(100)).toBe(100);
  });

  it("clamps below 0", () => {
    expect(clampDayOffset(-50)).toBe(0);
  });

  it("clamps above MAX_DAY_OFFSET", () => {
    expect(clampDayOffset(MAX_DAY_OFFSET + 1000)).toBe(MAX_DAY_OFFSET);
  });

  it("returns 0 when value is 0", () => {
    expect(clampDayOffset(0)).toBe(0);
  });
});

describe("time constants", () => {
  it("MS_PER_DAY equals SECONDS_PER_DAY multiplied by 1000", () => {
    expect(MS_PER_DAY).toBe(SECONDS_PER_DAY * 1000);
  });

  it("DAYS_PER_YEAR is positive", () => {
    expect(DAYS_PER_YEAR).toBeGreaterThan(0);
  });
});

describe("presets", () => {
  it("SPEED_PRESETS has 7 entries", () => {
    expect(SPEED_PRESETS).toHaveLength(7);
  });

  it("JUMP_AMOUNTS today entry has delta 0", () => {
    const today = JUMP_AMOUNTS.find((p) => p.key === "today");
    expect(today?.delta).toBe(0);
  });
});
