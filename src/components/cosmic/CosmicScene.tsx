"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

const GALAXY_COUNT = 100;
const FIELD_RADIUS = 40000;

interface GalaxyPoint {
  position: THREE.Vector3;
  color: THREE.Color;
  scale: number;
}

function buildGalaxyField(): GalaxyPoint[] {
  const galaxies: GalaxyPoint[] = [];
  const palette = ["#8ab4ff", "#fff4d6", "#ffb08a", "#c9a8ff"];

  for (let i = 0; i < GALAXY_COUNT; i++) {
    const radius = FIELD_RADIUS * (0.2 + Math.random() * 0.8);
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    const position = new THREE.Vector3(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi),
    );

    galaxies.push({
      position,
      color: new THREE.Color(palette[i % palette.length]),
      scale: 40 + Math.random() * 120,
    });
  }

  return galaxies;
}

function GalaxyDot({ galaxy }: { galaxy: GalaxyPoint }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <mesh ref={meshRef} position={galaxy.position}>
      <sphereGeometry args={[galaxy.scale, 12, 12]} />
      <meshBasicMaterial
        color={galaxy.color}
        transparent
        opacity={0.35}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

export function CosmicScene() {
  const galaxies = useMemo(() => buildGalaxyField(), []);
  const geometriesRef = useRef<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    return () => {
      geometriesRef.current.forEach((g) => g.dispose());
      geometriesRef.current = [];
    };
  }, []);

  return (
    <group>
      <Stars
        radius={FIELD_RADIUS * 1.5}
        depth={200}
        count={8000}
        factor={6}
        saturation={0}
        fade
        speed={0.2}
      />
      {galaxies.map((galaxy, i) => (
        <GalaxyDot key={i} galaxy={galaxy} />
      ))}
    </group>
  );
}
