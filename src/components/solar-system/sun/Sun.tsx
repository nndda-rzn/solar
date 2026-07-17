"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import { SunCoronaShader } from "./SunCoronaShader";
import { SunPointLight } from "./SunPointLight";

export function Sun() {
  const meshRef = useRef<THREE.Mesh>(null);

  const sunTexture = useTexture("/textures/solar-system/sun/diffuse.webp");

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
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

      <SunCoronaShader />
      <SunPointLight />
    </group>
  );
}
