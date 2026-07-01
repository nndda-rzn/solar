"use client";

import { useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PlanetData } from "@/types/celestial/planet";
import { calculateOrbitalPosition } from "@/lib/utils/astronomy";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { useExplorerStore } from "@/lib/store/explorer-store";

interface PlanetProps {
  planet: PlanetData;
}

export function Planet({ planet }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const { isPlaying, speed } = useSimulationStore();
  const { selectPlanet, selectedPlanet } = useExplorerStore();

  const diffuse = useTexture(planet.textures.diffuse || "");

  const normal = planet.textures.normal
    ? useTexture(planet.textures.normal)
    : null;

  const specular = planet.textures.specular
    ? useTexture(planet.textures.specular)
    : null;

  const emissive = planet.textures.emissive
    ? useTexture(planet.textures.emissive)
    : null;

  const clouds = planet.textures.clouds
    ? useTexture(planet.textures.clouds)
    : null;

  const ringTexture = planet.textures.ring
    ? useTexture(planet.textures.ring)
    : null;

  const atmosphereTexture = planet.textures.atmosphere
    ? useTexture(planet.textures.atmosphere)
    : null;

  const planetRadius = Math.max(planet.radius * 2, 0.5);
  const isSelected = selectedPlanet === planet.id;

  useFrame((state) => {
    if (!groupRef.current || !meshRef.current) return;

    if (isPlaying) {
      const dayOffset = state.clock.getElapsedTime() * speed;
      const position = calculateOrbitalPosition(
        planet.distanceScaled * 10,
        planet.orbitalPeriod,
        dayOffset,
        0,
      );
      groupRef.current.position.set(position.x, position.y, position.z);
    }

    meshRef.current.rotation.y += planet.rotationSpeed * 0.01;

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += planet.rotationSpeed * 0.012;
    }

    const targetScale = hovered || isSelected ? 1.15 : 1;
    meshRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.1,
    );
  });

  const handleClick = useCallback(
    (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      selectPlanet(isSelected ? null : planet.id);
    },
    [isSelected, planet.id, selectPlanet],
  );

  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        rotation={[THREE.MathUtils.degToRad(planet.tilt), 0, 0]}
      >
        <sphereGeometry args={[planetRadius, 64, 64]} />
        <meshStandardMaterial
          map={diffuse}
          normalMap={normal || undefined}
          roughnessMap={specular || undefined}
          emissiveMap={emissive || undefined}
          emissive={
            emissive
              ? new THREE.Color(planet.color || "#ffffff")
              : new THREE.Color(0x000000)
          }
          emissiveIntensity={emissive ? 0.4 : 0}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {clouds && !planet.textures.normal && null}

      {clouds && (
        <mesh ref={cloudsRef} scale={1.02}>
          <sphereGeometry args={[planetRadius, 32, 32]} />
          <meshStandardMaterial
            map={clouds}
            transparent
            opacity={0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {atmosphereTexture && (
        <mesh scale={1.08}>
          <sphereGeometry args={[planetRadius, 32, 32]} />
          <meshBasicMaterial
            color={planet.atmosphereColor || "#4a9eff"}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      )}

      {ringTexture && (
        <mesh ref={ringRef} rotation={[THREE.MathUtils.degToRad(90), 0, 0]}>
          <ringGeometry args={[planetRadius * 1.5, planetRadius * 2.5, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            transparent
            opacity={0.8}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
    </group>
  );
}
