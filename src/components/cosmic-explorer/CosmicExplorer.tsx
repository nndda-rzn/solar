"use client";

import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";

export function CosmicExplorer() {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas
        camera={{ position: [0, 50, 100], fov: 60 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
