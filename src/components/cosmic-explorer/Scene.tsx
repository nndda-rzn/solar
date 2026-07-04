"use client";

import { Stars, OrbitControls } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { Camera } from "./Camera";
import { Lighting } from "./Lighting";
import { ScaleManager } from "./ScaleManager";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { StellarScene } from "@/components/stellar";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function Scene() {
  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const scale = useExplorerStore((s) => s.scale);
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
      {scale === "solar" && <SolarSystemScene />}
      {scale === "stellar" && <StellarScene />}
      <OrbitControls
        enabled={!isFlying}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={600}
      />
      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    </>
  );
}
