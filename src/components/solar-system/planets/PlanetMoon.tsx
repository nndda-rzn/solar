"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MoonData } from "@/types/celestial/planet";
import { useSimulationStore } from "@/lib/store/simulation-store";

interface PlanetMoonProps {
  moonData: MoonData;
}

export function PlanetMoon({ moonData }: PlanetMoonProps) {
  const groupRef = useRef<THREE.Group>(null);

  const texture = moonData.texture ? useTexture(moonData.texture) : undefined;

  const moonRadius = Math.max(moonData.radius, 0.3);

  useFrame((state) => {
    if (!groupRef.current) return;

    const { isPlaying, speed } = useSimulationStore.getState();
    if (!isPlaying) return;

    const dayOffset = state.clock.getElapsedTime() * speed;
    const angle =
      ((dayOffset / moonData.orbitalPeriod) * 2 * Math.PI) % (2 * Math.PI);

    groupRef.current.position.x = moonData.orbitRadius * Math.cos(angle);
    groupRef.current.position.z = moonData.orbitRadius * Math.sin(angle);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[moonRadius, 32, 32]} />
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
