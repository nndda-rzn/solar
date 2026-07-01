"use client";

import { Stars, OrbitControls } from "@react-three/drei";
import { Camera } from "./Camera";
import { Lighting } from "./Lighting";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";

export function Scene() {
  return (
    <>
      <Camera />
      <Lighting />
      <Stars
        radius={5000}
        depth={100}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      <SolarSystemScene />
      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={500}
      />
    </>
  );
}
