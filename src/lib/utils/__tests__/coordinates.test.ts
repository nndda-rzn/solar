import {
  raDecToCartesian,
  magnitudeToSize,
  magnitudeToGlowScale,
  positionStar,
} from "../coordinates";
import { StarData } from "@/types/celestial/star";

describe("raDecToCartesian", () => {
  it("converts RA=0, Dec=0 to point on +X axis", () => {
    const { x, y, z } = raDecToCartesian(0, 0, 1000);
    expect(x).toBeCloseTo(1000, 1);
    expect(y).toBeCloseTo(0, 1);
    expect(z).toBeCloseTo(0, 1);
  });

  it("converts RA=90, Dec=0 to point on +Z axis", () => {
    const { x, y, z } = raDecToCartesian(90, 0, 1000);
    expect(x).toBeCloseTo(0, 1);
    expect(y).toBeCloseTo(0, 1);
    expect(z).toBeCloseTo(1000, 1);
  });

  it("converts Dec=90 (north celestial pole) to +Y axis", () => {
    const { x, y, z } = raDecToCartesian(0, 90, 1000);
    expect(x).toBeCloseTo(0, 1);
    expect(y).toBeCloseTo(1000, 1);
    expect(z).toBeCloseTo(0, 1);
  });

  it("converts Dec=-90 (south celestial pole) to -Y axis", () => {
    const { x, y, z } = raDecToCartesian(0, -90, 1000);
    expect(x).toBeCloseTo(0, 1);
    expect(y).toBeCloseTo(-1000, 1);
    expect(z).toBeCloseTo(0, 1);
  });

  it("converts RA=180, Dec=0 to -X axis", () => {
    const { x, y, z } = raDecToCartesian(180, 0, 1000);
    expect(x).toBeCloseTo(-1000, 1);
    expect(y).toBeCloseTo(0, 1);
    expect(z).toBeCloseTo(0, 1);
  });

  it("uses default radius of 1000 when not specified", () => {
    const { x } = raDecToCartesian(0, 0);
    expect(x).toBeCloseTo(1000, 1);
  });
});

describe("magnitudeToSize", () => {
  it("returns max size (3.0) for brightest star (mag -1.5)", () => {
    expect(magnitudeToSize(-1.5)).toBeCloseTo(3.0, 1);
  });

  it("returns min size (0.5) for dimmest visible star (mag 6)", () => {
    expect(magnitudeToSize(6)).toBeCloseTo(0.5, 1);
  });

  it("returns mid size for mag 2.25", () => {
    const size = magnitudeToSize(2.25);
    expect(size).toBeGreaterThan(1.0);
    expect(size).toBeLessThan(2.0);
  });

  it("clamps magnitude above 6 to min size", () => {
    expect(magnitudeToSize(10)).toBeCloseTo(0.5, 1);
  });

  it("clamps magnitude below -1.5 to max size", () => {
    expect(magnitudeToSize(-5)).toBeCloseTo(3.0, 1);
  });
});

describe("magnitudeToGlowScale", () => {
  it("returns max glow (4.0) for brightest star (mag -1.5)", () => {
    expect(magnitudeToGlowScale(-1.5)).toBeCloseTo(4.0, 1);
  });

  it("returns min glow (1.5) for dimmest visible star (mag 6)", () => {
    expect(magnitudeToGlowScale(6)).toBeCloseTo(1.5, 1);
  });

  it("clamps magnitude above 6 to min glow", () => {
    expect(magnitudeToGlowScale(10)).toBeCloseTo(1.5, 1);
  });

  it("clamps magnitude below -1.5 to max glow", () => {
    expect(magnitudeToGlowScale(-5)).toBeCloseTo(4.0, 1);
  });

  it("returns mid glow for mag 2.25", () => {
    const glow = magnitudeToGlowScale(2.25);
    expect(glow).toBeGreaterThan(1.5);
    expect(glow).toBeLessThan(4.0);
  });

  it("gives brighter stars larger glow than dimmer stars", () => {
    const siriusGlow = magnitudeToGlowScale(-1.46);
    const dimStarGlow = magnitudeToGlowScale(4.3);
    expect(siriusGlow).toBeGreaterThan(dimStarGlow);
  });
});

describe("positionStar", () => {
  const mockStar: StarData = {
    id: "test",
    name: "Test Star",
    hip: 12345,
    ra: 45,
    dec: 30,
    magnitude: 1.0,
    spectralType: "A0V",
    color: "#ffffff",
    distance: 100,
    content: {
      en: { description: "Test", facts: [] },
      id: { description: "Test", facts: [] },
    },
  };

  it("returns star with x, y, z coordinates", () => {
    const positioned = positionStar(mockStar);
    expect(positioned.x).toBeDefined();
    expect(positioned.y).toBeDefined();
    expect(positioned.z).toBeDefined();
  });

  it("preserves all original star data", () => {
    const positioned = positionStar(mockStar);
    expect(positioned.id).toBe(mockStar.id);
    expect(positioned.name).toBe(mockStar.name);
    expect(positioned.ra).toBe(mockStar.ra);
  });
});
