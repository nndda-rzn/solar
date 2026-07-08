import type { PlanetData } from "@/types/celestial/planet";
import type { DwarfPlanetData } from "@/types/celestial/dwarf-planet";
import type { StarPosition } from "@/types/celestial/star";
import type { ConstellationData } from "@/types/celestial/constellation";

export type SearchableObjectType =
  "star" | "planet" | "dwarf planet" | "stellar" | "constellation";

export interface SearchableObject {
  id: string;
  name: string;
  color: string;
  type: SearchableObjectType;
  distanceScaled?: number;
  x?: number;
  y?: number;
  z?: number;
  stars?: string[];
}

export interface BuildSearchIndexParams {
  planets: PlanetData[];
  dwarfPlanets: DwarfPlanetData[];
  stars: StarPosition[];
  constellations: ConstellationData[];
  locale: string;
}

/**
 * Pure function that assembles the combined searchable index of all
 * celestial objects (sun, planets, dwarf planets, stars, constellations).
 *
 * Mirrors the `allObjects` construction previously inlined in
 * `SearchModal.tsx`.
 */
export function buildSearchIndex({
  planets,
  dwarfPlanets,
  stars,
  constellations,
  locale,
}: BuildSearchIndexParams): SearchableObject[] {
  return [
    {
      id: "sun",
      name: "Sun",
      color: "#FBBF24",
      type: "star",
    },
    ...planets.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color || "#ffffff",
      type: "planet" as const,
      distanceScaled: p.distanceScaled,
    })),
    ...dwarfPlanets.map((dp) => ({
      id: dp.id,
      name: dp.name,
      color: dp.color,
      type: "dwarf planet" as const,
      distanceScaled: dp.distanceScaled,
    })),
    ...stars.map((s) => ({
      id: s.id,
      name: s.name,
      color: s.color,
      type: "stellar" as const,
      x: s.x,
      y: s.y,
      z: s.z,
    })),
    ...constellations.map((c) => ({
      id: c.id,
      name: locale === "id" ? c.indonesianName : c.name,
      color: "#4a9eff",
      type: "constellation" as const,
      stars: c.stars,
    })),
  ];
}

/**
 * Maps a SearchableObject `type` to the i18n namespace + key that should be
 * used to resolve its display label. The actual `t()` call must happen in a
 * component with access to `useTranslations`, since translation functions
 * are not pure.
 */
export const TYPE_LABEL_KEYS: Record<
  SearchableObjectType,
  { namespace: "common" | "stellar"; key: string }
> = {
  star: { namespace: "common", key: "types.star" },
  planet: { namespace: "common", key: "types.planet" },
  "dwarf planet": { namespace: "common", key: "types.dwarfPlanet" },
  stellar: { namespace: "stellar", key: "types.star" },
  constellation: { namespace: "stellar", key: "types.constellation" },
};
