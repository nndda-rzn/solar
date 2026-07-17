import starCatalogData from "@/data/stellar/star-catalog.json";
import constellationData from "@/data/stellar/constellations.json";
import { validateStellarData } from "../validate-stellar-data";
import { positionStars } from "../coordinates";

describe("Stellar Data Integration", () => {
  it("star catalog has at least 20 stars", () => {
    expect(starCatalogData.stars.length).toBeGreaterThanOrEqual(20);
  });

  it("all stars have unique IDs", () => {
    const ids = starCatalogData.stars.map((s) => s.id);
    const unique = new Set(ids);
    expect(ids.length).toBe(unique.size);
  });

  it("all stars have valid RA (0-360)", () => {
    for (const s of starCatalogData.stars) {
      expect(s.ra).toBeGreaterThanOrEqual(0);
      expect(s.ra).toBeLessThanOrEqual(360);
    }
  });

  it("all stars have valid Dec (-90 to 90)", () => {
    for (const s of starCatalogData.stars) {
      expect(s.dec).toBeGreaterThanOrEqual(-90);
      expect(s.dec).toBeLessThanOrEqual(90);
    }
  });

  it("all stars have bilingual content", () => {
    for (const s of starCatalogData.stars) {
      expect(s.content.en.description).toBeTruthy();
      expect(s.content.id.description).toBeTruthy();
      expect(s.content.en.facts.length).toBeGreaterThan(0);
      expect(s.content.id.facts.length).toBeGreaterThan(0);
    }
  });

  it("constellation data validates against star catalog", () => {
    const result = validateStellarData(
      starCatalogData as never,
      constellationData as never,
    );
    expect(result.errors).toHaveLength(0);
  });

  it("all constellation line stars exist in catalog", () => {
    const starIds = new Set(starCatalogData.stars.map((s) => s.id));
    for (const c of constellationData.constellations) {
      for (const line of c.lines) {
        expect(starIds.has(line.from)).toBe(true);
        expect(starIds.has(line.to)).toBe(true);
      }
    }
  });

  it("positionStars returns coordinates for all stars", () => {
    const positioned = positionStars(starCatalogData.stars as never);
    expect(positioned.length).toBe(starCatalogData.stars.length);
    for (const p of positioned) {
      expect(p.x).toBeDefined();
      expect(p.y).toBeDefined();
      expect(p.z).toBeDefined();
    }
  });
});
