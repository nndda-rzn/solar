"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useProceduralTexture } from "@/hooks/useProceduralTexture";
import { ProceduralTextureConfig } from "@/types/celestial/dwarf-planet";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { PLANET_ROTATION_UNIT } from "@/lib/config/simulation";

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
  const { camera } = useThree();
  const dayOffset = useSimulationStore((state) => state.dayOffset);
  const material = useProceduralTexture(proceduralTexture);

  const geometries = useMemo(
    () => ({
      high: new THREE.SphereGeometry(radius, 32, 32),
      medium: new THREE.SphereGeometry(radius, 16, 16),
      low: new THREE.SphereGeometry(radius, 8, 8),
    }),
    [radius],
  );

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y =
        dayOffset * rotationSpeed * PLANET_ROTATION_UNIT;

      const distance = camera.position.distanceTo(meshRef.current.position);
      if (distance < 50) {
        meshRef.current.geometry = geometries.high;
      } else if (distance < 150) {
        meshRef.current.geometry = geometries.medium;
      } else {
        meshRef.current.geometry = geometries.low;
      }
    }
  });

  return (
    <mesh ref={meshRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <primitive object={geometries.high} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
