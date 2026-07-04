"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useProceduralTexture } from "@/hooks/useProceduralTexture";
import { ProceduralTextureConfig } from "@/types/celestial/dwarf-planet";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface ProceduralSurfaceProps {
  radius: number;
  proceduralTexture: ProceduralTextureConfig;
  rotationSpeed: number;
  tilt: number;
}

export function ProceduralSurface({
  radius,
  proceduralTexture,
  rotationSpeed,
  tilt,
}: ProceduralSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const material = useProceduralTexture(proceduralTexture);

  useFrame(() => {
    if (meshRef.current) {
      const { dayOffset } = useSimulationStore.getState();
      meshRef.current.rotation.y = dayOffset * rotationSpeed * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <sphereGeometry args={[radius, 32, 32]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
