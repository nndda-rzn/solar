"use client";

import * as THREE from "three";
import { ConstellationLine } from "@/types/celestial/constellation";
import { StarPosition } from "@/types/celestial/star";

interface ConstellationLinesProps {
  lines: ConstellationLine[];
  starPositions: Map<string, StarPosition>;
  color?: string;
  opacity?: number;
}

export function ConstellationLines({
  lines,
  starPositions,
  color = "#4a9eff",
  opacity = 0.4,
}: ConstellationLinesProps) {
  return (
    <group>
      {lines.map((line, i) => {
        const starA = starPositions.get(line.from);
        const starB = starPositions.get(line.to);

        if (!starA || !starB) return null;

        const path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(starA.x, starA.y, starA.z),
          new THREE.Vector3(starB.x, starB.y, starB.z),
        ]);

        return (
          <mesh key={`${line.from}-${line.to}-${i}`}>
            <tubeGeometry args={[path, 8, 0.15, 8, false]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
}
