"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface PlanetCloudsProps {
  texturePath: string;
  radius: number;
  rotationSpeed: number;
  opacity?: number;
}

export function PlanetClouds({
  texturePath,
  radius,
  rotationSpeed,
  opacity = 0.4,
}: PlanetCloudsProps) {
  const ref = useRef<THREE.Mesh>(null);
  const tex = useTexture(texturePath);

  useFrame(() => {
    if (ref.current) {
      const { dayOffset } = useSimulationStore.getState();
      // Cloud rotation slightly faster than surface, tied to same time source
      ref.current.rotation.y = dayOffset * rotationSpeed * 0.012;
    }
  });

  return (
    <mesh ref={ref} scale={1.02}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshStandardMaterial
        map={tex}
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </mesh>
  );
}
