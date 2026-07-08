"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Scene } from "./Scene";
import { SceneLoader } from "./SceneLoader";
import { HUD } from "@/components/ui/HUD";
import { CosmicLoader } from "@/components/ui/CosmicLoader";
import { useSettings } from "@/hooks/useSettings";

class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  override componentDidCatch(error: Error) {
    console.error("[Canvas Error]", error);
  }
  override render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function CosmicExplorer() {
  const perfMode = useSettings((s) => s.perfMode);
  const dpr =
    perfMode === "high"
      ? ([1, 2] as [number, number])
      : ([1, 1] as [number, number]);

  return (
    <div className="flex h-screen items-center justify-center bg-[#060810] p-4">
      <div className="relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black">
        <CanvasErrorBoundary
          fallback={
            <div className="flex h-full w-full items-center justify-center bg-cosmic-deep">
              <CosmicLoader label="Failed to render 3D scene. Please refresh." />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 40, 80], fov: 60 }}
            gl={{ antialias: true }}
            dpr={dpr}
          >
            <Scene />
          </Canvas>
        </CanvasErrorBoundary>
        <SceneLoader />
        <HUD />
      </div>
    </div>
  );
}
