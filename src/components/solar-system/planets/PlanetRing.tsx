"use client";

import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface PlanetRingProps {
  texturePath: string;
  radius: number;
  innerMultiplier?: number;
  outerMultiplier?: number;
}

export function PlanetRing({
  texturePath,
  radius,
  innerMultiplier = 1.5,
  outerMultiplier = 2.5,
}: PlanetRingProps) {
  const tex = useTexture(texturePath);

  return (
    <mesh rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
      <ringGeometry
        args={[radius * innerMultiplier, radius * outerMultiplier, 64]}
      />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  );
}
