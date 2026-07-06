"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useExplorerStore } from "@/lib/store/explorer-store";

export function Camera() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const frameCount = useRef(0);

  useFrame(() => {
    if (!cameraRef.current) return;

    frameCount.current += 1;
    if (frameCount.current % 10 === 0) {
      useExplorerStore
        .getState()
        .setCameraPosition(cameraRef.current.position.clone());
    }

    const { cameraTarget } = useExplorerStore.getState();
    if (!cameraTarget) return;

    const cam = cameraRef.current;
    const offset = new THREE.Vector3(10, 15, 20);
    const targetPos = cameraTarget.clone().add(offset);

    cam.position.lerp(targetPos, 0.02);
    cam.lookAt(cameraTarget);
  });

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 40, 80]}
      fov={60}
      near={0.1}
      far={100000}
    />
  );
}
