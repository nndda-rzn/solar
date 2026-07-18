"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MoonData } from "@/types/celestial/planet";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface PlanetMoonProps {
  moonData: MoonData;
}

export function PlanetMoon({ moonData }: PlanetMoonProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const dayOffset = useSimulationStore((state) => state.dayOffset);

  const texture = moonData.texture ? useTexture(moonData.texture) : undefined;

  const moonRadius = Math.max(moonData.radius, 0.3);

  const geometries = useMemo(
    () => ({
      high: new THREE.SphereGeometry(moonRadius, 32, 32),
      medium: new THREE.SphereGeometry(moonRadius, 16, 16),
      low: new THREE.SphereGeometry(moonRadius, 8, 8),
    }),
    [moonRadius],
  );

  useFrame(() => {
    if (!groupRef.current) return;

    const angle =
      ((dayOffset / moonData.orbitalPeriod) * 2 * Math.PI) % (2 * Math.PI);

    groupRef.current.position.x = moonData.orbitRadius * Math.cos(angle);
    groupRef.current.position.z = moonData.orbitRadius * Math.sin(angle);

    if (meshRef.current) {
      const distance = camera.position.distanceTo(
        meshRef.current.getWorldPosition(new THREE.Vector3()),
      );
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
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <primitive object={geometries.high} />
        {texture ? (
          <meshStandardMaterial map={texture} roughness={0.9} metalness={0.1} />
        ) : (
          <meshStandardMaterial color={moonData.color} roughness={0.9} />
        )}
      </mesh>

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[moonData.orbitRadius - 0.1, moonData.orbitRadius + 0.1, 64]}
        />
        <meshBasicMaterial
          color={moonData.color}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
