"use client";

import { Planet } from "./Planet";
import { usePlanetData } from "@/hooks/data/usePlanetData";

export function PlanetConfig() {
  const { planets } = usePlanetData();

  return (
    <group>
      {planets.map((planet) => (
        <Planet key={planet.id} planet={planet} />
      ))}
    </group>
  );
}
