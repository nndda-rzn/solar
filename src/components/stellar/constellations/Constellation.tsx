"use client";

import { ConstellationData } from "@/types/celestial/constellation";
import { StarPosition } from "@/types/celestial/star";
import { ConstellationLines } from "./ConstellationLines";

interface ConstellationProps {
  data: ConstellationData;
  starPositions: Map<string, StarPosition>;
}

export function Constellation({ data, starPositions }: ConstellationProps) {
  return (
    <group>
      <ConstellationLines lines={data.lines} starPositions={starPositions} />
    </group>
  );
}
