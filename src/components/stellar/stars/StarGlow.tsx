"use client";

import * as THREE from "three";

interface StarGlowProps {
  color: string;
  size: number;
  intensity?: number;
}

export function StarGlow({ color, size, intensity = 0.6 }: StarGlowProps) {
  return (
    <mesh scale={2.5}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity * 0.3}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
}
