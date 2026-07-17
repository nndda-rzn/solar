"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
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
  const { camera } = useThree();
  const dayOffset = useSimulationStore((state) => state.dayOffset);

  const textureMap: Record<string, string> = {};
  if (textures.diffuse) textureMap.map = textures.diffuse;
  if (textures.normal) textureMap.normalMap = textures.normal;
  if (textures.specular) textureMap.roughnessMap = textures.specular;
  if (textures.emissive) textureMap.emissiveMap = textures.emissive;

  const loadedTextures = useTexture(textureMap);

  // LOD geometries: 64 segments (close), 32 (medium), 16 (far)
  const geometries = useMemo(
    () => ({
      high: new THREE.SphereGeometry(radius, 64, 64),
      medium: new THREE.SphereGeometry(radius, 32, 32),
      low: new THREE.SphereGeometry(radius, 16, 16),
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
