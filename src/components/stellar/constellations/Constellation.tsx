"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { ConstellationData } from "@/types/celestial/constellation";
import { StarPosition } from "@/types/celestial/star";
import { ConstellationLines } from "./ConstellationLines";
import { useCelestialSelection } from "@/hooks/useCelestialSelection";

interface ConstellationProps {
  data: ConstellationData;
  starPositions: Map<string, StarPosition>;
}

export function Constellation({ data, starPositions }: ConstellationProps) {
  const {
    isSelected,
    isHovered,
    handleClickWithPosition,
    handlePointerOver,
    handlePointerOut,
  } = useCelestialSelection("constellation", data.id);

  // Calculate centroid for click target and bounding sphere for clickable area
  const { centroid, boundingRadius } = useMemo(() => {
    const positions = data.stars
      .map((id) => starPositions.get(id))
      .filter((pos): pos is StarPosition => pos !== undefined);

    if (positions.length === 0) {
      return { centroid: new THREE.Vector3(), boundingRadius: 50 };
    }

    const center = new THREE.Vector3();
    positions.forEach((p) => center.add(new THREE.Vector3(p.x, p.y, p.z)));
    center.divideScalar(positions.length);

    let radius = 0;
    positions.forEach((p) => {
      const dist = center.distanceTo(new THREE.Vector3(p.x, p.y, p.z));
      if (dist > radius) radius = dist;
    });

    return { centroid: center, boundingRadius: radius + 20 }; // +20 padding
  }, [data.stars, starPositions]);

  return (
    <group>
      {/* Invisible clickable sphere for constellation interaction */}
      <mesh
        position={[centroid.x, centroid.y, centroid.z]}
        onClick={(e) => {
          e.stopPropagation();
          handleClickWithPosition(e, centroid);
        }}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[boundingRadius, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      <ConstellationLines
        lines={data.lines}
        starPositions={starPositions}
        color={isSelected ? "#00ffff" : isHovered ? "#6ab4ff" : "#4a9eff"}
        opacity={isSelected ? 0.8 : isHovered ? 0.6 : 0.4}
      />
    </group>
  );
}
