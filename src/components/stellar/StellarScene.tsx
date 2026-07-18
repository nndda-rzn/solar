"use client";

import { useMemo, useEffect } from "react";
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

  // Cleanup on unmount (when scale changes away from stellar)
  useEffect(() => {
    return () => {
      // ConstellationLines already handles geometry disposal via its own useEffect
      // This cleanup serves as a safety net and provides visibility
      console.log("[StellarScene] Cleanup: stellar scene unmounted");
    };
  }, []);

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
