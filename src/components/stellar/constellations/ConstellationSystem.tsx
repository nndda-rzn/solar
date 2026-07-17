"use client";

import { Constellation } from "./Constellation";
import { ConstellationData } from "@/types/celestial/constellation";
import { StarPosition } from "@/types/celestial/star";

interface ConstellationSystemProps {
  constellations: ConstellationData[];
  starPositions: Map<string, StarPosition>;
}

export function ConstellationSystem({
  constellations,
  starPositions,
}: ConstellationSystemProps) {
  return (
    <group>
      {constellations.map((constellation) => (
        <Constellation
          key={constellation.id}
          data={constellation}
          starPositions={starPositions}
        />
      ))}
    </group>
  );
}
