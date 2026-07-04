"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import asteroidConfig from "@/data/solar-system/asteroid-belt.json";

export function AsteroidBelt() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const { count, innerRadius, outerRadius, thickness, sizeRange, color } =
    asteroidConfig;

  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1, 0), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({ color, roughness: 0.9, metalness: 0.1 }),
    [color],
  );

  useEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * thickness;
      const scale =
        sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);

      dummy.position.set(
        radius * Math.cos(angle),
        height,
        radius * Math.sin(angle),
      );
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI,
      );
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, innerRadius, outerRadius, thickness, sizeRange]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += asteroidConfig.orbitSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[geometry, material, count]} />
    </group>
  );
}
