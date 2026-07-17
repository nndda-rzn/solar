import { useMemo } from "react";
import dwarfPlanetsData from "@/data/solar-system/dwarf-planets.json";
import { DwarfPlanetData } from "@/types/celestial/dwarf-planet";

export function useDwarfPlanetData() {
  const dwarfPlanets = useMemo(
    () => dwarfPlanetsData.dwarfPlanets as DwarfPlanetData[],
    [],
  );

  const getDwarfPlanetBySlug = useMemo(
    () => (slug: string) => dwarfPlanets.find((dp) => dp.slug === slug),
    [dwarfPlanets],
  );

  return { dwarfPlanets, getDwarfPlanetBySlug };
}
