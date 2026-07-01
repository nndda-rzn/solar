import { useMemo } from "react";
import planetData from "@/data/solar-system/planets.json";
import { PlanetData } from "@/types/celestial/planet";

export function usePlanetData() {
  const planets = useMemo(() => {
    return planetData.planets.map((p) => ({
      ...p,
      textures: p.textures || {},
      hasAtmosphere: p.hasAtmosphere || false,
      hasRing: p.hasRing || false,
    })) as PlanetData[];
  }, []);

  const sun = useMemo(() => {
    return planetData.sun;
  }, []);

  const getPlanetBySlug = (slug: string): PlanetData | undefined => {
    return planets.find((p) => p.slug === slug);
  };

  return {
    planets,
    sun,
    getPlanetBySlug,
  };
}
