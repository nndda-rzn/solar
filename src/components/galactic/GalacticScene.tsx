"use client";

import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const PARTICLE_COUNT = 50000;
const ARM_COUNT = 4;
const GALAXY_RADIUS = 200;
const CORE_COLOR = new THREE.Color("#fff4d6");
const ARM_COLOR = new THREE.Color("#8ab4ff");

function buildGalaxyGeometry(): THREE.BufferGeometry {
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const tempColor = new THREE.Color();

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const arm = i % ARM_COUNT;
    const armOffset = (arm / ARM_COUNT) * Math.PI * 2;
    const radius = Math.random() * GALAXY_RADIUS;
    const spinAngle = radius * 0.06;
    const randomSpread =
      (Math.random() - 0.5) * 0.6 * (radius / GALAXY_RADIUS + 0.1);
    const angle = armOffset + spinAngle + randomSpread;

    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    const y = (Math.random() - 0.5) * 8 * (1 - radius / GALAXY_RADIUS);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const t = Math.min(1, radius / GALAXY_RADIUS);
    tempColor.copy(CORE_COLOR).lerp(ARM_COLOR, t);
    colors[i * 3] = tempColor.r;
    colors[i * 3 + 1] = tempColor.g;
    colors[i * 3 + 2] = tempColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geometry;
}

export function GalacticScene() {
  const pointsRef = useRef<THREE.Points>(null);

  const geometry = useMemo(() => buildGalaxyGeometry(), []);

  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group>
      <points ref={pointsRef} geometry={geometry}>
        <pointsMaterial
          size={1.2}
          vertexColors
          transparent
          opacity={0.85}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <mesh>
        <sphereGeometry args={[8, 32, 32]} />
        <meshBasicMaterial
          color={CORE_COLOR}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
