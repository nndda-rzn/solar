"use client";

import * as THREE from "three";

interface PlanetAtmosphereProps {
  radius: number;
  color: string;
  opacity?: number;
}

export function PlanetAtmosphere({
  radius,
  color,
  opacity = 0.2,
}: PlanetAtmosphereProps) {
  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={opacity}
        side={THREE.BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}
