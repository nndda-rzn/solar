"use client";

import { useMemo } from "react";
import { StarField } from "./stars/StarField";
import { ConstellationSystem } from "./constellations/ConstellationSystem";
import { useStarData } from "@/hooks/data/useStarData";
import { useConstellationData } from "@/hooks/data/useConstellationData";

export function StellarScene() {
  const { stars } = useStarData();
  const { constellations } = useConstellationData();

  const starPositions = useMemo(() => {
    const map = new Map();
    stars.forEach((star) => map.set(star.id, star));
    return map;
  }, [stars]);

  return (
    <group>
      <StarField stars={stars} />
      <ConstellationSystem
        constellations={constellations}
        starPositions={starPositions}
      />
    </group>
  );
}
