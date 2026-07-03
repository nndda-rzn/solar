"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { HUD } from "@/components/ui/HUD";

export function CosmicExplorer() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#060810] p-4">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black">
        <Canvas
          camera={{ position: [0, 40, 80], fov: 60 }}
          gl={{ antialias: true }}
          dpr={[1, 2]}
        >
          <Scene />
        </Canvas>
        <HUD />
      </div>
    </div>
  );
}
