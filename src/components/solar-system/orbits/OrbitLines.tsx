"use client";

import * as THREE from "three";
import { usePlanetData } from "@/hooks/data/usePlanetData";

function OrbitLine({ radius }: { radius: number }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Core line */}
      <mesh>
        <ringGeometry args={[radius - 0.2, radius + 0.2, 128]} />
        <meshBasicMaterial
          color="#4a9eff"
          opacity={0.3}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
      {/* Glow */}
      <mesh>
        <ringGeometry args={[radius - 0.8, radius + 0.8, 128]} />
        <meshBasicMaterial
          color="#4a9eff"
          opacity={0.08}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export function OrbitLines() {
  const { planets } = usePlanetData();

  return (
    <group>
      {planets.map((planet) => (
        <OrbitLine key={planet.id} radius={planet.distanceScaled * 10} />
      ))}
    </group>
  );
}
