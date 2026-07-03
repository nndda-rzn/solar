"use client";

import { Stars, OrbitControls } from "@react-three/drei";
import { Camera } from "./Camera";
import { Lighting } from "./Lighting";
import { ScaleManager } from "./ScaleManager";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function Scene() {
  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const isFlying = !!selectedPlanet;

  return (
    <>
      <Camera />
      <Lighting />
      <ScaleManager />
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
        enabled={!isFlying}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={600}
      />
    </>
  );
}
