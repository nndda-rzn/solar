"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    if (glowRef.current) {
      const scale = 1 + Math.sin(Date.now() * 0.001) * 0.02;
      glowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[5, 64, 64]} />
        <meshBasicMaterial color="#ffaa00" />
      </mesh>

      <mesh ref={glowRef} scale={1.2}>
        <sphereGeometry args={[5, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={2}
        distance={1000}
        decay={2}
        color="#fff5e6"
      />
    </group>
  );
}
