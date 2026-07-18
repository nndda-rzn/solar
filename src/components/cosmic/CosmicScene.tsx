"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSettings } from "@/hooks/useSettings";

const FIELD_RADIUS = 40000;

interface GalaxyPoint {
  position: THREE.Vector3;
  color: THREE.Color;
  scale: number;
}

function buildGalaxyField(count: number): GalaxyPoint[] {
  const galaxies: GalaxyPoint[] = [];
  const palette = ["#8ab4ff", "#fff4d6", "#ffb08a", "#c9a8ff"];

  for (let i = 0; i < count; i++) {
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
  const reducedMotion = useReducedMotion();

  useFrame((_, delta) => {
    if (meshRef.current && !reducedMotion) {
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
  const perfMode = useSettings((s) => s.perfMode);
  const galaxyCount = perfMode === "high" ? 100 : 50;
  const starCount = perfMode === "high" ? 8000 : 4000;
  const galaxies = useMemo(() => buildGalaxyField(galaxyCount), [galaxyCount]);
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
        count={starCount}
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
