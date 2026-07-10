import { validateStellarData } from "../validate-stellar-data";
import { StarCatalog } from "@/types/celestial/star";
import { ConstellationCatalog } from "@/types/celestial/constellation";

describe("validateStellarData", () => {
  const validStars: StarCatalog = {
    stars: [
      {
        id: "sirius",
        name: "Sirius",
        hip: 32349,
        ra: 101,
        dec: -16,
        magnitude: -1.46,
        spectralType: "A1V",
        color: "#fff",
        distance: 8.6,
        content: {
          en: { description: "Bright", facts: ["Brightest"] },
          id: { description: "Terang", facts: ["Paling terang"] },
        },
      },
    ],
  };

  const validConstellations: ConstellationCatalog = {
    constellations: [
      {
        id: "canis-major",
        name: "Canis Major",
        indonesianName: "Anjing Besar",
        abbreviation: "CMa",
        bestViewing: "January",
        center: { x: 0.5, y: 0.5 },
        stars: ["sirius"],
        canvasStars: [],
        lines: [],
        content: {
          en: { description: "Dog", mythology: "Myth" },
          id: { description: "Anjing", mythology: "Mitos" },
        },
      },
    ],
  };

  it("passes for valid data", () => {
    const result = validateStellarData(validStars, validConstellations);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it("errors when constellation references missing star", () => {
    const badConstellations: ConstellationCatalog = {
      constellations: [
        {
          ...validConstellations.constellations[0]!,
          lines: [{ from: "sirius", to: "nonexistent" }],
        },
      ],
    };
    const result = validateStellarData(validStars, badConstellations);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("nonexistent");
  });

  it("errors for RA out of range", () => {
    const badStars: StarCatalog = {
      stars: [{ ...validStars.stars[0]!, ra: 400 }],
    };
    const result = validateStellarData(badStars, validConstellations);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("RA");
  });

  it("errors for Dec out of range", () => {
    const badStars: StarCatalog = {
      stars: [{ ...validStars.stars[0]!, dec: -100 }],
    };
    const result = validateStellarData(badStars, validConstellations);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Dec");
  });

  it("errors for duplicate star IDs", () => {
    const dupStars: StarCatalog = {
      stars: [validStars.stars[0]!, validStars.stars[0]!],
    };
    const result = validateStellarData(dupStars, validConstellations);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toContain("Duplicate");
  });
});
