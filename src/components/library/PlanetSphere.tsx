"use client";

import { useCallback, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { Mesh } from "three";

const SLOW_SPEED = 0.4;
const FAST_SPEED = 1.6;
const SCENE_DPR: [number, number] = [1, 2];

function RotatingSphere({ url, fast }: { url: string; fast: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(url);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (fast ? FAST_SPEED : SLOW_SPEED);
    }
  });
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.2, 48, 48]} />
      <meshStandardMaterial map={texture} roughness={0.7} metalness={0} />
    </mesh>
  );
}

export interface PlanetSphereProps {
  url: string;
}

export function PlanetSphere({ url }: PlanetSphereProps) {
  const [spinning, setSpinning] = useState(false);
  const toggle = useCallback(() => setSpinning((s) => !s), []);
  return (
    <button
      type="button"
      role="img"
      aria-label="3D planet preview"
      aria-pressed={spinning}
      onClick={toggle}
      className="relative h-32 w-32 cursor-pointer overflow-hidden rounded-full border border-white/10 bg-cosmic-black/60 transition hover:border-cosmic-accent/40"
    >
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 35 }}
        dpr={SCENE_DPR}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 2, 5]} intensity={1.4} />
        <pointLight position={[-3, -1, -2]} intensity={0.3} />
        <RotatingSphere url={url} fast={spinning} />
      </Canvas>
    </button>
  );
}
