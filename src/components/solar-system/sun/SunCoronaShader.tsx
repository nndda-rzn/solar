"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import coronaVert from "@/shaders/sun/corona.vert.glsl";
import coronaFragRaw from "@/shaders/sun/corona.frag.glsl";
import noiseGlsl from "@/shaders/common/noise.glsl";
import utilsGlsl from "@/shaders/common/utils.glsl";

export function SunCoronaShader() {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useRef(
    new THREE.ShaderMaterial({
      vertexShader: coronaVert.replace(
        "#pragma include <common/noise.glsl>",
        noiseGlsl,
      ),
      fragmentShader: coronaFragRaw
        .replace("#pragma include <common/noise.glsl>", noiseGlsl)
        .replace("#pragma include <common/utils.glsl>", utilsGlsl),
      uniforms: {
        u_time: { value: 0 },
        u_sunRadius: { value: 10.0 },
        u_coronaIntensity: { value: 1.5 },
        u_color1: { value: new THREE.Color("#ffcc66") },
        u_color2: { value: new THREE.Color("#ff6600") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    }),
  ).current;

  useFrame((state) => {
    material.uniforms.u_time.value = state.clock.getElapsedTime();
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[25, 64, 64]} />
    </mesh>
  );
}
