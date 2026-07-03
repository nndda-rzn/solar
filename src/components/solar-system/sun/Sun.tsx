"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const glow2Ref = useRef<THREE.Mesh>(null);
  const glow3Ref = useRef<THREE.Mesh>(null);

  const sunTexture = useTexture("/textures/solar-system/sun/diffuse.webp");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
    const t = Date.now() * 0.001;
    if (glowRef.current) {
      const scale = 1.5 + Math.sin(t) * 0.03;
      glowRef.current.scale.setScalar(scale);
    }
    if (glow2Ref.current) {
      const scale = 2.0 + Math.sin(t * 0.7) * 0.04;
      glow2Ref.current.scale.setScalar(scale);
    }
    if (glow3Ref.current) {
      const scale = 2.8 + Math.sin(t * 0.5) * 0.05;
      glow3Ref.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[10, 64, 64]} />
        <meshStandardMaterial
          map={sunTexture}
          emissiveMap={sunTexture}
          emissive={new THREE.Color("#ffaa00")}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Inner glow */}
      <mesh ref={glowRef} scale={1.5}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa00"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Mid glow */}
      <mesh ref={glow2Ref} scale={2.0}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glow3Ref} scale={2.8}>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial
          color="#ff6600"
          transparent
          opacity={0.02}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={500}
        distance={2000}
        decay={1}
        color="#fff5e6"
      />
    </group>
  );
}
