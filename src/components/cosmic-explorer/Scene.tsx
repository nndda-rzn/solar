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
import { SimulationClock } from "./SimulationClock";
import { SolarSystemScene } from "@/components/solar-system/SolarSystemScene";
import { StellarScene } from "@/components/stellar";
import { GalacticScene } from "@/components/galactic/GalacticScene";
import { CosmicScene } from "@/components/cosmic/CosmicScene";
import { useExplorerStore } from "@/lib/store/explorer-store";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSettings } from "@/hooks/useSettings";

export function Scene() {
  const selectedPlanet = useExplorerStore((s) => s.selectedPlanet);
  const scale = useExplorerStore((s) => s.scale);
  const isFlying = !!selectedPlanet;
  const reducedMotion = useReducedMotion();
  const perfMode = useSettings((s) => s.perfMode);
  const starCount = perfMode === "high" ? 5000 : 2000;

  return (
    <>
      <Camera />
      <Lighting />
      <ScaleManager />
      <SimulationClock />
      <Stars
        radius={5000}
        depth={100}
        count={starCount}
        factor={4}
        saturation={0}
        fade
        speed={reducedMotion ? 0 : 0.5}
      />
      {scale === "solar" && <SolarSystemScene />}
      {scale === "stellar" && <StellarScene />}
      {scale === "galactic" && <GalacticScene />}
      {scale === "cosmic" && <CosmicScene />}
      <OrbitControls
        enabled={!isFlying}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={100000}
        enableDamping
        dampingFactor={0.05}
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
