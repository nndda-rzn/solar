"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { PlanetTextures } from "@/types/celestial/planet";
import { useSimulationStore } from "@/lib/store/simulation-store";
import { PLANET_ROTATION_UNIT } from "@/lib/config/simulation";

interface PlanetSurfaceProps {
  textures: PlanetTextures;
  radius: number;
  rotationSpeed: number;
  tilt: number;
  color?: string;
}

export function PlanetSurface({
  textures,
  radius,
  rotationSpeed,
  tilt,
  color,
}: PlanetSurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const textureMap: Record<string, string> = {};
  if (textures.diffuse) textureMap.map = textures.diffuse;
  if (textures.normal) textureMap.normalMap = textures.normal;
  if (textures.specular) textureMap.roughnessMap = textures.specular;
  if (textures.emissive) textureMap.emissiveMap = textures.emissive;

  const loadedTextures = useTexture(textureMap);

  useFrame(() => {
    if (meshRef.current) {
      const { dayOffset } = useSimulationStore.getState();
      // Rotation now tied to same dayOffset as orbit - synced time source
      meshRef.current.rotation.y =
        dayOffset * rotationSpeed * PLANET_ROTATION_UNIT;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[THREE.MathUtils.degToRad(tilt), 0, 0]}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        map={loadedTextures.map ?? null}
        normalMap={loadedTextures.normalMap ?? null}
        roughnessMap={loadedTextures.roughnessMap ?? null}
        emissiveMap={loadedTextures.emissiveMap ?? null}
        emissive={
          loadedTextures.emissiveMap
            ? new THREE.Color(color || "#ffffff")
            : new THREE.Color(0x000000)
        }
        emissiveIntensity={loadedTextures.emissiveMap ? 0.4 : 0}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}
